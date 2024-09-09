import mime from "mime-types";
import path from "path";

import { Base64DataUrl, FileOrPath } from "../vwbl";
import { isRunningOnBrowser } from "./envUtil";

export const toBase64FromFile = async (file: File): Promise<Base64DataUrl> => {
  if (isRunningOnBrowser()) {
    return new Promise((resolve, reject) => {
      const reader = new window.FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result;
        if (!result || typeof result !== "string") {
          reject("cannot convert to base64 string");
        } else {
          resolve(result as Base64DataUrl);
        }
      };
    });
  } else {
    return new Promise<Base64DataUrl>((resolve, reject) => {
      try {
        const arrayBuffer = file.arrayBuffer();
        arrayBuffer
          .then((buffer) => {
            const base64 = Buffer.from(buffer).toString("base64");
            const mimetype = getMimeType(file.name);
            const dataUrl: Base64DataUrl = `data:${mimetype};base64,${base64}`;
            resolve(dataUrl);
          })
          .catch(reject);
      } catch (error) {
        reject(error);
      }
    });
  }
};

export const getMimeType = (file: FileOrPath): string => {
  if (typeof file === "string") {
    const fileExtension = path.extname(file);
    return mime.lookup(fileExtension) || "";
  } else {
    return file.type || "";
  }
};

export const toArrayBuffer = async (blob: Blob): Promise<ArrayBuffer> => {
  if (isRunningOnBrowser()) {
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
      reader.onerror = (error: any) => reject(error); // eslint-disable-line @typescript-eslint/no-explicit-any
    });
  }
  return await blob.arrayBuffer();
};
