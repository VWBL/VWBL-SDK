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
  VWBLXRPLOption,
  XRPLConstructorProps,
} from "vwbl-core";
import * as fs from "fs";
import { SubmittableTransaction } from "xrpl";

import { XRPLApi } from "./api";
import { VWBLXRPLProtocol } from "./blockchain/VWBLProtocol";

export class VWBLXRPL {
  protected api: XRPLApi;
  public opts: VWBLXRPLOption;
  public nft: VWBLXRPLProtocol;

  constructor(props: XRPLConstructorProps) {
    this.opts = props;

    this.api = new XRPLApi(this.opts.vwblNetworkUrl);
    this.nft = new VWBLXRPLProtocol(this.opts.xrplChainId);
  }

  generateMintTokenTx(
    walletAddress: string,
    transferRoyalty: number,
    isTransferable: boolean,
    isBurnable: boolean
  ) {
    const TagId = 11451419;

    const mintTxJson: SubmittableTransaction = {
      TransactionType: "NFTokenMint",
      Account: walletAddress,
      NFTokenTaxon: TagId,
      SourceTag: TagId,
      TransferFee: transferRoyalty,
      Flags: {
        tfTransferable: isTransferable,
        tfBurnable: isBurnable,
      },
    };

    return mintTxJson;
  }

  mintAndGeneratePaymentTx = async (
    signedMintTx: string,
    walletAddress: string
  ) => {
    const tokenId = await this.nft.mint(signedMintTx);
    const paymentTxJson = await this.nft.generatePaymentTx(
      tokenId,
      walletAddress
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

  createManagedToken = async (
    tokenId: string,
    xrplChainId: number,
    signedEmptyTx: string,
    signedPaymentTxHash: string,
    signerPublicKey: string,
    name: string,
    description: string,
    plainFile: FileOrPath | FileOrPath[],
    thumbnailImage: FileOrPath,
    encryptLogic: EncryptLogic = "base64",
    uploadEncryptedFileCallback?: UploadEncryptedFile,
    uploadThumbnailCallback?: UploadThumbnail,
    uploadMetadataCallBack?: UploadMetadata
  ) => {
    // verify tx signature
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
      xrplChainId,
      key,
      signedEmptyTx,
      signedPaymentTxHash,
      signerPublicKey
    );

    return tokenId;
  };
}
