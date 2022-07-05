import { EncryptLogic } from "./EncryptLogic";

type UploadFilesRetVal = {
  encryptedDataUrl: string;
  thumbnailImageUrl: string;
};
type UploadFile = (
  plainData: File,
  thumbnailImage: File,
  encryptedContent: string | ArrayBuffer,
) => Promise<UploadFilesRetVal>;
type UploadMetadata = (
  tokenId: number,
  name: string,
  description: string,
  previewImageUrl: string,
  encryptedDataUrl: string,
  mimeType: string,
  encryptLogic: EncryptLogic,
) => Promise<void>;

export { UploadFilesRetVal, UploadFile, UploadMetadata };
