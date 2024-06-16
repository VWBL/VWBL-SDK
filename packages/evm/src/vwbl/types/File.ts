import { AWSConfig } from "@evm/storage";
import * as Stream from "stream";

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

type FileOrPath = File | string;

export { UploadMetadata, UploadEncryptedFile, UploadThumbnail, FileOrPath };
