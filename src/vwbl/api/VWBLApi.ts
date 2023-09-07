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
    autoMigration: boolean = true
  ) {
    const keyAndSigMapping = await this.constructKeyAndSigMapping(key, signature);
    await this.instance.post("/api/v1/keys", {
      userAddress: address,
      documentId,
      chainId,
      autoMigration,
      keyAndSigMapping
    })
  }

  async migrateKey(
    documentId: string,
    chainId: number,
    key: string,
    signature: string,
    address?: string,
    autoMigration: boolean = true 
  ) {
    const keyAndSigMapping = await this.constructKeyAndSigMapping(key, signature);
    await this.instance.post("api/v1/migrate", {
      userAddress: address,
      documentId,
      chainId,
      autoMigration,
      keyAndSigMapping
    })
  }

  async getKey(documentId: string, chainId: number, signature: string, address?: string): Promise<string> {
    const privKey = new PrivateKey();
    const userPubKey = "0x" + privKey.publicKey.toHex();
    const sigMapping = await this.contructSigMapping(signature);
    const encryptedKeys = (await this.instance.get(
        `/api/v1/keys/${documentId}/${chainId}?userPubkey=${userPubKey}&userAddress=${address}&userSig=${sigMapping}`
    )).data.encryptedKeys;
    const keys = encryptedKeys.map((k: string) => decrypt(privKey.toHex(), Buffer.from(k, 'hex')).toString());
    return secrets.hex2str(secrets.combine(keys))
  }

  async getSignMessage(contractAddress: string, chainId: number, address?: string): Promise<string> {
    const response = await this.instance.get(`/sign_message/${contractAddress}/${chainId}?address=${address}`);
    return response.data.signMessage;
  }

  private async constructKeyAndSigMapping(key: string, signature: string) {
    const validatorInfo = (await this.instance.get("/api/v1/validator_info").catch(() => undefined))?.data;
    const shares = secrets.share(secrets.str2hex(key), validatorInfo.m, validatorInfo.n)
    const keyAndSigMapping: { [key: string]: string } = {};
    for (let i = 0; i < validatorInfo.m; i++) {
      const shareAndSig = shares[i] + " " + signature
      const pubKey = new PublicKey(Buffer.from(validatorInfo.publicKeys[i], 'hex'));
      const encryptedShareAndSig = encrypt(pubKey.toHex(), Buffer.from(shareAndSig)).toString('hex');
      keyAndSigMapping[validatorInfo.publicKeys[i]] = encryptedShareAndSig;
    }
    return keyAndSigMapping;
  }

  private async contructSigMapping(signature: string) {
    const validatorInfo = (await this.instance.get("/api/v1/validator_info").catch(() => undefined))?.data;
    const sigMapping: { [key: string]: string } = {};
    for (let i = 0; i < validatorInfo.m; i++) {
      const pubKey = new PublicKey(Buffer.from(validatorInfo.publicKeys[i], 'hex'));
      const encryptedSig = encrypt(pubKey.toHex(), Buffer.from(signature));
      sigMapping[validatorInfo.publicKeys[i]] = encryptedSig.toString('hex');
    }
    return JSON.stringify(sigMapping);
  }
}