import axios from "axios";
import { utils } from "ethers";
import * as fs from "fs";

import {
  ExtractMetadata, 
  Metadata, 
  PlainMetadata,
  EncryptLogic,
  FileOrPath,
  ProgressSubscriber,
  StepStatus,
  UploadContentType,
  UploadEncryptedFile,
  UploadEncryptedFileToIPFS,
  UploadMetadata,
  UploadMetadataToIPFS,
  UploadMetadataType,
  UploadThumbnail,
  UploadThumbnailToIPFS,
  uploadEncryptedFile,
  uploadEncryptedFileToIPFS,
  uploadThumbnail,
  uploadThumbnailToIPFS,
  uploadMetadata,
  uploadMetadataToIPFS,
  createRandomKey,
  decryptFile,
  decryptStream,
  decryptString,
  encryptFile,
  encryptStream,
  encryptString,
  getMimeType,
  toBase64FromFile,
  isRunningOnBrowser
} from "vwbl-core";
import { VWBLBase } from "../base";
import { VWBLERC1155EthersContract } from "../blockchain";
import {
  GasSettings,
  EthersConstructorProps,
  VWBLEthersOption,
} from "../types";

/**
 * @deprecated
 * we recommend to use VWBL class, which can receive two types of constructor
 * @see {@link <https://github.com/VWBL/VWBL-SDK/blob/master/src/vwbl/erc1155/VWBL.ts>}
 */
export class VWBLERC1155Ethers extends VWBLBase {
  public opts: VWBLEthersOption;
  public nft: VWBLERC1155EthersContract;

  constructor(props: EthersConstructorProps) {
    super(props);

    this.opts = props;
    const { contractAddress, ethersProvider, ethersSigner, uploadMetadataType } = props;
    this.nft = new VWBLERC1155EthersContract(
      contractAddress,
      uploadMetadataType === UploadMetadataType.IPFS,
      ethersProvider,
      ethersSigner
    );
  }

  sign = async () => {
    await this._sign(this.opts.ethersSigner);
  };

  /**
   * Create VWBLERC1155 NFT
   *
   * @remarks
   * The following happens: Minting NFT, Uploading encrypted data, Uploading metadata, Setting key to VWBL Network
   * By default, metadata will be uploaded to Amazon S3.
   * You need to pass `uploadFileCallback` and `uploadMetadataCallBack` if you upload metadata to a storage other than Amazon S3.
   *
   * @param name - The NFT name
   * @param description - The NFT description
   * * @param amount - The amount of erc1155 tokens to be minted
   * @param plainFile - The data that only NFT owner can view
   * @param thumbnailImage - The NFT image
   * @param feeNumerator - This basis point of the sale price will be paid to the NFT creator every time the NFT is sold or re-sold. Ex. If feNumerator = 3.5*10^2, royalty is 3.5%
   * @param encryptLogic - Select ether "base64" or "binary". Selection criteria: "base64" -> sutable for small data. "binary" -> sutable for large data.
   * @param uploadEncryptedFileCallback - Optional: the function for uploading encrypted data
   * @param uploadThumbnailCallback - Optional: the function for uploading thumbnail
   * @param uploadMetadataCallBack - Optional: the function for uploading metadata
   * @param subscriber - Optional: the subscriber for seeing progress
   * @returns
   */
  managedCreateToken = async (
    name: string,
    description: string,
    amount: number,
    plainFile: FileOrPath | FileOrPath[],
    thumbnailImage: FileOrPath,
    feeNumerator: number,
    encryptLogic: EncryptLogic = "base64",
    uploadEncryptedFileCallback?: UploadEncryptedFile,
    uploadThumbnailCallback?: UploadThumbnail,
    uploadMetadataCallBack?: UploadMetadata,
    subscriber?: ProgressSubscriber
  ) => {
    if (!this.signature) {
      throw "please sign first";
    }
    const { uploadContentType, uploadMetadataType, awsConfig, vwblNetworkUrl } = this.opts;
    // 1. mint token
    const documentId = utils.hexlify(utils.randomBytes(32));
    const tokenId = await this.nft.mintToken(vwblNetworkUrl, amount, feeNumerator, documentId);
    subscriber?.kickStep(StepStatus.MINT_TOKEN);

    // 2. create key in frontend
    const key = createRandomKey();
    subscriber?.kickStep(StepStatus.CREATE_KEY);

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
    subscriber?.kickStep(StepStatus.ENCRYPT_DATA);

    // 4. upload data
    console.log("upload data");

    const encryptedDataUrls = await Promise.all(
      plainFileArray.map(async (file) => {
        const plainFileBlob = file instanceof File ? file : new File([await fs.promises.readFile(file)], file);
        const filePath = file instanceof File ? file.name : file;
        const fileName: string = file instanceof File ? file.name : file.split("/").slice(-1)[0]; //ファイル名の取得だけのためにpathを使いたくなかった
        const encryptedContent =
          encryptLogic === "base64"
            ? encryptString(await toBase64FromFile(plainFileBlob), key)
            : isRunningOnBrowser()
            ? await encryptFile(plainFileBlob, key)
            : encryptStream(fs.createReadStream(filePath), key);
        return await uploadEncryptedFunction(fileName, encryptedContent, uuid, awsConfig);
      })
    );
    const thumbnailImageUrl = await uploadThumbnailFunction(thumbnailImage, uuid, awsConfig);
    subscriber?.kickStep(StepStatus.UPLOAD_CONTENT);

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
    subscriber?.kickStep(StepStatus.UPLOAD_METADATA);

    // 6. set key to vwbl-network
    console.log("set key");
    const chainId = await this.opts.ethersSigner.getChainId();
    await this.api.setKey(
      documentId,
      chainId,
      key,
      this.signature,
      await this._getAddressBySigner(this.opts.ethersSigner)
    );
    subscriber?.kickStep(StepStatus.SET_KEY);

    return tokenId;
  };

  /**
   * Create VWBLERC1155 NFT which metadata on IPFS.
   *
   * @remarks
   * The following happens: Minting NFT, Uploading encrypted data, Uploading metadata, Setting key to VWBL Network
   * metadata will be uploaded to IPFS.
   * You need to pass `uploadFileCallback` and `uploadMetadataCallBack` if you upload metadata to a storage other than Amazon S3.
   *
   * @param name - The NFT name
   * @param description - The NFT description
   * @param amount - The amount of erc1155 tokens to be minted
   * @param plainFile - The data that only NFT owner can view
   * @param thumbnailImage - The NFT image
   * @param feeNumerator - This basis point of the sale price will be paid to the NFT creator every time the NFT is sold or re-sold. Ex. If feNumerator = 3.5*10^2, royalty is 3.5%
   * @param encryptLogic - Select ether "base64" or "binary". Selection criteria: "base64" -> sutable for small data. "binary" -> sutable for large data.
   * @param uploadEncryptedFileCallback - Optional: the function for uploading encrypted data
   * @param uploadThumbnailCallback - Optional: the function for uploading thumbnail
   * @param uploadMetadataCallBack - Optional: the function for uploading metadata
   * @param subscriber - Optional: the subscriber for seeing progress
   * @returns
   */
  managedCreateTokenForIPFS = async (
    name: string,
    description: string,
    amount: number,
    plainFile: FileOrPath | FileOrPath[],
    thumbnailImage: FileOrPath,
    feeNumerator: number,
    encryptLogic: EncryptLogic = "base64",
    uploadEncryptedFileCallback: UploadEncryptedFileToIPFS = uploadEncryptedFileToIPFS,
    uploadThumbnailCallback: UploadThumbnailToIPFS = uploadThumbnailToIPFS,
    uploadMetadataCallBack: UploadMetadataToIPFS = uploadMetadataToIPFS,
    subscriber?: ProgressSubscriber
  ) => {
    if (!this.signature) {
      throw "please sign first";
    }
    const { ipfsConfig, vwblNetworkUrl } = this.opts;
    // 1. create key in frontend
    const key = createRandomKey();
    subscriber?.kickStep(StepStatus.CREATE_KEY);

    // 2. encrypt data
    console.log("encrypt data");
    const plainFileArray = [plainFile].flat();

    subscriber?.kickStep(StepStatus.ENCRYPT_DATA);

    // 3. upload data
    console.log("upload data");
    const encryptedDataUrls = await Promise.all(
      plainFileArray.map(async (file) => {
        const plainFileBlob = file instanceof File ? file : new File([await fs.promises.readFile(file)], file);
        const filePath = file instanceof File ? file.name : file;
        const encryptedContent =
          encryptLogic === "base64"
            ? encryptString(await toBase64FromFile(plainFileBlob), key)
            : isRunningOnBrowser()
            ? await encryptFile(plainFileBlob, key)
            : encryptStream(fs.createReadStream(filePath), key);
        return await uploadEncryptedFileCallback(encryptedContent, ipfsConfig);
      })
    );
    const thumbnailImageUrl = await uploadThumbnailCallback(thumbnailImage, ipfsConfig);
    subscriber?.kickStep(StepStatus.UPLOAD_CONTENT);

    // 4. upload metadata
    console.log("upload meta data");

    const mimeType = getMimeType(plainFileArray[0]);
    const metadataUrl = await uploadMetadataCallBack(
      name,
      description,
      thumbnailImageUrl,
      encryptedDataUrls,
      mimeType,
      encryptLogic,
      ipfsConfig
    );
    subscriber?.kickStep(StepStatus.UPLOAD_METADATA);
    // 5. mint token
    const documentId = utils.hexlify(utils.randomBytes(32));
    const tokenId = await this.nft.mintTokenForIPFS(metadataUrl, vwblNetworkUrl, amount, feeNumerator, documentId);
    subscriber?.kickStep(StepStatus.MINT_TOKEN);

    // 6. set key to vwbl-network
    console.log("set key");
    const chainId = await this.opts.ethersSigner.getChainId();
    await this.api.setKey(
      documentId,
      chainId,
      key,
      this.signature,
      await this._getAddressBySigner(this.opts.ethersSigner)
    );
    subscriber?.kickStep(StepStatus.SET_KEY);

    return tokenId;
  };

  /**
   * Mint new ERC1155 NFT
   *
   * @param amount - The amount of erc1155 tokens to be minted
   * @param feeNumerator - This basis point of the sale price will be paid to the NFT creator every time the NFT is sold or re-sold. Ex. If feNumerator = 3.5*10^2, royalty is 3.5%
   * @returns The ID of minted NFT
   */
  mintToken = async (amount: number, feeNumerator: number): Promise<number> => {
    const { vwblNetworkUrl } = this.opts;
    const documentId = utils.hexlify(utils.randomBytes(32));
    return await this.nft.mintToken(vwblNetworkUrl, amount, feeNumerator, documentId);
  };

  /**
   * Mint new ERC1155 NFT
   *
   * @param amount - The amount of erc1155 tokens to be minted
   * @param metadataUrl metadata url
   * @param feeNumerator - This basis point of the sale price will be paid to the NFT creator every time the NFT is sold or re-sold. Ex. If feNumerator = 3.5*10^2, royalty is 3.5%
   * @param maxPriorityFeePerGas - Optional: the maxPriorityFeePerGas field in EIP-1559
   * @param maxFeePerGas - Optional: the maxFeePerGas field in EIP-1559
   * @returns The ID of minted NFT
   */
  mintTokenForIPFS = async (
    amount: number,
    metadataUrl: string,
    feeNumerator: number,
    gasSettings?: GasSettings
  ): Promise<number> => {
    const { vwblNetworkUrl } = this.opts;
    const documentId = utils.hexlify(utils.randomBytes(32));
    return await this.nft.mintTokenForIPFS(metadataUrl, vwblNetworkUrl, amount, feeNumerator, documentId, gasSettings);
  };

  /**
   * Transfer NFT
   *
   * @param to - The address that NFT will be transferred
   * @param tokenId - The ID of NFT
   * @param amount - The amount of erc1155 tokens to be transferred
   */
  safeTransfer = async (to: string, tokenId: number, amount: number, data = "0x00"): Promise<void> => {
    return await this.nft.safeTransfer(to, tokenId, amount, data);
  };

  /**
   * Burn NFT
   *
   * @param owner - The address of nft owner
   * @param tokenId - The ID of NFT
   * @param amount - The amount of erc1155 tokens to be burnt
   */
  burn = async (owner: string, tokenId: number, amount: number): Promise<void> => {
    return await this.nft.burn(owner, tokenId, amount);
  };

  /**
   * Get balance of nft
   *
   * @param owner - The address of nft owner
   * @param tokenId - The ID of NFT
   */
  balanceOf = async (owner: string, tokenId: number): Promise<number> => {
    return await this.nft.balanceOf(owner, tokenId);
  };

  getOwner = async (tokenId: number) => {
    return await this.nft.getOwner(tokenId);
  };

  /**
   * Set key to VWBL Network
   *
   * @param tokenId - The ID of NFT
   * @param key - The key generated by {@link VWBL.createKey}
   * @param hasNonce
   * @param autoMigration
   *
   */
  setKey = async (tokenId: number, key: string, hasNonce?: boolean, autoMigration?: boolean): Promise<void> => {
    const { documentId } = await this.nft.getTokenInfo(tokenId);
    const chainId = await this.opts.ethersSigner.getChainId();
    return await this._setKey(
      documentId,
      chainId,
      key,
      await this._getAddressBySigner(this.opts.ethersSigner),
      hasNonce,
      autoMigration
    );
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
    const chainId = await this.opts.ethersSigner.getChainId();
    const decryptKey = await this.api.getKey(
      documentId,
      chainId,
      this.signature,
      await this._getAddressBySigner(this.opts.ethersSigner)
    );
    const encryptedDataUrls = metadata.encrypted_data;

    const encryptLogic = metadata.encrypt_logic ?? "base64";
    const ownDataArray = await Promise.all(
      encryptedDataUrls.map(async (encryptedDataUrl) => {
        const encryptedData = (
          await axios.get(encryptedDataUrl, {
            responseType: encryptLogic === "base64" ? "text" : isRunningOnBrowser() ? "arraybuffer" : "stream",
          })
        ).data;
        return encryptLogic === "base64"
          ? decryptString(encryptedData, decryptKey)
          : isRunningOnBrowser()
          ? await decryptFile(encryptedData, decryptKey)
          : decryptStream(encryptedData, decryptKey);
      })
    );
    const ownFiles = ownDataArray.filter((ownData): ownData is ArrayBuffer => typeof ownData !== "string");
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
}
