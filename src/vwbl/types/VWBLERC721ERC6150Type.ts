import {
  EncryptLogic,
  FileOrPath,
  GasSettings,
  ProgressSubscriber,
  UploadEncryptedFile,
  UploadMetadata,
  UploadThumbnail,
} from "./index";

export type ManagedCreateToken = {
  // Interface for ERC721
  (
    name: string,
    description: string,
    plainFile: FileOrPath | FileOrPath[],
    thumbnailImage: FileOrPath,
    feeNumerator: number,
    encryptLogic: EncryptLogic,
    uploadEncryptedFileCallback: UploadEncryptedFile | undefined,
    uploadThumbnailCallback: UploadThumbnail | undefined,
    uploadMetadataCallBack: UploadMetadata | undefined,
    subscriber: ProgressSubscriber | undefined,
    gasSettings: GasSettings | undefined
  ): Promise<number>;

  // Interface for ERC6150
  (
    name: string,
    description: string,
    plainFile: FileOrPath | FileOrPath[],
    thumbnailImage: FileOrPath,
    feeNumerator: number,
    encryptLogic: EncryptLogic,
    uploadEncryptedFileCallback: UploadEncryptedFile | undefined,
    uploadThumbnailCallback: UploadThumbnail | undefined,
    uploadMetadataCallBack: UploadMetadata | undefined,
    subscriber: ProgressSubscriber | undefined,
    gasSettings: GasSettings | undefined,
    parentId: number | undefined
  ): Promise<number>;
};

export type ManagedCreateTokenForIPFS = {
  // Interface for ERC721
  (
    name: string,
    description: string,
    plainFile: FileOrPath | FileOrPath[],
    thumbnailImage: FileOrPath,
    feeNumerator: number,
    encryptLogic: EncryptLogic,
    subscriber: ProgressSubscriber | undefined,
    gasSettings: GasSettings | undefined
  ): Promise<number>;

  // Interface for ERC6150
  (
    name: string,
    description: string,
    plainFile: FileOrPath | FileOrPath[],
    thumbnailImage: FileOrPath,
    feeNumerator: number,
    encryptLogic: EncryptLogic,
    subscriber: ProgressSubscriber | undefined,
    gasSettings: GasSettings | undefined,
    parentId: number | undefined
  ): Promise<number>;
};

export type GrantViewPermission = {
  // Interface for ERC721
  (tokenId: number, grantee: string, gasSettings: GasSettings | undefined): Promise<void>;

  // Interface for ERC6150
  (tokenId: number, grantee: string, gasSettings: GasSettings | undefined, toDir: boolean | undefined): Promise<void>;
};

export type ManagedCreateTokenMetatx = {
  // Interface for ERC721
  (
    name: string,
    description: string,
    plainFile: FileOrPath | FileOrPath[],
    thumbnailImage: FileOrPath,
    feeNumerator: number,
    encryptLogic: EncryptLogic,
    mintApiId: string,
    uploadEncryptedFileCallback: UploadEncryptedFile | undefined,
    uploadThumbnailCallback: UploadThumbnail | undefined,
    uploadMetadataCallBack: UploadMetadata | undefined,
    subscriber: ProgressSubscriber | undefined
  ): Promise<number>;

  // Interface for ERC6150
  (
    name: string,
    description: string,
    plainFile: FileOrPath | FileOrPath[],
    thumbnailImage: FileOrPath,
    feeNumerator: number,
    encryptLogic: EncryptLogic,
    mintApiId: string,
    uploadEncryptedFileCallback: UploadEncryptedFile | undefined,
    uploadThumbnailCallback: UploadThumbnail | undefined,
    uploadMetadataCallBack: UploadMetadata | undefined,
    subscriber: ProgressSubscriber | undefined,
    parentId: number | undefined
  ): Promise<number>;
};

export type ManagedCreateTokenForIPFSMetaTx = {
  // Interface for ERC721
  (
    name: string,
    description: string,
    plainFile: FileOrPath | FileOrPath[],
    thumbnailImage: FileOrPath,
    feeNumerator: number,
    encryptLogic: EncryptLogic,
    mintApiId: string,
    subscriber: ProgressSubscriber | undefined
  ): Promise<number>;

  // Interface for ERC6150
  (
    name: string,
    description: string,
    plainFile: FileOrPath | FileOrPath[],
    thumbnailImage: FileOrPath,
    feeNumerator: number,
    encryptLogic: EncryptLogic,
    mintApiId: string,
    subscriber: ProgressSubscriber | undefined,
    parentId: number | undefined
  ): Promise<number>;
};

export type GrantViewPermissionMetaTx = {
  // Interface for ERC721
  (tokenId: number, grantee: string, grantViewPermissionApiId: string): Promise<void>;

  // Interface for ERC6150
  (tokenId: number, grantee: string, grantViewPermissionApiId: string, toDir: boolean | undefined): Promise<void>;
};
