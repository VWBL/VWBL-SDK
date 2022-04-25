import axios from "axios";

export class VWBLApi {
  private instance;
  constructor(endpointUrl: string) {
    this.instance = axios.create({ baseURL: endpointUrl });
  }
  async setKey(documentId: string, chainId: number, key: string, signature: string) {
    await this.instance.post("/keys", { document_id: documentId, chain_id: chainId, key, signature });
  }
  async getKey(documentId: string, chainId: number, signature: string): Promise<string> {
    const response = await this.instance.get(`/keys/${documentId}/${chainId}?signature=${signature}`);
    return response.data.documentKey.key;
  }
}
