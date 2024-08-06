import axios from "axios";

export class VWBLApi {
  private instance;
  constructor(endpointUrl: string) {
    this.instance = axios.create({ baseURL: endpointUrl });
  }
  async setKey(
    documentId: string,
    chainId: number | bigint,
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

  async getKey(documentId: string, chainId: number | bigint, signature: string, address?: string): Promise<string> {
    const response = await this.instance.get(
      `/keys/${documentId}/${chainId}?signature=${signature}&address=${address}`
    );
    return response.data.documentKey.key;
  }

  async getSignMessage(contractAddress: string, chainId: number | bigint, address?: string): Promise<string> {
    const response = await this.instance.get(`/signature/${contractAddress}/${chainId}?address=${address}`);
    return response.data.signMessage;
  }
}
