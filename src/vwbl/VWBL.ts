import AWS from "aws-sdk";
import axios from "axios";
import Web3 from "web3";

import { AWSConfig } from "../aws/types";
import { uploadAll, uploadMetadata } from "../aws/upload";
import { createRandomKey, decrypt, encrypt } from "../util/cryptoHelper";
import { getMimeType, toBase64FromBlob } from "../util/imageEditor";
import { VWBLApi } from "./api";
import { signToProtocol, VWBLNFT } from "./blockchain";
import { ExtractMetadata, Metadata } from "./metadata";
import { ManageKeyType, UploadContentType, UploadFile, UploadMetadata, UploadMetadataType } from "./types";

export type ConstructorProps = {
  web3: Web3;
  contractAddress: string;
  vwblNetworkUrl: string;
  manageKeyType?: ManageKeyType;
  uploadContentType?: UploadContentType;
  uploadMetadataType?: UploadMetadataType;
  awsConfig?: AWSConfig;
};

export type VWBLOption = ConstructorProps;

export class VWBL {
  private nft: VWBLNFT;
  public opts: VWBLOption;
  private api: VWBLApi;
  public signature?: string;

  constructor(props: ConstructorProps) {
    const { web3, contractAddress, manageKeyType, uploadContentType, uploadMetadataType, awsConfig, vwblNetworkUrl } =
      props;
    this.nft = new VWBLNFT(web3, contractAddress);
    this.opts = props;
    this.api = new VWBLApi(vwblNetworkUrl);
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
   * @param plainData - The data that only NFT owner can view
   * @param thumbnailImage - The NFT image
   * @param royaltiesPercentage - This percentage of the sale price will be paid to the NFT creator every time the NFT is sold or re-sold
   * @param uploadFileCallback - Optional: the function for uploading plainData
   * @param uploadMetadataCallBack - Optional: the function for uploading metadata
   * @returns
   */
  managedCreateToken = async (
    name: string,
    description: string,
    plainData: File,
    thumbnailImage: File,
    royaltiesPercentage: number,
    uploadFileCallback?: UploadFile,
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
    const content = await toBase64FromBlob(plainData);
    const encryptedContent = encrypt(content, key);
    // 4. upload data
    console.log("upload data");
    const uploadAllFunction = uploadContentType === UploadContentType.S3 ? uploadAll : uploadFileCallback;
    if (!uploadAllFunction) {
      throw new Error("please specify upload file type or give callback");
    }
    const { encryptedDataUrl, thumbnailImageUrl } = await uploadAllFunction(
      plainData,
      thumbnailImage,
      encryptedContent,
      awsConfig
    );
    // 5. upload metadata
    console.log("upload meta data");
    const uploadMetadataFunction =
      uploadMetadataType === UploadMetadataType.S3 ? uploadMetadata : uploadMetadataCallBack;
    if (!uploadMetadataFunction) {
      throw new Error("please specify upload metadata type or give callback");
    }
    const mimeType = getMimeType(plainData);
    await uploadMetadataFunction(tokenId, name, description, thumbnailImageUrl, encryptedDataUrl, mimeType, awsConfig);
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
    return encrypt(content, key);
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
   * @param encryptedDataUrl - The URL of the encrypted file data
   * @param mimeType - The mime type of encrypted file data
   * @param uploadMetadataCallBack - Optional: the function for uploading metadata
   */
  uploadMetadata = async (
    tokenId: number,
    name: string,
    description: string,
    thumbnailImageUrl: string,
    encryptedDataUrl: string,
    mimeType: string,
    uploadMetadataCallBack?: UploadMetadata
  ): Promise<void> => {
    const { uploadMetadataType, awsConfig } = this.opts;
    const uploadMetadataFunction =
      uploadMetadataType === UploadMetadataType.S3 ? uploadMetadata : uploadMetadataCallBack;
    if (!uploadMetadataFunction) {
      throw new Error("please specify upload metadata type or give callback");
    }

    await uploadMetadataFunction(tokenId, name, description, thumbnailImageUrl, encryptedDataUrl, mimeType, awsConfig);
  };

  /**
   * Set key to VWBL Network
   *
   * @param tokenId - The ID of NFT
   * @param key - The key generated by {@link VWBL.createKey}
   */
  setKey = async (tokenId: number, key: string): Promise<void> => {
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
    const ownTokens = (await Promise.all(ownTokenIds.map(this.getMetadata.bind(this)))).filter(
      (extractMetadata): extractMetadata is Metadata => extractMetadata !== undefined
    );
    return ownTokens;
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
    if (!this.signature) {
      throw "please sign first";
    }
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
    };
  };

  /**
   * Approves `operator` to transfer the given `tokenId`
   *
   * @param operator - The wallet address
   * @param tokenId - The ID of NFT
   */
  approve = async (operator: string, tokenId: number): Promise<void> => {
    if (!this.signature) {
      throw "please sign first";
    }
    await this.nft.approve(operator, tokenId);
  };

  /**
   * Get the approved address for a `tokenId`
   *
   * @param tokenId - The ID of NFT
   * @return The Wallet address that was approved
   */
  getApproved = async (tokenId: number): Promise<string> => {
    if (!this.signature) {
      throw "please sign first";
    }
    return await this.nft.getApproved(tokenId);
  };

  /**
   * Allows `operator` to transfer all tokens that a person who calls this function
   *
   * @param operator - The wallet address
   */
  setApprovalForAll = async (operator: string): Promise<void> => {
    if (!this.signature) {
      throw "please sign first";
    }
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
    if (!this.signature) {
      throw "please sign first";
    }
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
    const metadata = (await axios.get(metadataUrl).catch(() => undefined))?.data;
    // delete token if metadata is not found
    if (!metadata) {
      return undefined;
    }
    const encryptedDataUrl = metadata.encrypted_image_url ?? metadata.encrypted_data;
    // metadata.encrypted_image_url is deprecated
    const encryptedData = (await axios.get(encryptedDataUrl)).data;
    const { documentId } = await this.nft.getTokenInfo(tokenId);
    const chainId = await this.opts.web3.eth.getChainId();
    const decryptKey = await this.api.getKey(documentId, chainId, this.signature);
    const ownData = decrypt(encryptedData, decryptKey);
    // .encrypted is deprecated
    const fileName = encryptedDataUrl
      .split("/")
      .slice(-1)[0]
      .replace(/(.encrypted)|(.vwbl)/, "");
    return {
      id: tokenId,
      name: metadata.name,
      description: metadata.description,
      image: metadata.image,
      mimeType: metadata.mime_type,
      fileName,
      ownData,
    };
  };

  /**
   * Trnasfer NFT
   *
   * @param to - The address that NFT will be transfered
   * @param tokenId - The ID of NFT
   */
  safeTransfer = async (to: string, tokenId: number): Promise<void> => {
    if (!this.signature) {
      throw "please sign first";
    }
    await this.nft.safeTransfer(to, tokenId);
  };
}
