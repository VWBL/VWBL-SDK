import { Client, SubmittableTransaction, Wallet, xrpToDrops } from "xrpl";
import { XummSdk } from "xumm-sdk";
import { XummJsonTransaction } from "xumm-sdk/dist/src/types";

export class VWBLXRPLProtocol {
  private xumm: XummSdk;
  private client: Client;
  private walletAddress: string;

  constructor(xrplChainId: number, walletAddress: string, xumm: XummSdk) {
    this.xumm = xumm;
    this.walletAddress = walletAddress;

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

  async mintToken(
    transferRoyalty: number,
    isTransferable: boolean,
    isBurnable: boolean
  ) {
    const TagId = 11451419;
    const mintTxJson: XummJsonTransaction = {
      TransactionType: "NFTokenMint",
      Account: this.walletAddress,
      NFTokenTaxon: TagId,
      SourceTag: TagId,
      TransferFee: transferRoyalty,
      Flags: {
        tfTransferable: isTransferable,
        tfBurnable: isBurnable,
      },
    };

    let txId: string | null | undefined;
    let nftokenID: string | undefined;
    try {
      const response = await this.xumm.payload.create({ txjson: mintTxJson });
      if (response) {
        const payload = await this.xumm.payload.get(response);
        txId = payload?.response.txid;
      }
    } catch (e) {
      throw new Error(`NFTokenMint failed: ${e}`);
    }

    return nftokenID;
  }

  async payMintFee(
    nftokenId: string,
    destination: string,
    amount: string,
    gasFee: string
  ) {
    const accountInfo = await this.client.request({
      command: "account_info",
      account: this.walletAddress,
    });
    const sequence = accountInfo.result.account_data.Sequence;

    const ledger = await this.client.request({
      command: "ledger",
      ledger_index: "validated",
    });
    const currentLedgerIndex = ledger.result.ledger_index;

    const paymentTxJson: SubmittableTransaction = {
      TransactionType: "Payment",
      Account: this.walletAddress,
      Destination: destination,
      Amount: xrpToDrops(amount),
      Fee: xrpToDrops(gasFee),
      LastLedgerSequence: currentLedgerIndex + 4,
      Sequence: sequence,
      Memos: [
        {
          Memo: {
            MemoData: nftokenId,
          },
        },
      ],
    };

    // const signedPaymentTx = this.wallet.sign(paymentTxJson);
    // try {
    //   const response = await this.client.submitAndWait(signedPaymentTx.tx_blob);

    //   return response.result.hash;
    // } catch (e) {
    //   throw new Error(`Payment failed: ${e}`);
    // }
  }
}
