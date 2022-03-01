import { FileType } from "../types/File";

// use snake case because OpenSea's metadata standard is snake case.
export type PlainMetadata = {
  name: string;
  description: string;
  image: string;
  encrypted_data: string;
  file_type: FileType;
};

export type Metadata = {
  id: number;
  name: string;
  description: string;
  image: string;
  fileType: FileType;
};

export type ExtractMetadata = Metadata & {
  fileName: string;
  ownData: string;
};
