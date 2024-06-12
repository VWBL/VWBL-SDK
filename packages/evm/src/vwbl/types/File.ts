import * as Stream from "stream";

import { IPFSConfig } from "../../storage";
import { EncryptLogic } from "./EncryptLogic";

type UploadEncryptedFile = (
  fileName: string,
  encryptedContent: string | Uint8Array | Stream.Readable,
  uuid: string
) => Promise<string>;

type UploadThumbnail = (thumbnailImage: FileOrPath, uuid: string) => Promise<string>;

type UploadMetadata = (
  tokenId: number,
  name: string,
  description: string,
  previewImageUrl: string,
  encryptedDataUrl: string[],
  mimeType: string,
  encryptLogic: EncryptLogic
) => Promise<void>;

type UploadEncryptedFileToIPFS = (
  encryptedContent: string | Uint8Array | Stream.Readable,
  ipfsConfig?: IPFSConfig
) => Promise<string>;

type UploadThumbnailToIPFS = (thumbnailImage: FileOrPath, ipfsConfig?: IPFSConfig) => Promise<string>;

type UploadMetadataToIPFS = (
  name: string,
  description: string,
  previewImageUrl: string,
  encryptedDataUrls: string[],
  mimeType: string,
  encryptLogic: EncryptLogic,
  ipfsConfig?: IPFSConfig
) => Promise<string>;

type FileOrPath = File | string;

export {
  UploadMetadata,
  UploadEncryptedFile,
  UploadThumbnail,
  FileOrPath,
  UploadMetadataToIPFS,
  UploadEncryptedFileToIPFS,
  UploadThumbnailToIPFS,
};
