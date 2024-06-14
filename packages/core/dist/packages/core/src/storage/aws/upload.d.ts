/// <reference types="node" />
import * as Stream from "stream";
import { EncryptLogic, FileOrPath } from "../../vwbl/types";
import { AWSConfig } from "./types";
export declare const uploadEncryptedFile: (fileName: string, encryptedContent: string | Uint8Array | Stream.Readable, uuid: string, awsConfig?: AWSConfig) => Promise<string>;
export declare const uploadThumbnail: (thumbnailImage: FileOrPath, uuid: string, awsConfig?: AWSConfig) => Promise<string>;
export declare const uploadMetadata: (tokenId: number, name: string, description: string, previewImageUrl: string, encryptedDataUrls: string[], mimeType: string, encryptLogic: EncryptLogic, awsConfig?: AWSConfig) => Promise<string>;
export declare const uploadDirectoryToS3: (directoryPath: string, awsConfig?: AWSConfig) => void;
