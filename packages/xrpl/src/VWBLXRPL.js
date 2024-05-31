"use strict";
/**
import { SubmittableTransaction, Wallet } from "xrpl";
 
import { UploadToIPFS } from "../../storage";
import { VWBLApi } from "../api";
import { VWBLXRPLProtocol } from "../blockchain/xrpl/VWBLProtocol";

import {
  EncryptLogic,
  FileOrPath,
  GasSettings,
  ProgressSubscriber,
  UploadContentType,
  UploadEncryptedFile,
  UploadMetadata,
  UploadMetadataType,
  UploadThumbnail,
  XRPLConstructorProps,
} from "../types";

export class VWBLXRPL {
  protected api: VWBLApi;
  public nft: VWBLXRPL;
  public xrplChainId: number;
  public signTx?: SubmittableTransaction;
  public signature?: string;
  protected uploadToIpfs?: UploadToIPFS;

  constructor(props: XRPLConstructorProps) {
    const { uploadContentType, uploadMetadataType, awsConfig, ipfsNftStorageKey, vwblNetworkUrl, xrplChainId } = props;

    this.api = new VWBLApi(vwblNetworkUrl);
    this.nft = new VWBLXRPLProtocol(props.xrplChainId);
    this.xrplChainId = xrplChainId;
    if (uploadContentType === UploadContentType.S3 || uploadMetadataType === UploadMetadataType.S3) {
      if (!awsConfig) {
        throw new Error("please specify S3 bucket.");
      }
    } else if (uploadContentType === UploadContentType.IPFS || uploadMetadataType === UploadMetadataType.IPFS) {
      if (!ipfsNftStorageKey) {
        throw new Error("please specify nftstorage config of IPFS.");
      }
      this.uploadToIpfs = new UploadToIPFS(ipfsNftStorageKey);
    }
  }

  sign = async (wallet: Wallet) => {
    const signTx = await this.api.getXrplSignMessage(this.xrplChainId, wallet.address);
    this.signTx = signTx;

    const signedObj = wallet.sign(signTx);
    this.signature = signedObj.tx_blob;
  };

  managedCreateToken = (
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
    subscriber?: ProgressSubscriber,
    gasSettings?: GasSettings
  ) => {
    if (!this.signature) {
      throw "please sign first";
    }

    // 1. mint token
    //const tokenId = await this.nft.managedCreateToken();
  };
}
*/
