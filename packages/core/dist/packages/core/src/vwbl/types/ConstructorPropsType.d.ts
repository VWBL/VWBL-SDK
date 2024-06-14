import { IPFSConfig } from "../../storage/ipfs/types";
import { AWSConfig } from "../../storage/aws/types";
import { UploadContentType } from "./UploadContentType";
import { UploadMetadataType } from "./UploadMetadataType";
export type CoreConstructorProps = {
    uploadContentType: UploadContentType;
    uploadMetadataType: UploadMetadataType;
    awsConfig?: AWSConfig;
    ipfsConfig?: IPFSConfig;
};
