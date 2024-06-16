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
    signatureTxBlob: string,
    pubKey: string,
    address?: string
  ) {
    await this.instance.post("xrpl-keys", {
      document_id: documentId,
      xrpl_chain_id: xrplChainId,
      key,
      signature_tx_blob: signatureTxBlob,
      pub_key: pubKey,
      address,
    });
  }
  // TODO
  async getKey(documentId: string, address?: string) {}

  async getXrplSignMessage(xrplChainId: number, address: string): Promise<SubmittableTransaction> {
    const response = await this.instance.get(`/xrpl-signature/${xrplChainId}?address=${address}`);

    return response.data.signTx;
  }
}
