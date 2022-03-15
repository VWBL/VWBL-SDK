import axios from "axios";

export class VWBLApi {
  private instance;
  constructor(endpointUrl: string) {
    this.instance = axios.create({ baseURL: endpointUrl });
  }
  async setKey(tokenId: number, key: string, signature: string) {
    await this.instance.post("/keys", { token_id: tokenId, key, signature });
  }
  async getKey(tokenId: number, signature: string): Promise<string> {
    const response = await this.instance.get(`/keys/${tokenId}?signature=${signature}`);
    return response.data.tokenKey;
  }
}
