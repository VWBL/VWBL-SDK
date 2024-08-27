import {
  uploadEncryptedFile,
  uploadMetadata,
  uploadThumbnail,
  createRandomKey,
  encryptFile,
  encryptStream,
  encryptString,
  getMimeType,
  toBase64FromFile,
  EncryptLogic,
  FileOrPath,
  UploadContentType,
  UploadEncryptedFile,
  UploadMetadata,
  UploadMetadataType,
  UploadThumbnail,
  uploadEncryptedFileToIPFS,
  UploadEncryptedFileToIPFS,
  UploadThumbnailToIPFS,
  UploadMetadataToIPFS,
  uploadThumbnailToIPFS,
  uploadMetadataToIPFS,
  isRunningOnBrowser,
  PlainMetadata,
  decryptString,
  decryptFile,
  decryptStream,
} from "vwbl-core";
import * as fs from "fs";
import {
  SubmittableTransaction,
  convertHexToString,
  convertStringToHex,
  deriveAddress,
} from "xrpl";

import { XRPLApi } from "../api";
import { VWBLXRPLProtocol } from "../blockchain/VWBLProtocol";
import { XrplConstructorProps } from "../types";
import axios from "axios";

export class VWBLXRPL {
  protected api: XRPLApi;
  public nft: VWBLXRPLProtocol;
  public opts: XrplConstructorProps;
  private keyMap = new Map<string, string>();
  private xrplChainId: number;

  constructor(props: XrplConstructorProps) {
    this.api = new XRPLApi(props.vwblNetworkUrl);
    this.nft = new VWBLXRPLProtocol(props.xrplChainId);
    this.opts = props;
    this.xrplChainId = props.xrplChainId;
  }

  generateMintTokenTx(
    walletAddress: string,
    transferRoyalty: number,
    isTransferable: boolean,
    isBurnable: boolean
  ) {
    const TagId = 11451419;
    let flags = 0;
    if (isTransferable) flags += 8;
    if (isBurnable) flags += 1;

    const mintTxJson: SubmittableTransaction = {
      TransactionType: "NFTokenMint",
      Account: walletAddress,
      NFTokenTaxon: TagId,
      SourceTag: TagId,
      TransferFee: transferRoyalty,
      Flags: flags,
    };

    return mintTxJson;
  }

  generateMintTokenTxForIPFS = async (
    walletAddress: string,
    transferRoyalty: number,
    isTransferable: boolean,
    isBurnable: boolean,
    name: string,
    description: string,
    plainFile: FileOrPath | FileOrPath[],
    thumbnailImage: FileOrPath,
    encryptLogic: EncryptLogic = "base64",
    uploadEncryptedFileCallback: UploadEncryptedFileToIPFS = uploadEncryptedFileToIPFS,
    uploadThumbnailCallback: UploadThumbnailToIPFS = uploadThumbnailToIPFS,
    uploadMetadataCallBack: UploadMetadataToIPFS = uploadMetadataToIPFS
  ) => {
    const { ipfsConfig } = this.opts;
    const key = createRandomKey();

    const plainFileArray = [plainFile].flat();
    // encrypt data
    const encryptedDataUrls = await Promise.all(
      plainFileArray.map(async (file) => {
        const plainFileBlob =
          file instanceof File
            ? file
            : new File([await fs.promises.readFile(file)], file);
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
    // upload metadata
    const thumbnailImageUrl = await uploadThumbnailCallback(
      thumbnailImage,
      ipfsConfig
    );
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
    this.keyMap.set(metadataUrl, key);

    const TagId = 11451419;
    let flags = 0;
    if (isTransferable) flags += 8;
    if (isBurnable) flags += 1;

    const mintTxJson: SubmittableTransaction = {
      TransactionType: "NFTokenMint",
      Account: walletAddress,
      NFTokenTaxon: TagId,
      SourceTag: TagId,
      TransferFee: transferRoyalty,
      Flags: flags,
      URI: convertStringToHex(metadataUrl),
    };

    return { mintTxJson, metadataUrl };
  };

  mintAndGeneratePaymentTx = async (
    signedMintTx: string,
    walletAddress: string
  ) => {
    const tokenId = await this.nft.mint(signedMintTx);
    const { mintFee, destination } = await this.api.getXrplPaymentInfo(
      tokenId,
      this.xrplChainId,
      walletAddress
    );
    const paymentTxJson = await this.nft.generatePaymentTx(
      tokenId,
      walletAddress,
      mintFee,
      destination
    );

    return { tokenId, paymentTxJson };
  };

  mintAndGeneratePaymentTxForIPFS = async (
    signedMintTx: string,
    metadataUrl: string,
    walletAddress: string
  ) => {
    const tokenId = await this.nft.mint(signedMintTx);
    const key = this.keyMap.get(metadataUrl);
    if (!key) {
      throw new Error(
        "metadataUrl is not registered, run 'generateMintTokenTxForIPFS' first"
      );
    }

    this.keyMap.delete(metadataUrl);
    this.keyMap.set(tokenId, key);

    const { mintFee, destination } = await this.api.getXrplPaymentInfo(
      tokenId,
      this.xrplChainId,
      walletAddress
    );
    if (mintFee === "0") {
      const emptyTxObject = this.nft.generateEmptyTx(walletAddress);

      return { tokenId, emptyTxObject };
    }

    const paymentTxJson = await this.nft.generatePaymentTx(
      tokenId,
      walletAddress,
      mintFee,
      destination
    );

    return { tokenId, paymentTxJson };
  };

  payMintFee = async (walletAddress: string, signedPaymentTx: string) => {
    const response = await this.nft.payMintFee(signedPaymentTx);
    if (!response) {
      throw new Error("failed payment tx");
    }
    const paymentTxHash = response.paymentTxHash;
    const tokenId = response.tokenId;
    // generate empty tx object
    const emptyTxObject = this.nft.generateEmptyTx(walletAddress);

    return { paymentTxHash, tokenId, emptyTxObject };
  };

  payMintFeeForIPFS = async (
    walletAddress: string,
    signedPaymentTx: string
  ) => {
    const response = await this.nft.payMintFee(signedPaymentTx);
    if (!response) {
      throw new Error("failed payment tx");
    }
    const paymentTxHash = response.paymentTxHash;
    const tokenId = response.tokenId;
    // generate empty tx object
    const emptyTxObject = this.generateTxForSigning(walletAddress);

    return { paymentTxHash, tokenId, emptyTxObject };
  };

  createManagedToken = async (
    tokenId: string,
    signedEmptyTx: string,
    signerPublicKey: string,
    name: string,
    description: string,
    plainFile: FileOrPath | FileOrPath[],
    thumbnailImage: FileOrPath,
    encryptLogic: EncryptLogic = "base64",
    signedPaymentTxHash?: string,
    uploadEncryptedFileCallback?: UploadEncryptedFile,
    uploadThumbnailCallback?: UploadThumbnail,
    uploadMetadataCallBack?: UploadMetadata
  ) => {
    const { uploadContentType, uploadMetadataType, awsConfig } = this.opts;
    const key = createRandomKey();

    const plainFileArray = [plainFile].flat();
    const uuid = createRandomKey();
    const uploadEncryptedFunction =
      uploadContentType === UploadContentType.S3
        ? uploadEncryptedFile
        : uploadEncryptedFileCallback;
    const uploadThumbnailFunction =
      uploadContentType === UploadContentType.S3
        ? uploadThumbnail
        : uploadThumbnailCallback;
    if (!uploadEncryptedFunction || !uploadThumbnailFunction) {
      throw new Error("please specify upload file type or give callback");
    }
    const mimeType = getMimeType(plainFileArray[0]);

    const isRunningOnBrowser = typeof window !== "undefined";
    const encryptedDataUrls = await Promise.all(
      plainFileArray.map(async (file) => {
        const plainFileBlob =
          file instanceof File
            ? file
            : new File([await fs.promises.readFile(file)], file);
        const filePath = file instanceof File ? file.name : file;
        const fileName: string =
          file instanceof File ? file.name : file.split("/").slice(-1)[0]; //ファイル名の取得だけのためにpathを使いたくなかった
        const encryptedContent =
          encryptLogic === "base64"
            ? encryptString(await toBase64FromFile(plainFileBlob), key)
            : isRunningOnBrowser
            ? await encryptFile(plainFileBlob, key)
            : encryptStream(fs.createReadStream(filePath), key);
        return await uploadEncryptedFunction(
          fileName,
          encryptedContent,
          uuid,
          awsConfig
        );
      })
    );
    const thumbnailImageUrl = await uploadThumbnailFunction(
      thumbnailImage,
      uuid,
      awsConfig
    );
    // upload metadata
    const uploadMetadataFunction =
      uploadMetadataType === UploadMetadataType.S3
        ? uploadMetadata
        : uploadMetadataCallBack;
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
    // set key
    await this.api.setKey(
      tokenId,
      this.opts.xrplChainId,
      key,
      signedEmptyTx,
      signerPublicKey,
      signedPaymentTxHash
    );

    return tokenId;
  };

  createManagedTokenForIPFS = async (
    tokenId: string,
    signedEmptyTx: string,
    paymentTxHash: string,
    signerPublicKey: string
  ) => {
    const key = this.keyMap.get(tokenId);
    if (!key) {
      throw new Error(
        "invalid key, run 'mintAndGeneratePaymentTxForIPFS' to set key"
      );
    }

    await this.api.setKey(
      tokenId,
      this.opts.xrplChainId,
      key,
      signedEmptyTx,
      paymentTxHash,
      signerPublicKey
    );

    return tokenId;
  };

  extractMetadata = async (
    tokenId: string,
    signedEmptyTx: string,
    signerPublicKey: string
  ) => {
    const walletAddress = deriveAddress(signerPublicKey);
    // fetch metadata
    const accountNFT = await this.nft.fetchNFTInfo(walletAddress, tokenId);
    if (!accountNFT.URI) {
      throw new Error(`metadata URI is not defined on NFT: ${tokenId}`);
    }
    const metadataUrl = convertHexToString(accountNFT.URI);
    const metadata: PlainMetadata = (
      await axios.get(metadataUrl).catch(() => undefined)
    )?.data;
    if (!metadata) {
      return undefined;
    }
    // getKey
    const response = await this.api.getKey(
      signedEmptyTx,
      tokenId,
      this.xrplChainId,
      signerPublicKey
    );
    const decryptKey = response.key;
    // decrypto filedata
    const encryptedDataUrls = metadata.encrypted_data;
    const encryptLogic = metadata.encrypt_logic ?? "base64";
    const ownDataArray = await Promise.all(
      encryptedDataUrls.map(async (encryptedDataUrl) => {
        const encryptedData = (
          await axios.get(encryptedDataUrl, {
            responseType:
              encryptLogic === "base64"
                ? "text"
                : isRunningOnBrowser()
                ? "arraybuffer"
                : "stream",
          })
        ).data;
        return encryptLogic === "base64"
          ? decryptString(encryptedData, decryptKey)
          : isRunningOnBrowser()
          ? await decryptFile(encryptedData, decryptKey)
          : decryptStream(encryptedData, decryptKey);
      })
    );
    const ownFiles = ownDataArray.filter(
      (ownData): ownData is ArrayBuffer => typeof ownData !== "string"
    );
    const ownDataBase64 = ownDataArray.filter(
      (ownData): ownData is string => typeof ownData === "string"
    );
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

  generateTxForSigning = (walletAddress: string) => {
    const emptyTxObject = this.nft.generateEmptyTx(walletAddress);

    return emptyTxObject;
  };
}
