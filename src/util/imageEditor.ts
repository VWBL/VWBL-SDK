import Jimp from "jimp";
const { FileReader } = require('file-api');

export const resizeFromBase64 = async (base64: string, width: number, height: number): Promise<string> => {
  const image = await Jimp.read(base64);
  image.resize(width, height);
  return await image.getBase64Async(Jimp.MIME_PNG);
};

export const waterMarkFromBase64 = async (base64: string): Promise<string> => {
  const image = await Jimp.read(base64);
  const watermark = await Jimp.read("/assets/watermark/vwbl-watermark.png");
  image.blit(
    watermark.resize(image.getWidth() / 2, Jimp.AUTO),
    image.getWidth() - watermark.getWidth(),
    image.getHeight() - watermark.getHeight()
  );
  return await image.getBase64Async(Jimp.MIME_PNG);
};

export const toBafferFromBase64 = async (base64: string): Promise<Buffer> => {
  return (await Jimp.read(base64)).getBufferAsync(Jimp.MIME_PNG);
};

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

export const getMimeType = (file: File): string => {
  return file.type;
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
