import axios from "axios";
import { encrypt, decrypt, PrivateKey, PublicKey } from 'eciesjs';
import * as secrets from "secrets.js-grempe";

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
    autoMigration?: boolean
  ) {
    const keyMapping = await this.constractKeyMapping(key);
    await this.instance.post("/api/v1/keys", {
      userSig: signature,
      userAddress: address,
      documentId,
      chainId,
      autoMigration,
      keyMapping
    })
  }

  async migrateKey(
    documentId: string,
    chainId: number,
    key: string,
    signature: string,
    address?: string,
  ) {
    const keyMapping = await this.constractKeyMapping(key);
    await this.instance.post("api/v1/migrate", {
      userSig: signature,
      userAddress: address,
      documentId,
      chainId,
      keyMapping
    })
  }


  async getKey(documentId: string, chainId: number, signature: string, address?: string): Promise<string> {
    const privKey = new PrivateKey();
    const userPubKey = "0x" + privKey.publicKey.toHex();
    const encryptedKeys = (await this.instance.get(
        `/api/v1/keys/${documentId}/${chainId}?userSig=${signature}&userPubkey=${userPubKey}&userAddress=${address}`
    )).data.encryptedKeys;
    const keys = encryptedKeys.map((k: string) => decrypt(privKey.toHex(), Buffer.from(k, 'hex')).toString());
    return secrets.hex2str(secrets.combine(keys))
  }

  async getSignMessage(contractAddress: string, chainId: number, address?: string): Promise<string> {
    const response = await this.instance.get(`/signature/${contractAddress}/${chainId}?address=${address}`);
    return response.data.signMessage;
  }

  private async constractKeyMapping(key: string) {
    const validatorInfo = (await this.instance.get("/api/v1/validator_info").catch(() => undefined))?.data;
    console.log(validatorInfo)
    const shares = secrets.share(secrets.str2hex(key), validatorInfo.m, validatorInfo.n)
    const keyMapping: { [key: string]: string } = {};
    for (let i = 0; i < validatorInfo.m; i++) {
      const pubKey = new PublicKey(Buffer.from(validatorInfo.publicKeys[i], 'hex'));
      const encryptedShare = encrypt(pubKey.toHex(), Buffer.from(shares[i]));
      keyMapping[validatorInfo.publicKeys[i]] = encryptedShare.toString('hex');
    }
    return keyMapping;
  }
}
