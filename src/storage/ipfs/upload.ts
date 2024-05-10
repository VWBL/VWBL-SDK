import { Blob, NFTStorage } from "nft.storage";

import { getMimeType } from "../../util";
import { PlainMetadata } from "../../vwbl/metadata";
import { EncryptLogic, FileOrPath } from "../../vwbl/types";
import { IPFSConfig } from "./types";

export const uploadEncryptedFileToIPFS = async (
  encryptedContent: string | ArrayBuffer | Uint8Array,
  ipfsConfig?: IPFSConfig
): Promise<string> => {
  if (!ipfsConfig || !ipfsConfig.nftStorageKey) {
    throw new Error("NFT storage key is not specified.");
  }
  const client = new NFTStorage({ token: ipfsConfig.nftStorageKey });

  const encryptedContentData = new Blob([encryptedContent]);

  let cid;
  try {
    cid = await client.storeBlob(encryptedContentData);
  } catch (err: any) {
    throw new Error(err);
  }

  return `https://nftstorage.link/ipfs/${cid}`;
};

export const uploadThumbnailToIPFS = async (
  thumbnailImage: FileOrPath,
  ipfsConfig?: IPFSConfig
): Promise<string> => {
  if (!ipfsConfig || !ipfsConfig.nftStorageKey) {
    throw new Error("NFT storage key is not specified.");
  }
  const client = new NFTStorage({ token: ipfsConfig.nftStorageKey });

  const thumbnailFileType = getMimeType(thumbnailImage);
  const thumbnailBlob = new Blob([thumbnailImage], { type: thumbnailFileType });

  let cid;
  try {
    cid = await client.storeBlob(thumbnailBlob);
  } catch (err: any) {
    throw new Error(err);
  }

  return `https://nftstorage.link/ipfs/${cid}`;
};

export const uploadMetadataToIPFS = async (
  name: string,
  description: string,
  previewImageUrl: string,
  encryptedDataUrls: string[],
  mimeType: string,
  encryptLogic: EncryptLogic,
  ipfsConfig?: IPFSConfig
): Promise<string> => {
  if (!ipfsConfig || !ipfsConfig.nftStorageKey) {
    throw new Error("NFT storage key is not specified.");
  }
  const client = new NFTStorage({ token: ipfsConfig.nftStorageKey });
  const metadata: PlainMetadata = {
    name,
    description,
    image: previewImageUrl,
    encrypted_data: encryptedDataUrls,
    mime_type: mimeType,
    encrypt_logic: encryptLogic,
  };

  const metadataJSON = JSON.stringify(metadata);
  const metaDataBlob = new Blob([metadataJSON]);

  let cid;
  try {
    cid = await client.storeBlob(metaDataBlob);
  } catch (err: any) {
    throw new Error(err);
  }

  return `https://nftstorage.link/ipfs/${cid}`;
};
