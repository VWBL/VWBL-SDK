// import { Blob, NFTStorage } from "nft.storage";

// import { getMimeType } from "../../util";
// import { PlainMetadata } from "../../vwbl/metadata";
// import { EncryptLogic, FileOrPath } from "../../vwbl/types";

// export class UploadToIPFS {
//   private client: NFTStorage;
//   constructor(ipfsNftStorageKey: string) {
//     this.client = new NFTStorage({ token: ipfsNftStorageKey });
//   }

//   async uploadEncryptedFile(encryptedContent: string | ArrayBuffer): Promise<string> {
//     const encryptedContentData = new Blob([encryptedContent]);

//     let cid;
//     try {
//       cid = await this.client.storeBlob(encryptedContentData);
//     } catch (err: any) {
//       throw new Error(err);
//     }

//     return `https://nftstorage.link/ipfs/${cid}`;
//   }

//   async uploadThumbnail(thumbnailImage: FileOrPath): Promise<string> {
//     const thumbnailFileType = getMimeType(thumbnailImage);
//     const thumbnailblob = new Blob([thumbnailImage], { type: thumbnailFileType });

//     let cid;
//     try {
//       cid = await this.client.storeBlob(thumbnailblob);
//     } catch (err: any) {
//       throw new Error(err);
//     }

//     return `https://nftstorage.link/ipfs/${cid}`;
//   }

//   async uploadMetadata(
//     name: string,
//     description: string,
//     previewImageUrl: string,
//     encryptedDataUrls: string[],
//     mimeType: string,
//     encryptLogic: EncryptLogic
//   ): Promise<string> {
//     const metadata: PlainMetadata = {
//       name,
//       description,
//       image: previewImageUrl,
//       encrypted_data: encryptedDataUrls,
//       mime_type: mimeType,
//       encrypt_logic: encryptLogic,
//     };

//     const metadataJSON = JSON.stringify(metadata);
//     const metaDataBlob = new Blob([metadataJSON]);

//     let cid;
//     try {
//       cid = await this.client.storeBlob(metaDataBlob);
//     } catch (err: any) {
//       throw new Error(err);
//     }

//     return `https://nftstorage.link/ipfs/${cid}`;
//   }
// }


import { Blob, NFTStorage } from "nft.storage";

import { getMimeType } from "../../util";
import { PlainMetadata } from "../../vwbl/metadata";
import { EncryptLogic, FileOrPath } from "../../vwbl/types";

const nftStorageKey = "YOUR_NFT_STORAGE_API_KEY";
const client = new NFTStorage({ token: nftStorageKey });

export const uploadEncryptedFile = async (
  encryptedContent: string | ArrayBuffer
): Promise<string> => {
  const encryptedContentData = new Blob([encryptedContent]);

  let cid;
  try {
    cid = await client.storeBlob(encryptedContentData);
  } catch (err: any) {
    throw new Error(err);
  }

  return `https://nftstorage.link/ipfs/${cid}`;
};

export const uploadThumbnail = async (
  thumbnailImage: FileOrPath
): Promise<string> => {
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

export const uploadMetadata = async (
  name: string,
  description: string,
  previewImageUrl: string,
  encryptedDataUrls: string[],
  mimeType: string,
  encryptLogic: EncryptLogic
): Promise<string> => {
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
