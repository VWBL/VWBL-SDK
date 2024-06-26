import { AWSConfig } from "@evm/storage";
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
  tokenId: number | string,
  name: string,
  description: string,
  previewImageUrl: string,
  encryptedDataUrl: string[],
  mimeType: string,
  encryptLogic: EncryptLogic,
  awsConfig?: AWSConfig
) => Promise<void>;

<<<<<<< HEAD
// type UploadEncryptedFileToIPFS = (encryptedContent: string | ArrayBuffer, ipfsConfig?: IPFSConfig) => Promise<string>;
type UploadEncryptedFileToIPFS = (
  // encryptedContent: string | Uint8Array | Buffer,
=======
type UploadEncryptedFileToIPFS = (
>>>>>>> cf8303f71eb8fbf3a2e16d6fe1f6cbf2834de59c
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

<<<<<<< HEAD
type Base64DataUrl = `data:${string};base64,${string}`;

=======
>>>>>>> cf8303f71eb8fbf3a2e16d6fe1f6cbf2834de59c
export {
  UploadMetadata,
  UploadEncryptedFile,
  UploadThumbnail,
  FileOrPath,
  UploadMetadataToIPFS,
  UploadEncryptedFileToIPFS,
  UploadThumbnailToIPFS,
<<<<<<< HEAD
  Base64DataUrl,
=======
>>>>>>> cf8303f71eb8fbf3a2e16d6fe1f6cbf2834de59c
};
