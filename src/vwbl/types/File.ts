type FileContent = {
  lastModified?: number;
  name: string;
  content: string;
};
type UploadFilesRetVal = {
  encryptedDataUrl: string;
  thumbnailImageUrl: string;
};
enum FileType {
  IMAGE = "image",
  OTHER = "other",
}

type UploadFile = (
  plainData: FileContent,
  thumbnailImage: FileContent,
  encryptedContent: string
) => Promise<UploadFilesRetVal>;
type UploadMetadata = (
  tokenId: number,
  name: string,
  description: string,
  previewImageUrl: string,
  encryptedDataUrl: string,
  fileType: FileType
) => Promise<void>;

export { FileContent, UploadFilesRetVal, UploadFile, UploadMetadata, FileType };
