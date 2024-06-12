import fs from "fs";
import axios from "axios";
import { Buffer } from "buffer";
import FormData from "form-data";
import { Readable } from "stream";
import { isRunningOnNode } from "./src/index"; // envUtilからisRunningOnNodeをインポート
import { IPFSConfig } from "./src/index";

const lighthouseEndpoint: string = "https://node.lighthouse.storage/api/v0/add";

const createLighthouseConfig = (ipfsConfig?: IPFSConfig) => {
  if (!ipfsConfig || !ipfsConfig.apiKey) {
    throw new Error("Lighthouse API key is not specified.");
  }

  const headers = {
    Authorization: `Bearer ${ipfsConfig.apiKey}`,
    "Content-Type": "multipart/form-data",
  };

  return {
    headers: headers,
    onUploadProgress: isRunningOnNode()
      ? undefined
      : (progressEvent: any) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`Upload Progress: ${progress}%`);
        },
  };
};

export const uploadEncryptedFileToLighthouse = async (
  encryptedContent: string | Uint8Array | Readable,
  ipfsConfig?: IPFSConfig
): Promise<string> => {
  if (!ipfsConfig || !ipfsConfig.apiKey) {
    throw new Error("Lighthouse API key is not specified.");
  }

  let formData: any = isRunningOnNode()
    ? new FormData()
    : new window.FormData();

  if (
    typeof encryptedContent === "string" ||
    encryptedContent instanceof Uint8Array
  ) {
    const blob = isRunningOnNode()
      ? Buffer.from(encryptedContent)
      : new Blob([encryptedContent], { type: "application/octet-stream" });
    formData.append("file", blob, { filename: "encrypted-file" });
  } else if (encryptedContent instanceof Readable) {
    formData.append("file", encryptedContent, { filename: "encrypted-file" });
  }

  const config = createLighthouseConfig(ipfsConfig);

  try {
    const response = await axios.post(lighthouseEndpoint, formData, config);
    return `https://gateway.lighthouse.storage/ipfs/${response.data.Hash}`;
  } catch (err: any) {
    throw new Error(`Lighthouse upload failed: ${err.message}`);
  }
};

// Thumbnail upload function
type FileOrPath = string | Blob | File;

export const uploadThumbnailToLighthouse = async (
  thumbnailImage: FileOrPath,
  ipfsConfig?: IPFSConfig
): Promise<string> => {
  if (!ipfsConfig || !ipfsConfig.apiKey) {
    throw new Error("Lighthouse API key is not specified.");
  }

  let formData: any = isRunningOnNode()
    ? new FormData()
    : new window.FormData();

  if (isRunningOnNode()) {
    if (typeof thumbnailImage === "string") {
      // Node.js環境でのファイルパスからの読み込み
      formData.append("file", fs.createReadStream(thumbnailImage));
    } else if (thumbnailImage instanceof Buffer) {
      // Node.js環境でのBufferをファイルとして扱う
      formData.append("file", thumbnailImage, { filename: "thumbnail" });
    }
  } else {
    if (thumbnailImage instanceof File || thumbnailImage instanceof Blob) {
      // ブラウザ環境でのファイルまたはBlobの扱い
      formData.append("file", thumbnailImage);
    } else if (typeof thumbnailImage === "string") {
      // ブラウザ環境でのURLからBlobを取得
      const response = await fetch(thumbnailImage);
      const blob = await response.blob();
      formData.append("file", blob, { filename: "thumbnail" });
    }
  }

  const lighthouseEndpoint: string =
    "https://node.lighthouse.storage/api/v0/add";
  const config = {
    headers: formData.getHeaders
      ? {
          ...formData.getHeaders(),
          Authorization: `Bearer ${ipfsConfig.apiKey}`,
        }
      : { Authorization: `Bearer ${ipfsConfig.apiKey}` },
  };

  try {
    const response = await axios.post(lighthouseEndpoint, formData, config);
    return `https://gateway.lighthouse.storage/ipfs/${response.data.Hash}`;
  } catch (err: any) {
    throw new Error(`Lighthouse upload failed: ${err.message}`);
  }
};
export const uploadMetadataToLighthouse = async (
  name: string,
  description: string,
  previewImageUrl: string,
  encryptedDataUrls: string[],
  mimeType: string,
  encryptLogic: string,
  ipfsConfig?: IPFSConfig
): Promise<string> => {
  if (!ipfsConfig || !ipfsConfig.apiKey) {
    throw new Error("Lighthouse API key is not specified.");
  }

  const metadata = {
    name,
    description,
    image: previewImageUrl,
    encrypted_data: encryptedDataUrls,
    mime_type: mimeType,
    encrypt_logic: encryptLogic,
  };

  const metadataJSON = JSON.stringify(metadata);
  let formData: any = isRunningOnNode()
    ? new FormData()
    : new window.FormData();
  if (isRunningOnNode()) {
    formData.append("file", Buffer.from(metadataJSON), {
      filename: "metadata.json",
      contentType: "application/json",
    });
  } else {
    const metadataBlob = new Blob([metadataJSON], { type: "application/json" });
    formData.append("file", metadataBlob, { filename: "metadata.json" });
  }

  const lighthouseEndpoint: string =
    "https://node.lighthouse.storage/api/v0/add";
  const config = {
    headers: formData.getHeaders
      ? {
          ...formData.getHeaders(),
          Authorization: `Bearer ${ipfsConfig.apiKey}`,
        }
      : { Authorization: `Bearer ${ipfsConfig.apiKey}` },
  };

  try {
    const response = await axios.post(lighthouseEndpoint, formData, config);
    return `https://gateway.lighthouse.storage/ipfs/${response.data.Hash}`;
  } catch (err: any) {
    throw new Error(`Lighthouse upload failed: ${err.message}`);
  }
};
