import * as Stream from "stream";

import {
  createRandomKey,
  decryptFile,
  decryptStream,
  encryptFile,
  encryptStream,
  encryptString,
  toBase64FromBlob,
} from "../util";

export class VWBLCrypto {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  /**
   * Create a key used for encryption and decryption
   *
   * @returns Random string generated by uuid
   */
  createKey = (): string => {
    return createRandomKey();
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
  decryptFile = async (encryptFile: Uint8Array, key: string): Promise<ArrayBuffer> => {
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
