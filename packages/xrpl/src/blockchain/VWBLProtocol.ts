import {
  AccountNFToken,
  Client,
  Request,
  SubmittableTransaction,
  convertStringToHex,
  xrpToDrops,
} from "xrpl";
import { NFTokenMintMetadata } from "xrpl/dist/npm/models/transactions/NFTokenMint";

const MESSAGE = "Hello VWBL";

export class VWBLXRPLProtocol {
  private client: Client;

  constructor(xrplChainId: number) {
    let publicServerUrl: string;
    switch (xrplChainId) {
      case 0:
        publicServerUrl = "wss://s2.ripple.com";
        break;
      case 1:
        publicServerUrl = "wss://s.altnet.rippletest.net:51233";
        break;
      case 2:
        publicServerUrl = "wss://s.devnet.rippletest.net:51233";
        break;
      default:
        throw new Error("Invalid xrplChainId");
    }
    const client = new Client(publicServerUrl);
    this.client = client;
  }

  async mint(signedMintTx: string) {
    await this.client.connect();

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
      throw Error(`failed to submit NFTokenMint tx: ${e}`);
    } finally {
      await this.client.disconnect();
    }

    return tokenId;
  }

  async generatePaymentTx(
    tokenId: string,
    senderAddress: string,
    mintFee: string,
    destinationAddress: string
  ) {
    await this.client.connect();

    const fee = await this.client.request({
      command: "fee",
    });
    const drops = fee.result.drops;

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
    await this.client.disconnect();

    const paymentTxJson: SubmittableTransaction = {
      TransactionType: "Payment",
      Account: senderAddress,
      Destination: destinationAddress,
      Amount: xrpToDrops(mintFee),
      Fee: drops.minimum_fee,
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
    await this.client.connect();

    try {
      const response = await this.client.submitAndWait(signedPaymentTx);
      if (response.result.hash) {
        const memos = response.result.Memos;
        if (memos && memos[0].Memo.MemoData) {
          return {
            paymentTxHash: response.result.hash,
            tokenId: memos[0].Memo.MemoData,
          };
        }
      }
    } catch (e) {
      throw Error(`failed to submit Payment tx ${e}`);
    } finally {
      await this.client.disconnect();
    }
  }

  generateEmptyTx(senderAddress: string) {
    const emptyTxJson: SubmittableTransaction = {
      TransactionType: "AccountSet",
      Account: senderAddress,
      Memos: [
        {
          Memo: {
            MemoData: convertStringToHex(MESSAGE),
          },
        },
      ],
    };

    return emptyTxJson;
  }

  async fetchNFTInfo(
    address: string,
    nftokenId: string
  ): Promise<AccountNFToken> {
    await this.client.connect();
    const request: Request = {
      command: "account_nfts",
      account: address,
    };

    const accountNFTs = await this.client.request(request);
    const nftInfo = accountNFTs.result.account_nfts.find(
      (nft: AccountNFToken) => nft.NFTokenID === nftokenId
    );

    if (!nftInfo) {
      throw new Error(`NFT of ID: ${nftokenId} not found`);
    }
    await this.client.disconnect();

    return nftInfo;
  }
}
