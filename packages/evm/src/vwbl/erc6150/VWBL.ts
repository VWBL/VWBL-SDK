import { utils } from "ethers";
import * as fs from "fs";

import {
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
  encryptFile,
  encryptStream,
  encryptString,
  getMimeType,
  toBase64FromFile,
  isRunningOnBrowser
} from "vwbl-core";
import { VWBLERC6150Ethers, VWBLERC6150Web3 } from "../blockchain/";
import { VWBL } from "../erc721/VWBL";
import {
  ConstructorProps,
  EthersConstructorProps,
  GasSettings,
  GrantViewPermission,
  ManagedCreateToken,
  ManagedCreateTokenForIPFS,
  MintToken,
  MintTokenForIPFS,
} from "../types";

export class VWBLERC6150 extends VWBL {
  public erc6150: VWBLERC6150Web3 | VWBLERC6150Ethers;

  constructor(props: ConstructorProps | EthersConstructorProps) {
    super(props);
    this.erc6150 =
      "web3" in props
        ? new VWBLERC6150Web3(props.web3, props.contractAddress, props.uploadMetadataType === UploadMetadataType.IPFS)
        : new VWBLERC6150Ethers(
            props.contractAddress,
            props.uploadMetadataType === UploadMetadataType.IPFS,
            props.ethersProvider,
            props.ethersSigner
          );
  }

  /**
   * Create VWBL ERC6150
   *
   * @remarks
   * The following happens: Minting ERC6150, Uploading encrypted data, Uploading metadata, Setting key to VWBL Network
   * By default, metadata will be uploaded to Amazon S3.
   * You need to pass `uploadFileCallback` and `uploadMetadataCallBack` if you upload metadata to a storage other than Amazon S3.
   *
   * @param name - The ERC6150 name
   * @param description - The ERC6150 description
   * @param plainFile - The data that only ERC6150 owner can view
   * @param thumbnailImage - The ERC6150 image
   * @param feeNumerator - This basis point of the sale price will be paid to the ERC6150 creator every time the ERC6150 is sold or re-sold. Ex. If feNumerator = 3.5*10^2, royalty is 3.5%
   * @param encryptLogic - Select ether "base64" or "binary". Selection criteria: "base64" -> sutable for small data. "binary" -> sutable for large data.
   * @param uploadEncryptedFileCallback - Optional: the function for uploading encrypted data
   * @param uploadThumbnailCallback - Optional: the function for uploading thumbnail
   * @param uploadMetadataCallBack - Optional: the function for uploading metadata
   * @param subscriber - Optional: the subscriber for seeing progress
   * @param gasSettings - Optional: the object whose keys are maxPriorityFeePerGas, maxFeePerGas and gasPrice
   * @param parentId - Optional: The Id of parent token. If parentId param is undefined or 0, mint as root token(parentId=0)
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
    gasSettings?: GasSettings,
    parentId?: number
  ) => {
    if (!this.signature) {
      throw "please sign first";
    }
    const { uploadContentType, uploadMetadataType, awsConfig, vwblNetworkUrl } = this.opts;
    // 1. mint token
    const documentId = utils.hexlify(utils.randomBytes(32));
    const _parentId = typeof parentId !== "undefined" ? parentId : 0;
    const tokenId = await this.erc6150.mintToken({
      decryptUrl: vwblNetworkUrl,
      feeNumerator,
      documentId,
      gasSettings,
      parentId: _parentId,
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
   * Create VWBL ERC6150 which metadata on IPFS.
   *
   * @remarks
   * The following happens: Minting ERC6150, Uploading encrypted data, Uploading metadata, Setting key to VWBL Network
   * metadata will be uploaded to IPFS.
   * You need to pass `uploadFileCallback` and `uploadMetadataCallBack` if you upload metadata to a storage other than Amazon S3.
   *
   * @param name - The ERC6150 name
   * @param description - The ERC6150 description
   * @param plainFile - The data that only ERC6150 owner can view
   * @param thumbnailImage - The ERC6150 image
   * @param feeNumerator - This basis point of the sale price will be paid to the ERC6150 creator every time the ERC6150 is sold or re-sold. Ex. If feNumerator = 3.5*10^2, royalty is 3.5%
   * @param encryptLogic - Select ether "base64" or "binary". Selection criteria: "base64" -> sutable for small data. "binary" -> sutable for large data.
   * @param uploadEncryptedFileCallback - Optional: the function for uploading encrypted data
   * @param uploadThumbnailCallback - Optional: the function for uploading thumbnail
   * @param uploadMetadataCallBack - Optional: the function for uploading metadata
   * @param subscriber - Optional: the subscriber for seeing progress
   * @param gasSettings - Optional: the object whose keys are maxPriorityFeePerGas, maxFeePerGas and gasPrice
   * @param parentId - Optional: The Id of parent token. If parentId param is undefined or 0, mint as root token(parentId=0)
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
    gasSettings?: GasSettings,
    parentId?: number
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
        const encryptedContent =
          encryptLogic === "base64"
            ? encryptString(await toBase64FromFile(plainFileBlob), key)
            : await encryptFile(plainFileBlob, key);
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
    const _parentId = typeof parentId !== "undefined" ? parentId : 0;
    const tokenId = await this.erc6150.mintTokenForIPFS({
      metadataUrl: metadataUrl as string,
      decryptUrl: vwblNetworkUrl,
      feeNumerator,
      documentId,
      gasSettings,
      parentId: _parentId,
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
   * Mint new ERC6150
   *
   * @param feeNumerator - This basis point of the sale price will be paid to the ERC6150 creator every time the ERC6150 is sold or re-sold. Ex. If feNumerator = 3.5*10^2, royalty is 3.5%
   * @param maxPriorityFeePerGas - Optional: the maxPriorityFeePerGas field in EIP-1559
   * @param maxFeePerGas - Optional: the maxFeePerGas field in EIP-1559
   * @param parentId - Optional: The Id of parent token. If parentId param is undefined or 0, mint as root token(parentId=0)
   * @returns The ID of minted ERC6150
   */
  mintToken: MintToken = async (
    feeNumerator: number,
    gasSettings?: GasSettings,
    parentId?: number
  ): Promise<number> => {
    const { vwblNetworkUrl } = this.opts;
    const documentId = utils.hexlify(utils.randomBytes(32));
    const _parentId = typeof parentId !== "undefined" ? parentId : 0;
    return await this.erc6150.mintToken({
      decryptUrl: vwblNetworkUrl,
      feeNumerator,
      documentId,
      gasSettings,
      parentId: _parentId,
    });
  };

  /**
   * Mint new ERC6150
   *
   * @param metadataUrl metadata url
   * @param feeNumerator - This basis point of the sale price will be paid to the ERC6150 creator every time the ERC6150 is sold or re-sold. Ex. If feNumerator = 3.5*10^2, royalty is 3.5%
   * @param maxPriorityFeePerGas - Optional: the maxPriorityFeePerGas field in EIP-1559
   * @param maxFeePerGas - Optional: the maxFeePerGas field in EIP-1559
   * @param parentId - Optional: The Id of parent token. If parentId param is undefined or 0, mint as root token(parentId=0)
   * @returns The ID of minted ERC6150
   */
  mintTokenForIPFS: MintTokenForIPFS = async (
    metadataUrl: string,
    feeNumerator: number,
    gasSettings?: GasSettings,
    parentId?: number
  ): Promise<number> => {
    const { vwblNetworkUrl } = this.opts;
    const documentId = utils.hexlify(utils.randomBytes(32));
    const _parentId = typeof parentId !== "undefined" ? parentId : 0;
    return await this.erc6150.mintTokenForIPFS({
      metadataUrl,
      decryptUrl: vwblNetworkUrl,
      feeNumerator,
      documentId,
      gasSettings,
      parentId: _parentId,
    });
  };

  /**
   * Grant view permission
   *
   * @param tokenId - The ID of ERC6150
   * @param grantee - The wallet address of a grantee
   * @param gasSettings - Optional: the object whose keys are maxPriorityFeePerGas, maxFeePerGas and gasPrice
   * @param toDir - Optional: A boolean indicating whether to grant view permission directly or single ERC6150 token.
   *                          If toDir param is undefined or false, grant view permission to single ERC6150 token.
   *
   */
  grantViewPermission: GrantViewPermission = async (
    tokenId: number,
    grantee: string,
    gasSettings?: GasSettings,
    toDir?: boolean
  ): Promise<void> => {
    const _toDir = typeof toDir !== "undefined" ? toDir : false;
    await this.erc6150.grantViewPermission({
      tokenId,
      grantee,
      gasSettings,
      toDir: _toDir,
    });
  };

  /**
   * Revoke view permission to directory (ERC6150 under parent token)
   *
   * @param tokenId - The ID of ERC6150
   * @param revoker - The wallet address of a revoker
   * @param gasSettings - Optional: the object whose keys are maxPriorityFeePerGas, maxFeePerGas and gasPrice
   */
  revokeDirPermission = async (tokenId: number, revoker: string, gasSettings?: GasSettings) => {
    await this.erc6150.revokeDirPermission(tokenId, revoker, gasSettings);
  };
}
