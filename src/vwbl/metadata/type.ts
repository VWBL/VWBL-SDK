// use snake case because OpenSea's metadata standard is snake case.
export type PlainMetadata = {
  name: string;
  description: string;
  image: string;
  encrypted_data: string;
  mime_type: string;
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
  ownData: string;
};
