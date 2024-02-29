import mime from "mime";

import { FileOrPath } from "../vwbl/types";
const isRunningOnBrowser = typeof window !== "undefined";

export const toBase64FromBlob = async (blob: Blob): Promise<string> => {
  if (isRunningOnBrowser) {
    return new Promise((resolve, reject) => {
      const reader = new window.FileReader();
      reader.readAsDataURL(blob);
      reader.onload = () => {
        const result = reader.result;
        if (!result || typeof result !== "string") {
          reject("cannot convert to base64 string");
        } else {
          resolve(result);
        }
      };
      reader.onerror = (error: any) => reject(error);
    });
  }
  const arrayBuffer = await blob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return buffer.toString("base64");
};

export const getMimeType = (file: FileOrPath): string => {
  return file instanceof File ? file.type : mime.getType(file) || "";
};

export const toArrayBuffer = async (blob: Blob): Promise<ArrayBuffer> => {
  if (isRunningOnBrowser) {
    return new Promise((resolve, reject) => {
      const reader = new window.FileReader();
      reader.readAsArrayBuffer(blob);
      reader.onload = () => {
        const result = reader.result;
        if (!result || !(result instanceof Uint8Array)) {
          reject("cannot convert to ArrayBuffer");
        } else {
          resolve(result);
        }
      };
      reader.onerror = (error: any) => reject(error);
    });
  }
  return await blob.arrayBuffer();
};
