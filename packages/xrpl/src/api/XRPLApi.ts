import axios from "axios";
import { SubmittableTransaction } from "xrpl";

export class XRPLApi {
  private instance;
  constructor(endpointUrl: string) {
    this.instance = axios.create({ baseURL: endpointUrl });
  }

  async setKey(
    documentId: string,
    xrplChainId: number,
    key: string,
    signature: string,
    paymentTxHash: string,
    publicKey: string
  ) {
    await this.instance.post("/xrpl-keys", {
      document_id: documentId,
      xrpl_chain_id: xrplChainId,
      key,
      signature_tx_blob: signature,
      payment_tx_hash: paymentTxHash,
      pub_key: publicKey,
    });
  }
  // TODO
  async getKey(documentId: string, address?: string) {}

  async getXrplSignMessage(
    xrplChainId: number,
    address: string
  ): Promise<SubmittableTransaction> {
    const response = await this.instance.get(
      `/xrpl-signature/${xrplChainId}?address=${address}`
    );

    return response.data.signTx;
  }

  async getXrplPaymentInfo(
    tokenId: string,
    xrplChainId: number,
    walletAddress: string
  ) {
    const response = await this.instance.get(
      `/xrpl-payment/${tokenId}/${xrplChainId}?address=${walletAddress}`
    );

    return {
      mintFee: response.data.mintFee,
      destination: response.data.destination,
    };
  }
}
