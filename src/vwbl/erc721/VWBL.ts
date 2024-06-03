import axios from "axios";
import { utils } from "ethers";
import * as fs from "fs";

import { uploadEncryptedFile, uploadMetadata, uploadThumbnail } from "../../storage/aws";
import { uploadEncryptedFileToIPFS, uploadMetadataToIPFS, uploadThumbnailToIPFS } from "../../storage/ipfs";
import {
  createRandomKey,
  decryptFile,
  decryptStream,
  decryptString,
  encryptFile,
  encryptStream,
  encryptString,
  getMimeType,
  toBase64FromFile,
} from "../../util";
import { isRunningOnBrowser } from "../../util/envUtil";
import { VWBLBase } from "../base";
import { VWBLNFT, VWBLNFTEthers } from "../blockchain";
import { ExtractMetadata, Metadata, PlainMetadata } from "../metadata";
import {
  ConstructorProps,
  EncryptLogic,
  EthersConstructorProps,
  FileOrPath,
  GasSettings,
  GrantViewPermission,
  ManagedCreateToken,
  ManagedCreateTokenForIPFS,
  MintToken,
  MintTokenForIPFS,
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
  VWBLEthersOption,
  VWBLOption,
} from "../types";
import { VWBLViewer } from "../viewer";

export class VWBL extends VWBLBase {
  public opts: VWBLOption | VWBLEthersOption;
  public nft: VWBLNFT | VWBLNFTEthers;
  public viewer?: VWBLViewer;

  constructor(props: ConstructorProps | EthersConstructorProps) {
    super(props);
    this.opts = props;
    this.nft =
      "web3" in props
        ? new VWBLNFT(props.web3, props.contractAddress, props.uploadMetadataType === UploadMetadataType.IPFS)
        : new VWBLNFTEthers(
            props.contractAddress,
            props.uploadMetadataType === UploadMetadataType.IPFS,
            props.ethersProvider,
            props.ethersSigner
          );
    if (props.dataCollectorAddress) {
      this.viewer =
        "web3" in props
          ? new VWBLViewer({
              provider: props.web3,
              dataCollectorAddress: props.dataCollectorAddress,
            })
          : new VWBLViewer({
              provider: props.ethersProvider,
              dataCollectorAddress: props.dataCollectorAddress,
            });
    }
  }

  /**
   * Sign to VWBL
   *
   * @remarks
   * You need to call this method before you send a transaction（eg. mint NFT, decrypt NFT Data）
   * @param targetContract - Optional: the contract to operate on. (default: this.nft)
   */
  sign = async (targetContract?: string) => {
    "web3" in this.opts
      ? await this._sign(this.opts.web3, targetContract)
      : await this._sign(this.opts.ethersSigner, targetContract);
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
   * @param feeNumerator - This basis point of the sale price will be paid to the NFT creator every time the NFT is sold or re-sold. Ex. If feNumerator = 3.5*10^2, royalty is 3.5%
   * @param encryptLogic - Select ether "base64" or "binary". Selection criteria: "base64" -> sutable for small data. "binary" -> sutable for large data.
   * @param uploadEncryptedFileCallback - Optional: the function for uploading encrypted data
   * @param uploadThumbnailCallback - Optional: the function for uploading thumbnail
   * @param uploadMetadataCallBack - Optional: the function for uploading metadata
   * @param subscriber - Optional: the subscriber for seeing progress
   * @param gasSettings - Optional: the object whose keys are maxPriorityFeePerGas, maxFeePerGas and gasPrice
   * @returns
   */
  managedCreateToken: ManagedCreateToken = async (
    name: string,
    description: string,
    plainFile: FileOrPath | FileOrPath[],
    thumbnailImage: FileOrPath,
    feeNumerator: number,
    encryptLogic: EncryptLogic = "base64",
    uploadEncryptedFileCallback?: UploadEncryptedFile,
    uploadThumbnailCallback?: UploadThumbnail,
    uploadMetadataCallBack?: UploadMetadata,
    subscriber?: ProgressSubscriber,
    gasSettings?: GasSettings
  ) => {
    if (!this.signature) {
      throw "please sign first";
    }
    const { uploadContentType, uploadMetadataType, awsConfig, vwblNetworkUrl } = this.opts;
    // 1. mint token
    const documentId = utils.hexlify(utils.randomBytes(32));
    const tokenId = await this.nft.mintToken({
      decryptUrl: vwblNetworkUrl,
      feeNumerator,
      documentId,
      gasSettings,
    });
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
    const mimeType = getMimeType(plainFileArray[0]) || "";
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
    const chainId =
      "web3" in this.opts ? Number(await this.opts.web3.eth.getChainId()) : await this.opts.ethersSigner.getChainId();
    const signerAddress =
      "web3" in this.opts
        ? await this._getAddressBySigner(this.opts.web3)
        : await this._getAddressBySigner(this.opts.ethersSigner);
    await this.api.setKey(documentId, chainId, key, this.signature, signerAddress);
    subscriber?.kickStep(StepStatus.SET_KEY);

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
   * @param feeNumerator - This basis point of the sale price will be paid to the NFT creator every time the NFT is sold or re-sold. Ex. If feNumerator = 3.5*10^2, royalty is 3.5%
   * @param encryptLogic - Select ether "base64" or "binary". Selection criteria: "base64" -> sutable for small data. "binary" -> sutable for large data.
   * @param uploadEncryptedFileCallback - Optional: the function for uploading encrypted data
   * @param uploadThumbnailCallback - Optional: the function for uploading thumbnail
   * @param uploadMetadataCallBack - Optional: the function for uploading metadata
   * @param subscriber - Optional: the subscriber for seeing progress
   * @param gasSettings - Optional: the object whose keys are maxPriorityFeePerGas, maxFeePerGas and gasPrice
   * @returns
   */
  managedCreateTokenForIPFS: ManagedCreateTokenForIPFS = async (
    name: string,
    description: string,
    plainFile: FileOrPath | FileOrPath[],
    thumbnailImage: FileOrPath,
    feeNumerator: number,
    encryptLogic: EncryptLogic = "base64",
    uploadEncryptedFileCallback: UploadEncryptedFileToIPFS = uploadEncryptedFileToIPFS,
    uploadThumbnailCallback: UploadThumbnailToIPFS = uploadThumbnailToIPFS,
    uploadMetadataCallBack: UploadMetadataToIPFS = uploadMetadataToIPFS,
    subscriber?: ProgressSubscriber,
    gasSettings?: GasSettings
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
        const fileName: string = file instanceof File ? file.name : file.split("/").slice(-1)[0];
        const encryptedContent =
          encryptLogic === "base64"
            ? encryptString(await toBase64FromFile(plainFileBlob), key)
            : await encryptFile(plainFileBlob, key);

        // stringまたはUint8ArrayからBufferへの変換
        const bufferContent =
          typeof encryptedContent === "string" ? Buffer.from(encryptedContent, "utf-8") : Buffer.from(encryptedContent);

        return await uploadEncryptedFileCallback(bufferContent, ipfsConfig);
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
    const tokenId = await this.nft.mintTokenForIPFS({
      metadataUrl: metadataUrl,
      decryptUrl: vwblNetworkUrl,
      feeNumerator,
      documentId,
      gasSettings,
    });
    subscriber?.kickStep(StepStatus.MINT_TOKEN);

    // 6. set key to vwbl-network
    console.log("set key");
    const chainId =
      "web3" in this.opts ? Number(await this.opts.web3.eth.getChainId()) : await this.opts.ethersSigner.getChainId();
    const signerAddress =
      "web3" in this.opts
        ? await this._getAddressBySigner(this.opts.web3)
        : await this._getAddressBySigner(this.opts.ethersSigner);
    await this.api.setKey(documentId, chainId, key, this.signature, signerAddress);
    subscriber?.kickStep(StepStatus.SET_KEY);

    return tokenId;
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
    const chainId =
      "web3" in this.opts ? Number(await this.opts.web3.eth.getChainId()) : await this.opts.ethersSigner.getChainId();
    const signerAddress =
      "web3" in this.opts
        ? await this._getAddressBySigner(this.opts.web3)
        : await this._getAddressBySigner(this.opts.ethersSigner);
    return await this._setKey(documentId, chainId, key, signerAddress, hasNonce, autoMigration);
  };

  getKey = async (tokenId: number): Promise<string> => {
    const { documentId } = await this.nft.getTokenInfo(tokenId);
    const chainId =
      "web3" in this.opts ? Number(await this.opts.web3.eth.getChainId()) : await this.opts.ethersSigner.getChainId();
    const signerAddress =
      "web3" in this.opts
        ? await this._getAddressBySigner(this.opts.web3)
        : await this._getAddressBySigner(this.opts.ethersSigner);
    return await this._getKey(documentId, chainId, signerAddress);
  };

  /**
   * Mint new NFT
   *
   * @param feeNumerator - This basis point of the sale price will be paid to the NFT creator every time the NFT is sold or re-sold. Ex. If feNumerator = 3.5*10^2, royalty is 3.5%
   * @param maxPriorityFeePerGas - Optional: the maxPriorityFeePerGas field in EIP-1559
   * @param maxFeePerGas - Optional: the maxFeePerGas field in EIP-1559
   * @returns The ID of minted NFT
   */
  mintToken: MintToken = async (feeNumerator: number, gasSettings?: GasSettings): Promise<number> => {
    const { vwblNetworkUrl } = this.opts;
    const documentId = utils.hexlify(utils.randomBytes(32));
    return await this.nft.mintToken({
      decryptUrl: vwblNetworkUrl,
      feeNumerator,
      documentId,
      gasSettings,
    });
  };

  /**
   * Mint new NFT
   *
   * @param metadataUrl metadata url
   * @param feeNumerator - This basis point of the sale price will be paid to the NFT creator every time the NFT is sold or re-sold. Ex. If feNumerator = 3.5*10^2, royalty is 3.5%
   * @param maxPriorityFeePerGas - Optional: the maxPriorityFeePerGas field in EIP-1559
   * @param maxFeePerGas - Optional: the maxFeePerGas field in EIP-1559
   * @returns The ID of minted NFT
   */
  mintTokenForIPFS: MintTokenForIPFS = async (
    metadataUrl: string,
    feeNumerator: number,
    gasSettings?: GasSettings
  ): Promise<number> => {
    const { vwblNetworkUrl } = this.opts;
    const documentId = utils.hexlify(utils.randomBytes(32));
    return await this.nft.mintTokenForIPFS({
      metadataUrl,
      decryptUrl: vwblNetworkUrl,
      feeNumerator,
      documentId,
      gasSettings,
    });
  };

  /**
   * Approves `operator` to transfer the given `tokenId`
   *
   * @param operator - The wallet address
   * @param tokenId - The ID of NFT
   * @param gasSettings - Optional: the object whose keys are maxPriorityFeePerGas, maxFeePerGas and gasPrice
   */
  approve = async (operator: string, tokenId: number, gasSettings?: GasSettings): Promise<void> => {
    await this.nft.approve(operator, tokenId, gasSettings);
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
   * @param gasSettings - Optional: the object whose keys are maxPriorityFeePerGas, maxFeePerGas and gasPrice
   */
  setApprovalForAll = async (operator: string, gasSettings?: GasSettings): Promise<void> => {
    await this.nft.setApprovalForAll(operator, gasSettings);
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
   * Transfer NFT
   *
   * @param to - The address that NFT will be transfered
   * @param tokenId - The ID of NFT
   * @param gasSettings - Optional: the object whose keys are maxPriorityFeePerGas, maxFeePerGas and gasPrice
   */
  safeTransfer = async (to: string, tokenId: number, gasSettings?: GasSettings): Promise<void> => {
    await this.nft.safeTransfer(to, tokenId, gasSettings);
  };

  /**
   * Grant view permission
   *
   * @param tokenId - The ID of NFT
   * @param grantee - The wallet address of a grantee
   * @param gasSettings - Optional: the object whose keys are maxPriorityFeePerGas, maxFeePerGas and gasPrice
   */
  grantViewPermission: GrantViewPermission = async (
    tokenId: number,
    grantee: string,
    gasSettings?: GasSettings
  ): Promise<void> => {
    await this.nft.grantViewPermission({
      tokenId,
      grantee,
      gasSettings,
    });
  };

  /**
   * Revoke view permission
   *
   * @param tokenId - The ID of NFT
   * @param revoker - The wallet address of revoker
   * @param gasSettings - Optional: the object whose keys are maxPriorityFeePerGas, maxFeePerGas and gasPrice
   */
  revokeViewPermission = async (tokenId: number, revoker: string, gasSettings?: GasSettings): Promise<void> => {
    await this.nft.revokeViewPermission(tokenId, revoker, gasSettings);
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
   */
  uploadMetadataToIPFS = async (
    name: string,
    description: string,
    thumbnailImageUrl: string,
    encryptedDataUrls: string[],
    mimeType: string,
    encryptLogic: EncryptLogic,
    uploadMetadataCallBack?: UploadMetadataToIPFS
  ): Promise<string> => {
    const { uploadMetadataType, ipfsConfig } = this.opts;
    const uploadMetadataFunction = uploadMetadataCallBack ? uploadMetadataCallBack : uploadMetadataToIPFS;

    if (!uploadMetadataFunction) {
      throw new Error("please specify upload metadata type or give callback");
    }
    const metadataUrl = await uploadMetadataFunction(
      name,
      description,
      thumbnailImageUrl,
      encryptedDataUrls,
      mimeType,
      encryptLogic,
      ipfsConfig
    );
    return metadataUrl;
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
    const canViewData =
      (await this.nft.isOwnerOf(tokenId)) ||
      (await this.nft.isMinterOf(tokenId)) ||
      (await this.nft.isGranteeOf(tokenId));
    const owner = await this.nft.getOwner(tokenId);
    const metadata = canViewData ? await this.extractMetadata(tokenId) : await this.getMetadata(tokenId);
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
      mimeType: metadata.mime_type,
      encryptLogic: metadata.encrypt_logic,
      ...metadata,
    };
  };

  /**
   * Get NFT metadata from given `tokenId`
   *
   * @remarks
   * This method should be called by NFT owner.
   *
   * @param tokenId The ID of NFT
   * @param contractAddress Optional: The contractAddress of any VWBL Token(ERC721 or ERC1155).
   * @returns Token metadata
   */
  extractMetadata = async (tokenId: number, contractAddress?: string): Promise<ExtractMetadata | undefined> => {
    if (!this.signature) {
      throw "please sign first";
    }
    if (contractAddress && !this.viewer) {
      throw "please set dataCollectorAddress to constructor";
    }
    const metadataUrl =
      contractAddress && this.viewer
        ? await this.viewer.getMetadataUrl(contractAddress, tokenId)
        : await this.nft.getMetadataUrl(tokenId);
    const metadata: PlainMetadata = (await axios.get(metadataUrl).catch(() => undefined))?.data;
    // delete token if metadata is not found
    if (!metadata) {
      return undefined;
    }
    const documentId =
      contractAddress && this.viewer
        ? await this.viewer.getDocumentId(contractAddress, tokenId)
        : (await this.nft.getTokenInfo(tokenId)).documentId;
    const chainId =
      "web3" in this.opts ? Number(await this.opts.web3.eth.getChainId()) : await this.opts.ethersSigner.getChainId();
    const signerAddress =
      "web3" in this.opts
        ? await this._getAddressBySigner(this.opts.web3)
        : await this._getAddressBySigner(this.opts.ethersSigner);
    const decryptKey = await this.api.getKey(documentId, chainId, this.signature, signerAddress);
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
      mimeType: metadata.mime_type,
      encryptLogic: metadata.encrypt_logic,
      ...metadata,
      ownDataBase64,
      ownFiles,
      fileName,
    };
  };
}
