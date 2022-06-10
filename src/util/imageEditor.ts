import {fileTypeFromBuffer} from 'file-type';

export const toBase64FromBlob = async (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => {
      const result = reader.result;

      if (!result || typeof result !== "string") {
        reject("cannot convert to base64 string");
      } else {
        resolve(result);
      }
    };
    reader.onerror = (error: Error) => reject(error);
  })
};

export const getMimeType = async (data: File | Buffer): Promise<string | undefined> => {
  return data instanceof File ? data.type : (await fileTypeFromBuffer(data))?.mime;
};

export const toArrayBuffer = async (blob: Blob): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(blob);
    reader.onload = () => {
      const result = reader.result;
      if (!result || !(result instanceof Uint8Array)) {
        reject("cannot convert to ArrayBuffer");
      } else {
        resolve(result);
      }
    };
    reader.onerror = (error: Error) => reject(error);
  })
};
