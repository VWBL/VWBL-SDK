type FileContent = {
  lastModified?: number;
  name: string;
  content: string;
}
type UploadFilesRetVal = {
  encryptedDataUrl: string;
  thumbnailImageUrl: string
}

type UploadFile = (plainData: FileContent, thumbnailImage: FileContent, encryptedContent: string) => Promise<UploadFilesRetVal>

export { FileContent, UploadFilesRetVal, UploadFile };
