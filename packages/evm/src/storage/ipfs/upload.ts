import axios from "axios";

import { IPFSConfig } from "./types";
const pinataEndpoint = "https://api.pinata.cloud/pinning/pinFileToIPFS";
import { EncryptLogic, FileOrPath } from "../../vwbl/types";
// Pinataの認証テスト関数
export const testPinataAuthentication = async (ipfsConfig: IPFSConfig): Promise<void> => {
  // ヘッダーを動的に構築
  const headers: Record<string, string | number | boolean> = {
    pinata_api_key: ipfsConfig.apiKey,
  };

  // pinata_secret_api_key が undefined でない場合のみヘッダーに追加
  if (ipfsConfig.apiSecret !== undefined) {
    headers.pinata_secret_api_key = ipfsConfig.apiSecret;
  }

  // axios の config オブジェクトを設定
  const config = {
    headers: headers,
  };

  try {
    const response = await axios.get("https://api.pinata.cloud/data/testAuthentication", config);
    console.log("Pinata認証成功:", response.data);
  } catch (err: any) {
    console.error("Pinata認証失敗:", config.headers);
    console.error("Pinata認証失敗:", err.message);
    throw new Error(`Pinata authentication failed: ${err.message}`);
  }
};

// 暗号化ファイルのアップロード関数
export const uploadEncryptedFileToIPFS = async (
  encryptedContent: string | ArrayBuffer,
  ipfsConfig?: IPFSConfig
): Promise<string> => {
  if (!ipfsConfig || !ipfsConfig.apiKey || !ipfsConfig.apiSecret) {
    throw new Error("Pinata API key or secret is not specified.");
  }
  console.error("uploadEncryptedFileToIPFS:", ipfsConfig);
  await testPinataAuthentication(ipfsConfig); // 認証テスト

  const formData = new FormData();
  formData.append("file", new Blob([encryptedContent], { type: "application/octet-stream" }));

  const config = {
    headers: {
      pinata_api_key: ipfsConfig.apiKey,
      pinata_secret_api_key: ipfsConfig.apiSecret,
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (progressEvent: any) => {
      const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      console.log(`uploadEncryptedFileToPinataアップロード進行中: ${progress}%`);
    },
  };

  try {
    const response = await axios.post(pinataEndpoint, formData, config);
    return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
  } catch (err: any) {
    throw new Error(`Pinata upload failed: ${err.message}`);
  }
};

export const uploadThumbnailToIPFS = async (thumbnailImage: FileOrPath, ipfsConfig?: IPFSConfig): Promise<string> => {
  if (!ipfsConfig || !ipfsConfig.apiKey || !ipfsConfig.apiSecret) {
    throw new Error("Pinata API key or secret is not specified.");
  }
  console.error("uploadThumbnailToIPFS:", ipfsConfig);
  await testPinataAuthentication(ipfsConfig); // 認証テスト

  const formData = new FormData();

  if (thumbnailImage instanceof File) {
    formData.append("file", thumbnailImage);
  } else {
    const response = await fetch(thumbnailImage);
    const blob = await response.blob();
    formData.append("file", new File([blob], "thumbnail", { type: blob.type }));
  }

  const config = {
    headers: {
      pinata_api_key: ipfsConfig.apiKey,
      pinata_secret_api_key: ipfsConfig.apiSecret,
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (progressEvent: any) => {
      const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      console.log(`uploadThumbnailToPinataアップロード進行中: ${progress}%`);
    },
  };

  try {
    const response = await axios.post(pinataEndpoint, formData, config);
    return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
  } catch (err: any) {
    throw new Error(`Pinata upload failed: ${err.message}`);
  }
};

// メタデータのアップロード関数
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
  console.error("uploadMetadataToIPFS:", ipfsConfig);

  await testPinataAuthentication(ipfsConfig); // 認証テスト

  const metadata = {
    name,
    description,
    image: previewImageUrl,
    encrypted_data: encryptedDataUrls,
    mime_type: mimeType,
    encrypt_logic: encryptLogic,
  };

  const metadataJSON = JSON.stringify(metadata);
  const metadataBlob = new Blob([metadataJSON], { type: "application/json" });

  const formData = new FormData();
  formData.append("file", metadataBlob);

  const config = {
    headers: {
      pinata_api_key: ipfsConfig.apiKey,
      pinata_secret_api_key: ipfsConfig.apiSecret,
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (progressEvent: any) => {
      const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      console.log(`uploadMetadataToPinataアップロード進行中: ${progress}%`);
    },
  };

  try {
    const response = await axios.post(pinataEndpoint, formData, config);
    return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
  } catch (err: any) {
    throw new Error(`Pinata upload failed: ${err.message}`);
  }
};