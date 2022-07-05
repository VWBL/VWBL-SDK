// use snake case because OpenSea's metadata standard is snake case.
import { EncryptLogic } from "../types/EncryptLogic";

export type PlainMetadata = {
  name: string;
  description: string;
  image: string;
  encrypted_data: string;
  mime_type: string;
  encrypt_logic: EncryptLogic;
};

export type Metadata = {
  id: number;
  name: string;
  description: string;
  image: string;
  mimeType: string;
};

export type ExtractMetadata = Metadata & {
  fileName: string;
  ownData: string | ArrayBuffer;
};
