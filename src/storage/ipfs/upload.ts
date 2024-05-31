import axios from "axios";
import { Buffer } from "buffer";
import FormData from "form-data";
import fs from "fs";
import { Readable } from "stream";

import { IPFSConfig } from "./types";

const pinataEndpoint = "https://api.pinata.cloud/pinning/pinFileToIPFS";

function isNode() {
  return typeof process !== "undefined" && process.versions != null && process.versions.node != null;
}

function createHeaders(ipfsConfig: IPFSConfig, formData?: FormData): { [key: string]: any } {
  const headers: { [key: string]: any } = {
    pinata_api_key: ipfsConfig.apiKey,
    pinata_secret_api_key: ipfsConfig.apiSecret,
  };

  if (isNode() && formData) {
    Object.assign(headers, formData.getHeaders());
  } else {
    headers["Content-Type"] = "multipart/form-data";
  }

  return headers;
}

function createConfig(headers: { [key: string]: any }, progressType: string): any {
  return {
    headers: headers,
    onUploadProgress: !isNode()
      ? (progressEvent: any) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`${progressType} Progress: ${progress}%`);
        }
      : undefined,
  };
}

// Pinata Authentication Test Functions
export const testPinataAuthentication = async (ipfsConfig: IPFSConfig): Promise<void> => {
  const headers = createHeaders(ipfsConfig);

  const config = {
    headers: headers,
  };

  try {
    const response = await axios.get("https://api.pinata.cloud/data/testAuthentication", config);
    console.log("Pinata authentication succeeded:", response.data);
  } catch (err: any) {
    console.error("Pinata authentication failed:", headers);
    throw new Error(`Pinata authentication failed: ${err.message}`);
  }
};

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

  const headers = createHeaders(ipfsConfig, formData);
  const config = createConfig(headers, "uploadMetadataToIPFS");

  try {
    const response = await axios.post(pinataEndpoint, formData, config);
    return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
  } catch (err: any) {
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
    if (typeof thumbnailImage === "string") {
      const stream = fs.createReadStream(thumbnailImage);
      formData.append("file", stream);
    } else if (thumbnailImage instanceof Buffer) {
      formData.append("file", thumbnailImage, "thumbnail");
    } else {
      throw new Error("Invalid type for thumbnailImage in Node.js environment");
    }
  } else {
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

  const headers = createHeaders(ipfsConfig, formData);
  const config = createConfig(headers, "uploadThumbnailToIPFS");

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

  const headers = createHeaders(ipfsConfig, formData);
  const config = createConfig(headers, "uploadMetadataToIPFS");

  try {
    const response = await axios.post(pinataEndpoint, formData, config);
    return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
  } catch (err: any) {
    throw new Error(`Pinata upload failed: ${err.message}`);
  }
};
