import { Client, SubmittableTransaction, xrpToDrops } from "xrpl";
import { NFTokenMintMetadata } from "xrpl/dist/npm/models/transactions/NFTokenMint";
import { PaymentMetadata } from "xrpl/dist/npm/models/transactions/payment";

export class VWBLXRPLProtocol {
  private client: Client;

  constructor(xrplChainId: number) {
    let publicServerUrl: string;
    switch (xrplChainId) {
      case 0:
        publicServerUrl = process.env.XRPL_MAINNET_PROVIDER_URL || "";
        break;
      case 1:
        publicServerUrl = process.env.XRPL_TESTNET_PROVIDER_URL || "";
        break;
      case 2:
        publicServerUrl = process.env.XRPL_DEVNET_PROVIDER_URL || "";
        break;
      default:
        throw new Error("Invalid xrplChainId");
    }
    const client = new Client(publicServerUrl);
    this.client = client;
  }

  async connect() {
    await this.client.connect();
  }

  async disconnect() {
    await this.client.disconnect();
  }

  async mint(signedMintTx: string) {
    this.connect();

    let tokenId: string;
    try {
      const response = await this.client.submitAndWait(signedMintTx);

      const txMetadata = response.result.meta as NFTokenMintMetadata;
      if (txMetadata.nftoken_id) {
        tokenId = txMetadata.nftoken_id;
      } else {
        throw Error("nftoken_id is empty");
      }
    } catch (e) {
      throw Error("failed to submit NFTokenMint tx");
    } finally {
      this.disconnect();
    }

    return tokenId;
  }

  async generatePaymentTx(tokenId: string, senderAddress: string) {
    this.connect();

    const accountInfo = await this.client.request({
      command: "account_info",
      account: senderAddress,
    });
    const sequence = accountInfo.result.account_data.Sequence;

    const ledger = await this.client.request({
      command: "ledger",
      ledger_index: "validated",
    });
    const currentLedgerIndex = ledger.result.ledger_index;
    this.disconnect();

    const paymentTxJson: SubmittableTransaction = {
      TransactionType: "Payment",
      Account: senderAddress,
      Destination: "", // TODO
      Amount: xrpToDrops("0.16"),
      Fee: xrpToDrops("0.0000000001"),
      LastLedgerSequence: currentLedgerIndex + 4,
      Sequence: sequence,
      Memos: [
        {
          Memo: {
            MemoData: tokenId,
          },
        },
      ],
    };

    return paymentTxJson;
  }

  async payMintFee(signedPaymentTx: string) {
    this.connect();

    try {
      const response = await this.client.submitAndWait(signedPaymentTx);
      if (response.result.TxnSignature) {
        const memos = response.result.Memos;
        if (memos && memos.length > 0) {
          return {
            paymentSignature: response.result.TxnSignature,
            tokenId: memos[0].Memo.MemoData,
          };
        }
      }
    } catch (e) {
      throw Error("failed to submit NFTokenMint tx");
    } finally {
      this.disconnect();
    }
  }
}
