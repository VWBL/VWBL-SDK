import axios from "axios";
import { SubmittableTransaction } from "xrpl";

export class VWBLApi {
  private instance;
  constructor(endpointUrl: string) {
    this.instance = axios.create({ baseURL: endpointUrl });
  }
  async setKey(
    documentId: string,
    chainId: number,
    key: string,
    signature: string,
    address?: string,
    hasNonce?: boolean,
    autoMigration?: boolean
  ) {
    await this.instance.post("/keys", {
      document_id: documentId,
      chain_id: chainId,
      key,
      signature,
      address,
      has_nonce: hasNonce,
      auto_migration: autoMigration,
    });
  }

  async setXrplKey(
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

  async getKey(documentId: string, chainId: number, signature: string, address?: string): Promise<string> {
    const response = await this.instance.get(
      `/keys/${documentId}/${chainId}?signature=${signature}&address=${address}`
    );
    return response.data.documentKey.key;
  }

  async getSignMessage(contractAddress: string, chainId: number, address?: string): Promise<string> {
    const response = await this.instance.get(`/signature/${contractAddress}/${chainId}?address=${address}`);
    return response.data.signMessage;
  }

  async getXrplSignMessage(xrplChainId: number, address: string): Promise<SubmittableTransaction> {
    const response = await this.instance.get(`/xrpl-signature/${xrplChainId}?address=${address}`);

    return response.data.signTx;
  }
}
