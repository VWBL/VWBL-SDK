import axios from "axios";
import FormData, { Readable } from "form-data";
import fs from "fs";
import * as Stream from "stream";

import { IPFSConfig } from "./types";

const pinataEndpoint = "https://api.pinata.cloud/pinning/pinFileToIPFS";

// Pinata Authentication Test Functions
export const testPinataAuthentication = async (ipfsConfig: IPFSConfig): Promise<void> => {
  const headers: Record<string, string | number | boolean> = {
    pinata_api_key: ipfsConfig.apiKey,
  };

  if (ipfsConfig.apiSecret !== undefined) {
    headers.pinata_secret_api_key = ipfsConfig.apiSecret;
  }

  const config = {
    headers: headers,
  };

  try {
    const response = await axios.get(pinataEndpoint, config);
    console.log("Pinata authentication succeeded:", response.data);
  } catch (err: any) {
    console.error("Pinata authentication failed:", config.headers);
    console.error("Pinata authentication failed:", err.message);
    throw new Error(`Pinata authentication failed: ${err.message}`);
  }
};

// Check if the environment in which it is running is Node.js
function isNode() {
  return typeof process !== "undefined" && process.versions != null && process.versions.node != null;
}
// Upload function for encrypted files
export const uploadEncryptedFileToIPFS = async (
  encryptedContent: string | Uint8Array | Readable,
  ipfsConfig?: IPFSConfig
): Promise<string> => {
  if (!ipfsConfig || !ipfsConfig.apiKey || !ipfsConfig.apiSecret) {
    throw new Error("Pinata API key or secret is not specified.");
  }

  let formData: any;

  if (isNode()) {
    formData = new FormData();
  } else {
    formData = new window.FormData();
  }

  if (typeof encryptedContent === "string") {
    const blob = isNode()
      ? Buffer.from(encryptedContent)
      : new Blob([encryptedContent], { type: "application/octet-stream" });
    formData.append("file", blob, "encrypted-file");
  } else if (encryptedContent instanceof Uint8Array) {
    const blob = isNode()
      ? Buffer.from(encryptedContent)
      : new Blob([encryptedContent], { type: "application/octet-stream" });
    formData.append("file", blob, "encrypted-file");
  } else if (encryptedContent instanceof Readable) {
    formData.append("file", encryptedContent, { filename: "encrypted-file" });
  }

  const headers: { [key: string]: any } = {
    pinata_api_key: ipfsConfig.apiKey,
    pinata_secret_api_key: ipfsConfig.apiSecret,
  };

  if (isNode()) {
    headers["Content-Type"] = `multipart/form-data; boundary=${formData.getBoundary()}`;
  }

  const config = {
    headers,
    onUploadProgress: !isNode()
      ? (progressEvent: any) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`uploadEncryptedFileProgress: ${progress}%`);
        }
      : undefined,
  };

  try {
    const response = await axios.post(pinataEndpoint, formData, config);
    return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
  } catch (err: any) {
    console.error("Pinata upload failed:", err.response ? err.response.data : err.message);
    throw new Error(`Pinata upload failed: ${err.message}`);
  }
};

// upload function for thumbnailImage
export const uploadThumbnailToIPFS = async (
  thumbnailImage: string | File | Blob,
  ipfsConfig?: IPFSConfig
): Promise<string> => {
  if (!ipfsConfig || !ipfsConfig.apiKey || !ipfsConfig.apiSecret) {
    throw new Error("Pinata API key or secret is not specified.");
  }

  const formData = new FormData();

  if (isNode()) {
    // Node.js
    if (typeof thumbnailImage === "string") {
      const stream = fs.createReadStream(thumbnailImage);
      formData.append("file", stream);
    } else {
      throw new Error("Invalid type for thumbnailImage in Node.js environment");
    }
  } else {
    // Browser
    if (thumbnailImage instanceof File || thumbnailImage instanceof Blob) {
      formData.append("file", thumbnailImage);
    } else if (typeof thumbnailImage === "string") {
      const response = await fetch(thumbnailImage);
      const blob = await response.blob();
      formData.append("file", new File([blob], "thumbnail", { type: blob.type }));
    } else {
      throw new Error("Invalid type for thumbnailImage in browser environment");
    }
  }

  const headers = {
    pinata_api_key: ipfsConfig.apiKey,
    pinata_secret_api_key: ipfsConfig.apiSecret,
    "Content-Type": "multipart/form-data",
  };

  if (isNode()) {
    Object.assign(headers, formData.getHeaders());
  }

  const config = {
    headers: headers,
    onUploadProgress: isNode()
      ? undefined
      : (progressEvent: any) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`uploadThumbnailProgress: ${progress}%`);
        },
  };

  try {
    const response = await axios.post(pinataEndpoint, formData, config);
    return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
  } catch (err: any) {
    throw new Error(`Pinata upload failed: ${err.message}`);
  }
};

// upload function for metadata
export const uploadMetadataToIPFS = async (
  name: string,
  description: string,
  previewImageUrl: string,
  encryptedDataUrls: string[],
  mimeType: string,
  encryptLogic: string,
  ipfsConfig?: IPFSConfig
): Promise<string> => {
  if (!ipfsConfig || !ipfsConfig.apiKey || !ipfsConfig.apiSecret) {
    throw new Error("Pinata API key or secret is not specified.");
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
  const formData = new FormData();

  if (isNode()) {
    formData.append("file", Buffer.from(metadataJSON), {
      filename: "metadata.json",
      contentType: "application/json",
    });
  } else {
    const blob = new Blob([metadataJSON], { type: "application/json" });
    formData.append("file", blob, "metadata.json");
  }

  const headers: { [key: string]: any } = {
    pinata_api_key: ipfsConfig.apiKey,
    pinata_secret_api_key: ipfsConfig.apiSecret,
  };

  if (isNode()) {
    Object.assign(headers, formData.getHeaders());
  } else {
    headers["Content-Type"] = "multipart/form-data";
  }

  const config = {
    headers: headers,
    onUploadProgress: !isNode()
      ? (progressEvent: any) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`uploadMetadataProgress: ${progress}%`);
        }
      : undefined,
  };

  try {
    const response = await axios.post(pinataEndpoint, formData, config);
    return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
  } catch (err: any) {
    throw new Error(`Pinata upload failed: ${err.message}`);
  }
};
