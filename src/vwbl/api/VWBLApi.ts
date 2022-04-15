import axios from "axios";

export class VWBLApi {
  private instance;
  constructor(endpointUrl: string) {
    this.instance = axios.create({ baseURL: endpointUrl });
  }
  async setKey(documentId: string, key: string, signature: string) {
    await this.instance.post("/keys", { document_id: documentId, key, signature });
  }
  async getKey(documentId: string, signature: string): Promise<string> {
    const response = await this.instance.get(`/keys/${documentId}?signature=${signature}`);
    return response.data.documentKey.key;
  }
}
