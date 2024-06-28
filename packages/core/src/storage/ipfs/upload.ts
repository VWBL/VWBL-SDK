import axios from "axios";
import { Buffer } from "buffer";
import FormData from "form-data";
import fs from "fs";
import { Readable } from "stream";

import { isRunningOnBrowser, isRunningOnNode } from "../../util";
import { IPFSConfig } from "./types";

const pinataEndpoint = "https://api.pinata.cloud/pinning/pinFileToIPFS";

const createHeaders = (ipfsConfig: IPFSConfig): { [key: string]: string } => {
  const headers: { [key: string]: string } = {
    pinata_api_key: ipfsConfig.apiKey,
    pinata_secret_api_key: ipfsConfig.apiSecret as string,
  };
  headers["Content-Type"] = "multipart/form-data";
  return headers;
};

const createHeadersOnNode = (ipfsConfig: IPFSConfig, formData: FormData): { [key: string]: any } => { // eslint-disable-line @typescript-eslint/no-explicit-any
  const headers: { [key: string]: any } = { // eslint-disable-line @typescript-eslint/no-explicit-any
    pinata_api_key: ipfsConfig.apiKey,
    pinata_secret_api_key: ipfsConfig.apiSecret as string,
  };
  Object.assign(headers, formData.getHeaders());
  return headers;
};

type ConfigType = {
  headers: {
    [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  };
  onUploadProgress: ((progressEvent: any) => void) | undefined; // eslint-disable-line @typescript-eslint/no-explicit-any
};

const createConfig = (
  headers: { [key: string]: any }, // eslint-disable-line @typescript-eslint/no-explicit-any
  progressType: string
): ConfigType => {
  return {
    headers: headers,
    onUploadProgress: isRunningOnBrowser()
      ? (progressEvent: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`${progressType} Progress: ${progress}%`);
        }
      : undefined,
  };
};

const uploadFile = async (formData: FormData | globalThis.FormData, config: ConfigType): Promise<string> => {
  try {
    const response = await axios.post(pinataEndpoint, formData, config);
    return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
  } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    throw new Error(`Pinata upload failed: ${err.message}`);
  }
};

// Pinata Authentication Test Functions
export const testPinataAuthentication = async (ipfsConfig: IPFSConfig): Promise<void> => {
  const headers = createHeaders(ipfsConfig);
  const config = {
    headers: headers,
  };

  try {
    const response = await axios.get("https://api.pinata.cloud/data/testAuthentication", config);
    console.log("Pinata authentication succeeded:", response.data);
  } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
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

  let formData: FormData | globalThis.FormData;
  let headers: { [key: string]: any }; // eslint-disable-line @typescript-eslint/no-explicit-any
  if (typeof encryptedContent === "string" || encryptedContent instanceof Uint8Array) {
    if (isRunningOnNode()) {
      formData = new FormData();
      const blob = Buffer.from(encryptedContent);
      formData.append("file", blob, "encrypted-file");
      headers = createHeadersOnNode(ipfsConfig, formData);
    } else {
      formData = new window.FormData();
      const blob = new Blob([encryptedContent], {
        type: "application/octet-stream",
      });
      formData.append("file", blob, "encrypted-file");
      headers = createHeaders(ipfsConfig);
    }
  } else {
    formData = new FormData();
    formData.append("file", encryptedContent, { filename: "encrypted-file" });
    headers = createHeadersOnNode(ipfsConfig, formData);
  }
  const config = createConfig(headers, "uploadMetadataToIPFS");
  const encryptedDataUrl = await uploadFile(formData, config);
  return encryptedDataUrl;
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
  let headers: { [key: string]: any }; // eslint-disable-line @typescript-eslint/no-explicit-any
  if (isRunningOnNode()) {
    if (typeof thumbnailImage === "string") {
      const stream = fs.createReadStream(thumbnailImage);
      formData.append("file", stream);
    } else if (thumbnailImage instanceof Buffer) {
      formData.append("file", thumbnailImage, "thumbnail");
    } else {
      throw new Error("Invalid type for thumbnailImage in Node.js environment");
    }
    headers = createHeadersOnNode(ipfsConfig, formData);
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
    headers = createHeaders(ipfsConfig);
  }
  const config = createConfig(headers, "uploadThumbnailToIPFS");
  const thumbnailImageUrl = await uploadFile(formData, config);
  return thumbnailImageUrl;
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
  let headers: { [key: string]: any }; // eslint-disable-line @typescript-eslint/no-explicit-any
  if (isRunningOnNode()) {
    formData.append("file", Buffer.from(metadataJSON), {
      filename: "metadata.json",
      contentType: "application/json",
    });
    headers = createHeadersOnNode(ipfsConfig, formData);
  } else {
    const blob = new Blob([metadataJSON], { type: "application/json" });
    formData.append("file", blob, "metadata.json");
    headers = createHeaders(ipfsConfig);
  }
  const config = createConfig(headers, "uploadMetadataToIPFS");
  const metadataUrl = await uploadFile(formData, config);
  return metadataUrl;
};
