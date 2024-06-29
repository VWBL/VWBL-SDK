import axios from "axios";

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
  ) {
    await this.instance.post("/keys", {
      document_id: documentId,
      chain_id: chainId,
      key,
      signature,
      address,
    });
  }

  async getKey(
    documentId: string,
    chainId: number,
    signature: string,
    address?: string
  ): Promise<string> {
    const response = await this.instance.get(
      `/keys/${documentId}/${chainId}?signature=${signature}&address=${address}`
    );
    return response.data.documentKey.key;
  }

  async getSignMessage(
    contractAddress: string,
    chainId: number,
    address?: string
  ): Promise<string> {
    const response = await this.instance.get(
      `/signature/${contractAddress}/${chainId}?address=${address}`
    );
    return response.data.signMessage;
  }
}
