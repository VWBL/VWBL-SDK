/// <reference types="node" />
import { Readable } from "stream";
import { IPFSConfig } from "./types";
export declare const testPinataAuthentication: (ipfsConfig: IPFSConfig) => Promise<void>;
export declare const uploadEncryptedFileToIPFS: (encryptedContent: string | Uint8Array | Readable, ipfsConfig?: IPFSConfig) => Promise<string>;
export declare const uploadThumbnailToIPFS: (thumbnailImage: string | File | Blob, ipfsConfig?: IPFSConfig) => Promise<string>;
export declare const uploadMetadataToIPFS: (name: string, description: string, previewImageUrl: string, encryptedDataUrls: string[], mimeType: string, encryptLogic: string, ipfsConfig?: IPFSConfig) => Promise<string>;
