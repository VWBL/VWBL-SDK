import { UploadContentType } from "./UploadContentType";
import { UploadMetadataType } from "./UploadMetadataType";
import { AWSConfig } from "../../storage/aws/types";

export type CoreConstructorProps = {
  uploadContentType: UploadContentType;
  uploadMetadataType: UploadMetadataType;
  awsConfig?: AWSConfig;
  ipfsNftStorageKey?: string;
};