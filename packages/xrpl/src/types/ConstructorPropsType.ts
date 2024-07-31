import {
  IPFSConfig,
  AWSConfig,
  UploadContentType,
  UploadMetadataType,
} from "vwbl-core";

export type XrplConstructorProps = {
  xrplChainId: number;
  vwblNetworkUrl: string;
  uploadContentType?: UploadContentType;
  uploadMetadataType?: UploadMetadataType;
  awsConfig?: AWSConfig;
  ipfsConfig?: IPFSConfig;
};
