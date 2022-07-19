import AWS from "aws-sdk";
import axios from "axios";
import Web3 from "web3";

import { AWSConfig } from "../storage/aws/types";
import { uploadEncryptedFile, uploadMetadata, uploadThumbnail } from "../storage/aws/upload";
import { IPFSInfuraConfig } from "../storage/ipfs/types";
import { UploadToIPFS } from "../storage/ipfs/upload";
import {
  createRandomKey,
  decryptFileOnBrowser,
  decryptString,
  encryptFileOnBrowser,
  encryptString,
} from "../util/cryptoHelper";
import { getMimeType, toBase64FromBlob } from "../util/imageEditor";
import { VWBLApi } from "./api";
import { signToProtocol, VWBLNFT } from "./blockchain";
import { ExtractMetadata, Metadata, PlainMetadata } from "./metadata";
import {
  EncryptLogic,
  ManageKeyType,
  UploadContentType,
  UploadEncryptedFile,
  UploadMetadata,
  UploadMetadataType,
  UploadThumbnail,
} from "./types";

export type ConstructorProps = {
  web3: Web3;
  contractAddress: string;
  vwblNetworkUrl: string;
  manageKeyType?: ManageKeyType;
  uploadContentType?: UploadContentType;
  uploadMetadataType?: UploadMetadataType;
  awsConfig?: AWSConfig;
  ipfsInfuraConfig?: IPFSInfuraConfig;
};

export type VWBLOption = ConstructorProps;

export class VWBL {
  private nft: VWBLNFT;
  public opts: VWBLOption;
  private api: VWBLApi;
  public signature?: string;
  private uploadToIpfs?: UploadToIPFS;

  constructor(props: ConstructorProps) {
    const {
      web3,
      contractAddress,
      uploadContentType,
      uploadMetadataType,
      awsConfig,
      vwblNetworkUrl,
      ipfsInfuraConfig,
    } = props;
    this.opts = props;
    this.api = new VWBLApi(vwblNetworkUrl);
    this.nft = uploadContentType === UploadContentType.S3 ? new VWBLNFT(web3, contractAddress, false) : new VWBLNFT(web3, contractAddress, true);
    if (uploadContentType === UploadContentType.S3 || uploadMetadataType === UploadMetadataType.S3) {
      if (!awsConfig) {
        throw new Error("please specify S3 bucket.");
      }
      AWS.config.update({
        region: awsConfig.region,
        credentials: new AWS.CognitoIdentityCredentials({
          IdentityPoolId: awsConfig.idPoolId,
        }),
      });
    } else if (uploadContentType === UploadContentType.IPFS || uploadMetadataType === UploadMetadataType.IPFS) {
      if (!ipfsInfuraConfig) {
        throw new Error("please specify Infura config of IPFS.");
      }
      this.uploadToIpfs = new UploadToIPFS(ipfsInfuraConfig);
    }
  }

  /**
   * Sign to VWBL
   *
   * @remarks
   * You need to call this method before you send a transaction（eg. mint NFT）
   */
  sign = async () => {
    this.signature = await signToProtocol(this.opts.web3);
    console.log("signed");
  };

  /**
   * Create VWBL NFT
   *
   * @remarks
   * The following happens: Minting NFT, Uploading encrypted data, Uploading metadata, Setting key to VWBL Network
   * By default, metadata will be uploaded to Amazon S3.
   * You need to pass `uploadFileCallback` and `uploadMetadataCallBack` if you upload metadata to a storage other than Amazon S3.
   *
   * @param name - The NFT name
   * @param description - The NFT description
   * @param plainFile - The data that only NFT owner can view
   * @param thumbnailImage - The NFT image
   * @param royaltiesPercentage - This percentage of the sale price will be paid to the NFT creator every time the NFT is sold or re-sold
   * @param encryptLogic - Select ether "base64" or "binary". Selection criteria: "base64" -> sutable for small data. "binary" -> sutable for large data.
   * @param hasNonce
   * @param autoMigration
   * @param uploadEncryptedFileCallback - Optional: the function for uploading encrypted data
   * @param uploadThumbnailCallback - Optional: the function for uploading thumbnail
   * @param uploadMetadataCallBack - Optional: the function for uploading metadata
   * @returns
   */
  managedCreateToken = async (
    name: string,
    description: string,
    plainFile: File | File[],
    thumbnailImage: File,
    royaltiesPercentage: number,
    encryptLogic: EncryptLogic = "base64",
    hasNonce: boolean = false,
    autoMigration: boolean = false,
    uploadEncryptedFileCallback?: UploadEncryptedFile,
    uploadThumbnailCallback?: UploadThumbnail,
    uploadMetadataCallBack?: UploadMetadata
  ) => {
    if (!this.signature) {
      throw "please sign first";
    }
    const { uploadContentType, uploadMetadataType, awsConfig, vwblNetworkUrl } = this.opts;
    // 1. mint token
    const documentId = this.opts.web3.utils.randomHex(32);
    const tokenId = await this.nft.mintToken(vwblNetworkUrl, royaltiesPercentage, documentId);
    // 2. create key in frontend
    const key = createRandomKey();
    // 3. encrypt data
    console.log("encrypt data");
    const plainFileArray = [plainFile].flat();
    const uuid = createRandomKey();
    const uploadEncryptedFunction =
      uploadContentType === UploadContentType.S3 ? uploadEncryptedFile : uploadEncryptedFileCallback;
    const uploadThumbnailFunction =
      uploadContentType === UploadContentType.S3 ? uploadThumbnail : uploadThumbnailCallback;
    if (!uploadEncryptedFunction || !uploadThumbnailFunction) {
      throw new Error("please specify upload file type or give callback");
    }
    // 4. upload data
    console.log("upload data");
    const encryptedDataUrls = await Promise.all(
      plainFileArray.map(async (file) => {
        const base64content = await toBase64FromBlob(file);
        const encryptedContent =
          encryptLogic === "base64" ? encryptString(base64content, key) : await encryptFileOnBrowser(file, key);
        console.log(typeof encryptedContent);
        return await uploadEncryptedFunction(file.name, encryptedContent, uuid, awsConfig);
      })
    );
    const thumbnailImageUrl = await uploadThumbnailFunction(thumbnailImage, uuid, awsConfig);
    // 5. upload metadata
    console.log("upload meta data");
    const uploadMetadataFunction =
      uploadMetadataType === UploadMetadataType.S3 ? uploadMetadata : uploadMetadataCallBack;
    if (!uploadMetadataFunction) {
      throw new Error("please specify upload metadata type or give callback");
    }
    const mimeType = getMimeType(plainFileArray[0]);
    await uploadMetadataFunction(
      tokenId,
      name,
      description,
      thumbnailImageUrl,
      encryptedDataUrls,
      mimeType,
      encryptLogic,
      awsConfig
    );
    // 6. set key to vwbl-network
    console.log("set key");
    const chainId = await this.opts.web3.eth.getChainId();
    await this.api.setKey(documentId, chainId, key, this.signature);
    return tokenId;
  };

  /**
   * Create VWBL NFT which metadata on IPFS.
   *
   * @remarks
   * The following happens: Minting NFT, Uploading encrypted data, Uploading metadata, Setting key to VWBL Network
   * metadata will be uploaded to IPFS.
   * You need to pass `uploadFileCallback` and `uploadMetadataCallBack` if you upload metadata to a storage other than Amazon S3.
   *
   * @param name - The NFT name
   * @param description - The NFT description
   * @param plainFile - The data that only NFT owner can view
   * @param thumbnailImage - The NFT image
   * @param royaltiesPercentage - This percentage of the sale price will be paid to the NFT creator every time the NFT is sold or re-sold
   * @param encryptLogic - Select ether "base64" or "binary". Selection criteria: "base64" -> sutable for small data. "binary" -> sutable for large data.
   * @param isPin - The Identifier of whether to pin uploaded data on IPFS.
   * @returns
   */
  managedCreateTokenForIPFS = async (
    name: string,
    description: string,
    plainFile: File | File[],
    thumbnailImage: File,
    royaltiesPercentage: number,
    encryptLogic: EncryptLogic = "base64",
    isPin = true,
    hasNonce: boolean = false,
    autoMigration: boolean = false
  ) => {
    if (!this.signature) {
      throw "please sign first";
    }
    const { vwblNetworkUrl } = this.opts;
    // 1. create key in frontend
    const key = createRandomKey();
    // 2. encrypt data
    console.log("encrypt data");
    const plainFileArray = [plainFile].flat();
    // 3. upload data
    console.log("upload data");
    const encryptedDataUrls = await Promise.all(
      plainFileArray.map(async (file) => {
        const base64content = await toBase64FromBlob(file);
        const encryptedContent =
          encryptLogic === "base64" ? encryptString(base64content, key) : await encryptFileOnBrowser(file, key);
        console.log(typeof encryptedContent);
        return await this.uploadToIpfs?.uploadEncryptedFile(encryptedContent, isPin);
      })
    );
    const thumbnailImageUrl = await this.uploadToIpfs?.uploadThumbnail(thumbnailImage, isPin);
    // 4. upload metadata
    console.log("upload meta data");
    const mimeType = getMimeType(plainFileArray[0]);
    const metadataUrl = await this.uploadToIpfs?.uploadMetadata(
      name,
      description,
      thumbnailImageUrl as string,
      encryptedDataUrls as string[],
      mimeType,
      encryptLogic,
      isPin
    );
    // 5. mint token
    const documentId = this.opts.web3.utils.randomHex(32);
    const tokenId = await this.nft.mintTokenForIPFS(
      metadataUrl as string,
      vwblNetworkUrl,
      royaltiesPercentage,
      documentId
    );
    // 6. set key to vwbl-network
    console.log("set key");
    const chainId = await this.opts.web3.eth.getChainId();
    await this.api.setKey(documentId, chainId, key, this.signature);
    return tokenId;
  };

  /**
   * Mint new NFT
   *
   * @param royaltiesPercentage - This percentage of the sale price will be paid to the NFT creator every time the NFT is sold or re-sold
   * @returns The ID of minted NFT
   */
  mintToken = async (royaltiesPercentage: number): Promise<number> => {
    const { vwblNetworkUrl } = this.opts;
    const documentId = this.opts.web3.utils.randomHex(32);
    return await this.nft.mintToken(vwblNetworkUrl, royaltiesPercentage, documentId);
  };

  /**
   * Create a key used for encryption and decryption
   *
   * @returns Random string generated by uuid
   */
  createKey = async (): Promise<string> => {
    return createRandomKey();
  };

  /**
   * Encode `plainData` to Base64 and encrypt it
   *
   * @param plainData - The data that only NFT owner can view
   * @param key - The key generated by {@link VWBL.createKey}
   * @returns Encrypted file data
   */
  encryptDataViaBase64 = async (plainData: File, key: string): Promise<string> => {
    const content = await toBase64FromBlob(plainData);
    return encryptString(content, key);
  };

  /**
   * Encrypt `plainData`
   *
   * @param plainData - The data that only NFT owner can view
   * @param key - The key generated by {@link VWBL.createKey}
   * @returns Encrypted file data
   */
  encryptFile = async (plainData: File, key: string): Promise<ArrayBuffer> => {
    return encryptFileOnBrowser(plainData, key);
  };

  /**
   * Uplod Metadata
   *
   * @remarks
   * By default, metadata will be uploaded to Amazon S3.
   * You need to pass `uploadMetadataCallBack` if you upload metadata to a storage other than Amazon S3.
   *
   * @param tokenId - The ID of NFT
   * @param name - The NFT name
   * @param description - The NFT description
   * @param thumbnailImageUrl - The URL of the thumbnail image
   * @param encryptedDataUrls - The URL of the encrypted file data
   * @param mimeType - The mime type of encrypted file data
   * @param encryptLogic - Select ether "base64" or "binary". Selection criteria: "base64" -> sutable for small data. "binary" -> sutable for large data.
   * @param uploadMetadataCallBack - Optional: the function for uploading metadata
   */
  uploadMetadata = async (
    tokenId: number,
    name: string,
    description: string,
    thumbnailImageUrl: string,
    encryptedDataUrls: string[],
    mimeType: string,
    encryptLogic: EncryptLogic,
    uploadMetadataCallBack?: UploadMetadata
  ): Promise<void> => {
    const { uploadMetadataType, awsConfig } = this.opts;
    const uploadMetadataFunction =
      uploadMetadataType === UploadMetadataType.S3 ? uploadMetadata : uploadMetadataCallBack;
    if (!uploadMetadataFunction) {
      throw new Error("please specify upload metadata type or give callback");
    }
    await uploadMetadataFunction(
      tokenId,
      name,
      description,
      thumbnailImageUrl,
      encryptedDataUrls,
      mimeType,
      encryptLogic,
      awsConfig
    );
  };

  /**
   * Uplod Metadata to IPFS
   *
   * @remarks
   * Metadata will be uploaded to IPFS.
   *
   * @param tokenId - The ID of NFT
   * @param name - The NFT name
   * @param description - The NFT description
   * @param thumbnailImageUrl - The URL of the thumbnail image
   * @param encryptedDataUrls - The URL of the encrypted file data
   * @param mimeType - The mime type of encrypted file data
   * @param encryptLogic - Select ether "base64" or "binary". Selection criteria: "base64" -> sutable for small data. "binary" -> sutable for large data.
   * @param isPin - The Identifier of whether to pin uploaded data on IPFS.
   */
  uploadMetadataToIPFS = async (
    name: string,
    description: string,
    thumbnailImageUrl: string,
    encryptedDataUrls: string[],
    mimeType: string,
    encryptLogic: EncryptLogic,
    isPin = true
  ): Promise<string> => {
    const metadataUrl = await this.uploadToIpfs?.uploadMetadata(
      name,
      description,
      thumbnailImageUrl,
      encryptedDataUrls,
      mimeType,
      encryptLogic,
      isPin
    );
    return metadataUrl as string;
  };

  /**
   * Set key to VWBL Network
   *
   * @param tokenId - The ID of NFT
   * @param key - The key generated by {@link VWBL.createKey}
   * @param hasNonce
   * @param autoMigration
   */
  setKey = async (tokenId: number, key: string, hasNonce?: boolean, autoMigration?: boolean): Promise<void> => {
    if (!this.signature) {
      throw "please sign first";
    }
    const { documentId } = await this.nft.getTokenInfo(tokenId);
    const chainId = await this.opts.web3.eth.getChainId();
    await this.api.setKey(documentId, chainId, key, this.signature);
  };

  /**
   * Get token IDs owned by someone who called this function
   *
   * @returns Array of token IDs
   */
  getOwnTokenIds = async (): Promise<number[]> => {
    return await this.nft.getOwnTokenIds();
  };

  /**
   * Get NFT metadata from given `tokenId`
   *
   * @remarks
   * Check if a person call this method is a NFT owner, and if so, return a decrypted data.
   *
   * @param tokenId - The ID of NFT
   * @returns Token metadata and an address of NFT owner
   */
  getTokenById = async (tokenId: number): Promise<(ExtractMetadata | Metadata) & { owner: string }> => {
    const isOwnerOrMinter = (await this.nft.isOwnerOf(tokenId)) || (await this.nft.isMinterOf(tokenId));
    const owner = await this.nft.getOwner(tokenId);
    const metadata = isOwnerOrMinter ? await this.extractMetadata(tokenId) : await this.getMetadata(tokenId);
    if (!metadata) {
      throw new Error("metadata not found");
    }
    return { ...metadata, owner };
  };

  /**
   * Get all NFT metadata owned by a person who call this method
   *
   * @returns Array of token metadata
   */
  getOwnTokens = async (): Promise<Metadata[]> => {
    if (!this.signature) {
      throw "please sign first";
    }
    const ownTokenIds = await this.nft.getOwnTokenIds();
    return (await Promise.all(ownTokenIds.map(this.getMetadata.bind(this)))).filter(
      (extractMetadata): extractMetadata is Metadata => extractMetadata !== undefined
    );
  };

  /**
   * Get token ids by minter address
   * @param address - minter address
   * @returns Token ids
   */
  getTokenByMinter = async (address: string): Promise<number[]> => {
    return await this.nft.getTokenByMinter(address);
  };

  /**
   * Get NFT metadata from given `tokenId`
   *
   * @param tokenId - The ID of NFT
   * @returns Token metadata
   */
  getMetadata = async (tokenId: number): Promise<Metadata | undefined> => {
    const metadataUrl = await this.nft.getMetadataUrl(tokenId);
    const metadata = (await axios.get(metadataUrl).catch(() => undefined))?.data;
    // delete token if metadata is not found
    if (!metadata) {
      return undefined;
    }
    return {
      id: tokenId,
      name: metadata.name,
      description: metadata.description,
      image: metadata.image,
      mimeType: metadata.mime_type,
      encryptLogic: metadata.encrypt_logic,
    };
  };

  /**
   * Approves `operator` to transfer the given `tokenId`
   *
   * @param operator - The wallet address
   * @param tokenId - The ID of NFT
   */
  approve = async (operator: string, tokenId: number): Promise<void> => {
    await this.nft.approve(operator, tokenId);
  };

  /**
   * Get the approved address for a `tokenId`
   *
   * @param tokenId - The ID of NFT
   * @return The Wallet address that was approved
   */
  getApproved = async (tokenId: number): Promise<string> => {
    return await this.nft.getApproved(tokenId);
  };

  /**
   * Allows `operator` to transfer all tokens that a person who calls this function
   *
   * @param operator - The wallet address
   */
  setApprovalForAll = async (operator: string): Promise<void> => {
    await this.nft.setApprovalForAll(operator);
  };

  /**
   * Tells whether an `operator` is approved by a given `owner`
   *
   * @param owner - The wallet address of a NFT owner
   * @param operator - The wallet address of an operator
   * @returns
   */
  isApprovedForAll = async (owner: string, operator: string): Promise<boolean> => {
    return await this.nft.isApprovedForAll(owner, operator);
  };

  /**
   * Get NFT metadata from given `tokenId`
   *
   * @remarks
   * This method should be called by NFT owner.
   *
   * @param tokenId The ID of NFT
   * @returns Token metadata
   */
  extractMetadata = async (tokenId: number): Promise<ExtractMetadata | undefined> => {
    if (!this.signature) {
      throw "please sign first";
    }
    const metadataUrl = await this.nft.getMetadataUrl(tokenId);
    const metadata: PlainMetadata = (await axios.get(metadataUrl).catch(() => undefined))?.data;
    // delete token if metadata is not found
    if (!metadata) {
      return undefined;
    }
    const { documentId } = await this.nft.getTokenInfo(tokenId);
    const chainId = await this.opts.web3.eth.getChainId();
    const decryptKey = await this.api.getKey(documentId, chainId, this.signature);
    const encryptedDataUrls = metadata.encrypted_data;
    const ownDataArray = await Promise.all(
      encryptedDataUrls.map(async (encryptedDataUrl) => {
        const encryptedData = (
          await axios.get(encryptedDataUrl, {
            responseType: metadata.encrypt_logic === "binary" ? "arraybuffer" : "text",
          })
        ).data;
        const encryptLogic = metadata.encrypt_logic ?? "base64";
        return encryptLogic === "base64"
          ? decryptString(encryptedData, decryptKey)
          : await decryptFileOnBrowser(encryptedData, decryptKey);
      })
    );
    const ownFiles = ownDataArray.filter((ownData): ownData is ArrayBuffer => ownData instanceof ArrayBuffer);
    const ownDataBase64 = ownDataArray.filter((ownData): ownData is string => typeof ownData === "string");
    const fileName = encryptedDataUrls[0]
      .split("/")
      .slice(-1)[0]
      .replace(/\.vwbl/, "");
    return {
      id: tokenId,
      name: metadata.name,
      description: metadata.description,
      image: metadata.image,
      mimeType: metadata.mime_type,
      encryptLogic: metadata.encrypt_logic,
      ownDataBase64,
      ownFiles,
      fileName,
    };
  };

  /**
   * Trnasfer NFT
   *
   * @param to - The address that NFT will be transfered
   * @param tokenId - The ID of NFT
   */
  safeTransfer = async (to: string, tokenId: number): Promise<void> => {
    await this.nft.safeTransfer(to, tokenId);
  };
}
