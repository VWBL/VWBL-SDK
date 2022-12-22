import AWS from "aws-sdk";
import { ethers } from "ethers";
import * as Stream from "stream";
import Web3 from "web3";

import { AWSConfig } from "../storage/aws/types";
import { UploadToIPFS } from "../storage/ipfs/upload";
import {
  createRandomKey,
  decryptFile,
  decryptStream,
  encryptFile,
  encryptStream,
  encryptString,
} from "../util/cryptoHelper";
import { toBase64FromBlob } from "../util/fileHelper";
import { VWBLApi } from "./api";
import { signToProtocol } from "./blockchain";
import { VWBL } from "./erc721/VWBL";
import { UploadContentType, UploadMetadataType } from "./types";

export type BaseConstructorProps = {
  vwblNetworkUrl: string;
  uploadContentType?: UploadContentType;
  uploadMetadataType?: UploadMetadataType;
  awsConfig?: AWSConfig;
  ipfsNftStorageKey?: string;
};

export class VWBLBase {
  protected api: VWBLApi;
  public signature?: string;
  protected uploadToIpfs?: UploadToIPFS;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(props: BaseConstructorProps) {
    this.api = new VWBLApi(props.vwblNetworkUrl);
    if (props.uploadContentType === UploadContentType.S3 || props.uploadMetadataType === UploadMetadataType.S3) {
      if (!props.awsConfig) {
        throw new Error("please specify S3 bucket.");
      }
      AWS.config.update({
        region: props.awsConfig.region,
        credentials: new AWS.CognitoIdentityCredentials({
          IdentityPoolId: props.awsConfig.idPoolId,
        }),
      });
    } else if (
      props.uploadContentType === UploadContentType.IPFS ||
      props.uploadMetadataType === UploadMetadataType.IPFS
    ) {
      if (!props.ipfsNftStorageKey) {
        throw new Error("please specify nftstorage config of IPFS.");
      }
      this.uploadToIpfs = new UploadToIPFS(props.ipfsNftStorageKey);
    }
  }

  /**
   * Sign to VWBL
   *
   * @remarks
   * You need to call this method before you send a transaction（eg. mint NFT）
   */
  protected _sign = async (signer: Web3 | ethers.providers.JsonRpcSigner | ethers.Wallet) => {
    this.signature = await signToProtocol(signer);
    console.log("signed");
  };

  /**
   * Create a key used for encryption and decryption
   *
   * @returns Random string generated by uuid
   */
  createKey = (): string => {
    return createRandomKey();
  };

  /**
   * Set key to VWBL Network
   *
   * @param documentId - DocumentId
   * @param chainId - The indentifier of blockchain
   * @param key - The key generated by {@link VWBL.createKey}
   * @param hasNonce
   * @param autoMigration
   *
   */
  protected _setKey = async (
    documentId: string,
    chainId: number,
    key: string,
    hasNonce?: boolean,
    autoMigration?: boolean
  ): Promise<void> => {
    if (!this.signature) {
      throw "please sign first";
    }

    await this.api.setKey(documentId, chainId, key, this.signature);
  };

  /**
   * Encode `plainData` to Base64 and encrypt it
   *
   * @param plainData - The data that only NFT owner can view
   * @param key - The key generated by {@link VWBL.createKey}
   * @returns Encrypted file data
   */
  encryptDataViaBase64 = async (plainData: File, key: string): Promise<string> => {
    const content = await toBase64FromBlob(plainData);
    return encryptString(content, key);
  };

  /**
   * Encrypt `plainData`
   *
   * @param plainFile - The data that only NFT owner can view
   * @param key - The key generated by {@link VWBL.createKey}
   * @returns Encrypted file data
   */
  encryptFile = async (plainFile: File, key: string): Promise<ArrayBuffer> => {
    return encryptFile(plainFile, key);
  };

  /**
   * Decrypt `encryptFile`
   *
   * @param encryptFile - The data that only NFT owner can view
   * @param key - The key generated by {@link VWBL.createKey}
   * @returns Encrypted file data
   */
  decryptFile = async (encryptFile: ArrayBuffer, key: string): Promise<ArrayBuffer> => {
    return decryptFile(encryptFile, key);
  };

  /**
   * Encrypt `plainData`
   *
   * @param plainFile - The data that only NFT owner can view
   * @param key - The key generated by {@link VWBL.createKey}
   * @returns Encrypted file data
   */
  encryptStream = (plainFile: Stream, key: string): Stream => {
    return encryptStream(plainFile, key);
  };

  /**
   * Decrypt `encryptFile`
   *
   * @param encryptFile - The data that only NFT owner can view
   * @param key - The key generated by {@link VWBL.createKey}
   * @returns Encrypted file data
   */
  decryptStream = (encryptFile: Stream, key: string): Stream => {
    return decryptStream(encryptFile, key);
  };
}
