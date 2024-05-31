import mime from "mime-types";

import { FileOrPath } from "../vwbl";
const isRunningOnBrowser = typeof window !== "undefined";

export const toBase64FromFile = async (file: File): Promise<string> => {
  if (isRunningOnBrowser) {
    return new Promise((resolve, reject) => {
      const reader = new window.FileReader();
      reader.readAsDataURL(file);
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
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64 = buffer.toString("base64");
  const mimetype = getMimeType(file);
  return `data:${mimetype};base64,${base64}`;
};

export const getMimeType = (file: FileOrPath): string => {
  return file instanceof File ? file.type : mime.lookup(file) || "";
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
