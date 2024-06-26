import axios from "axios";
import { Buffer } from "buffer";
import FormData from "form-data";
import fs from "fs";
import { Readable } from "stream";

<<<<<<< HEAD
import { isRunningOnBrowser, isRunningOnNode } from "../../util";
=======
import { isRunningOnNode } from "../../util/envUtil";
>>>>>>> cf8303f71eb8fbf3a2e16d6fe1f6cbf2834de59c
import { IPFSConfig } from "./types";

const pinataEndpoint = "https://api.pinata.cloud/pinning/pinFileToIPFS";

<<<<<<< HEAD
const createHeaders = (ipfsConfig: IPFSConfig): { [key: string]: string } => {
  const headers: { [key: string]: string } = {
    pinata_api_key: ipfsConfig.apiKey,
    pinata_secret_api_key: ipfsConfig.apiSecret as string,
  };
  headers["Content-Type"] = "multipart/form-data";
  return headers;
};

const createHeadersOnNode = (ipfsConfig: IPFSConfig, formData: FormData): { [key: string]: any } => {
  // eslint-disable-line
  const headers: { [key: string]: any } = {
    // eslint-disable-line
    pinata_api_key: ipfsConfig.apiKey,
    pinata_secret_api_key: ipfsConfig.apiSecret as string,
  };
  Object.assign(headers, formData.getHeaders());
  return headers;
};

type ConfigType = {
  headers: {
    [key: string]: any; // eslint-disable-line
  };
  onUploadProgress: ((progressEvent: any) => void) | undefined; // eslint-disable-line
};

const createConfig = (
  headers: { [key: string]: any }, // eslint-disable-line
  progressType: string
): ConfigType => {
  return {
    headers: headers,
    onUploadProgress: isRunningOnBrowser()
      ? (progressEvent: any) => {
          // eslint-disable-line
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
  } catch (err: any) {
    // eslint-disable-line
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
  } catch (err: any) {
    // eslint-disable-line
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
  let headers: { [key: string]: any }; // eslint-disable-line
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
=======
function createHeaders(ipfsConfig: IPFSConfig, formData?: FormData): { [key: string]: any } {
  const headers: { [key: string]: any } = {
    pinata_api_key: ipfsConfig.apiKey,
    pinata_secret_api_key: ipfsConfig.apiSecret,
  };

  if (isRunningOnNode() && formData) {
    Object.assign(headers, formData.getHeaders());
  } else {
    headers["Content-Type"] = "multipart/form-data";
  }

  return headers;
}

function createConfig(headers: { [key: string]: any }, progressType: string): any {
  return {
    headers: headers,
    onUploadProgress: !isRunningOnNode()
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

  if (isRunningOnNode()) {
    formData = new FormData();
  } else {
    formData = new window.FormData();
  }

  if (typeof encryptedContent === "string") {
    const blob = isRunningOnNode()
      ? Buffer.from(encryptedContent)
      : new Blob([encryptedContent], { type: "application/octet-stream" });
    formData.append("file", blob, "encrypted-file");
  } else if (encryptedContent instanceof Uint8Array) {
    const blob = isRunningOnNode()
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
>>>>>>> cf8303f71eb8fbf3a2e16d6fe1f6cbf2834de59c
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
<<<<<<< HEAD
  let headers: { [key: string]: any }; // eslint-disable-line
=======

>>>>>>> cf8303f71eb8fbf3a2e16d6fe1f6cbf2834de59c
  if (isRunningOnNode()) {
    if (typeof thumbnailImage === "string") {
      const stream = fs.createReadStream(thumbnailImage);
      formData.append("file", stream);
    } else if (thumbnailImage instanceof Buffer) {
      formData.append("file", thumbnailImage, "thumbnail");
    } else {
      throw new Error("Invalid type for thumbnailImage in Node.js environment");
    }
<<<<<<< HEAD
    headers = createHeadersOnNode(ipfsConfig, formData);
=======
>>>>>>> cf8303f71eb8fbf3a2e16d6fe1f6cbf2834de59c
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
<<<<<<< HEAD
    headers = createHeaders(ipfsConfig);
  }
  const config = createConfig(headers, "uploadThumbnailToIPFS");
  const thumbnailImageUrl = await uploadFile(formData, config);
  return thumbnailImageUrl;
=======
  }

  const headers = createHeaders(ipfsConfig, formData);
  const config = createConfig(headers, "uploadThumbnailToIPFS");

  try {
    const response = await axios.post(pinataEndpoint, formData, config);
    return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
  } catch (err: any) {
    throw new Error(`Pinata upload failed: ${err.message}`);
  }
>>>>>>> cf8303f71eb8fbf3a2e16d6fe1f6cbf2834de59c
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
<<<<<<< HEAD
  let headers: { [key: string]: any }; // eslint-disable-line
=======

>>>>>>> cf8303f71eb8fbf3a2e16d6fe1f6cbf2834de59c
  if (isRunningOnNode()) {
    formData.append("file", Buffer.from(metadataJSON), {
      filename: "metadata.json",
      contentType: "application/json",
    });
<<<<<<< HEAD
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
=======
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
>>>>>>> cf8303f71eb8fbf3a2e16d6fe1f6cbf2834de59c
