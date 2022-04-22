type UploadFilesRetVal = {
  encryptedDataUrl: string;
  thumbnailImageUrl: string;
};
type UploadFile = (
  plainData: File,
  thumbnailImage: File,
  encryptedContent: string
) => Promise<UploadFilesRetVal>;
type UploadMetadata = (
  tokenId: number,
  name: string,
  description: string,
  previewImageUrl: string,
  encryptedDataUrl: string,
  mimeType: string
) => Promise<void>;

export { UploadFilesRetVal, UploadFile, UploadMetadata };
