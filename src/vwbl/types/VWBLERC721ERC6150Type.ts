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
    uploadEncryptedFileCallback?: UploadEncryptedFile,
    uploadThumbnailCallback?: UploadThumbnail,
    uploadMetadataCallBack?: UploadMetadata,
    subscriber?: ProgressSubscriber,
    gasSettings?: GasSettings
  ): Promise<number>;

  // Interface for ERC6150
  (
    name: string,
    description: string,
    plainFile: FileOrPath | FileOrPath[],
    thumbnailImage: FileOrPath,
    feeNumerator: number,
    encryptLogic: EncryptLogic,
    uploadEncryptedFileCallback?: UploadEncryptedFile,
    uploadThumbnailCallback?: UploadThumbnail,
    uploadMetadataCallBack?: UploadMetadata,
    subscriber?: ProgressSubscriber,
    gasSettings?: GasSettings,
    parentId?: number
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
    subscriber?: ProgressSubscriber,
    gasSettings?: GasSettings
  ): Promise<number>;

  // Interface for ERC6150
  (
    name: string,
    description: string,
    plainFile: FileOrPath | FileOrPath[],
    thumbnailImage: FileOrPath,
    feeNumerator: number,
    encryptLogic: EncryptLogic,
    subscriber?: ProgressSubscriber,
    gasSettings?: GasSettings,
    parentId?: number
  ): Promise<number>;
};

export type MintToken = {
  // Interface for ERC721
  (feeNumerator: number, gasSettings?: GasSettings): Promise<number>;

  // Interface for ERC6150
  (feeNumerator: number, gasSettings?: GasSettings, parentId?: number): Promise<number>;
};

export type MintTokenForIPFS = {
  // Interface for ERC721
  (metadataUrl: string, feeNumerator: number, gasSettings?: GasSettings): Promise<number>;

  // Interface for ERC6150
  (metadataUrl: string, feeNumerator: number, gasSettings?: GasSettings, parentId?: number): Promise<number>;
};

export type GrantViewPermission = {
  // Interface for ERC721
  (tokenId: number, grantee: string, gasSettings?: GasSettings): Promise<void>;

  // Interface for ERC6150
  (tokenId: number, grantee: string, gasSettings?: GasSettings, toDir?: boolean): Promise<void>;
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
    uploadEncryptedFileCallback?: UploadEncryptedFile,
    uploadThumbnailCallback?: UploadThumbnail,
    uploadMetadataCallBack?: UploadMetadata,
    subscriber?: ProgressSubscriber
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
    uploadEncryptedFileCallback?: UploadEncryptedFile,
    uploadThumbnailCallback?: UploadThumbnail,
    uploadMetadataCallBack?: UploadMetadata,
    subscriber?: ProgressSubscriber,
    parentId?: number
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
    subscriber?: ProgressSubscriber
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
    subscriber?: ProgressSubscriber,
    parentId?: number
  ): Promise<number>;
};

export type MintTokenMetaTx = {
  // Interface for ERC721
  (feeNumerator: number, mintApiId: string): Promise<number>;

  // Interface for ERC6150
  (feeNumerator: number, mintApiId: string, parentId?: number): Promise<number>;
};

export type MintTokenForIPFSMetaTx = {
  // Interface for ERC721
  (metadataUrl: string, feeNumerator: number, mintApiId: string): Promise<number>;

  // Interface for ERC6150
  (metadataUrl: string, feeNumerator: number, mintApiId: string, parentId?: number): Promise<number>;
};

export type GrantViewPermissionMetaTx = {
  // Interface for ERC721
  (tokenId: number, grantee: string, grantViewPermissionApiId: string): Promise<void>;

  // Interface for ERC6150
  (tokenId: number, grantee: string, grantViewPermissionApiId: string, toDir?: boolean): Promise<void>;
};
