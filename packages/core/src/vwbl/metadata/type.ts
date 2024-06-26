// use snake case because OpenSea's metadata standard is snake case.
import * as Stream from "stream";

import { EncryptLogic } from "../types";

export type PlainMetadata = {
  name: string;
  description: string;
  image: string;
  encrypted_data: string[];
  mime_type: string;
  encrypt_logic: EncryptLogic;
};

export type Metadata = {
  id: number;
  name: string;
  description: string;
  image: string;
  mimeType: string;
  encryptLogic: EncryptLogic;
};

export type ExtractMetadata = Metadata & {
  fileName: string;
  ownDataBase64: string[];
  ownFiles: ArrayBuffer[] | Stream[];
};

export type ExtendedMetadeta = Metadata & {
  address: string;
};
