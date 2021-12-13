import crypto from "crypto-js";
import * as uuid from "uuid";

export const createRandomKey = uuid.v4;

export const encrypt = (message: string, key: string) => {
  return crypto.AES.encrypt(message, key).toString();
};

export const decrypt = (cipherText: string, key: string) => {
  return crypto.AES.decrypt(cipherText, key).toString(crypto.enc.Utf8);
};
