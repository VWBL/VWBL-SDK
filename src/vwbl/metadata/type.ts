import { FileType } from "../types/File";

// use snake case because OpenSea's metadata standard is snake case.
export type PlainMetadata = {
  name: string,
  description: string,
  image: string;
  encrypted_data: string;
  file_type: FileType;
}

export type ExtractMetadata = {
  id: number;
  name: string,
  description: string
  image: string;
  fileType: FileType;
  fileName: string;
  ownData: string;
}
