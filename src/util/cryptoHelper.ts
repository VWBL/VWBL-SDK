import nodeCrypto from "crypto";
import crypto from "crypto-js";
import * as Stream from "stream";
import * as uuid from "uuid";
import { toArrayBuffer } from "./fileHelper.js";


export const createRandomKey = uuid.v4;
export const encryptString = (message: string, key: string) => {
  return crypto.AES.encrypt(message, key).toString();
};

export const decryptString = (cipherText: string, key: string) => {
  return crypto.AES.decrypt(cipherText, key).toString(crypto.enc.Utf8);
};

export const encryptFileOnBrowser = async (file: File, key: string): Promise<Uint8Array> => {
  const crypto = window.crypto;
  const subtle = crypto.subtle;
  const aes = {
    name: "AES-CBC",
    iv: new Uint8Array(16),
  };
  const aesAlgorithmKeyGen = {
    name: "AES-CBC",
    length: 256,
  };
  // UUID v4から-をとるとちょうど32文字 = 256bite
  const keyData = new TextEncoder().encode(key.replace(/-/g, ""));
  const aesKey = await subtle.importKey("raw", keyData, aesAlgorithmKeyGen, true, ["encrypt"]);
  return new Uint8Array(await subtle.encrypt(aes, aesKey, await file.arrayBuffer()));
};

export const decryptFileOnBrowser = async (encryptedFile: ArrayBuffer, key: string): Promise<ArrayBuffer> => {
  const crypto = window.crypto;
  const subtle = crypto.subtle;
  const aes = {
    name: "AES-CBC",
    iv: new Uint8Array(16),
  };
  const aesAlgorithmKeyGen = {
    name: "AES-CBC",
    length: 256,
  };
  const keyData = new TextEncoder().encode(key.replace(/-/g, ""));
  const aesKey = await subtle.importKey("raw", keyData, aesAlgorithmKeyGen, true, ["decrypt"]);
  return await subtle.decrypt(aes, aesKey, encryptedFile);
};

export const encryptFileOnNode = async (file: File, key: string): Promise<Uint8Array> => {
  const keyData = new TextEncoder().encode(key.replace(/-/g, ""));
  const cipher = nodeCrypto.createCipheriv("aes-256-cbc", keyData, new Uint8Array(16));
  const start = cipher.update(Buffer.from(await toArrayBuffer(file)));
  const final = cipher.final();
  return new Uint8Array(Buffer.concat([start, final]).buffer);
};

export const decryptFileOnNode = (encryptedFile: ArrayBuffer, key: string): ArrayBuffer => {
  const keyData = new TextEncoder().encode(key.replace(/-/g, ""));
  const decipher = nodeCrypto.createDecipheriv("aes-256-cbc", keyData, new Uint8Array(16));
  const start = decipher.update(Buffer.from(encryptedFile));
  const final = decipher.final();
  return Buffer.concat([start, final]).buffer;
};

export const encryptStream = (stream: Stream, key: string): Stream.Readable => {
  const keyData = new TextEncoder().encode(key.replace(/-/g, ""));
  const cipher = nodeCrypto.createCipheriv("aes-256-cbc", keyData, new Uint8Array(16));
  return stream.pipe(cipher);
};

export const decryptStream = (stream: Stream, key: string): Stream => {
  const keyData = new TextEncoder().encode(key.replace(/-/g, ""));
  const decipher = nodeCrypto.createDecipheriv("aes-256-cbc", keyData, new Uint8Array(16));
  return stream.pipe(decipher);
};

export const encryptFile = typeof window === "undefined" ? encryptFileOnNode : encryptFileOnBrowser;
export const decryptFile = typeof window === "undefined" ? decryptFileOnNode : decryptFileOnBrowser;
