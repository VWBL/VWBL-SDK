import AWS from "aws-sdk";
import axios from "axios";
import Web3 from "web3";

import { AWSConfig } from "../aws/types";
import { uploadAll, uploadMetadata } from "../aws/upload";
import { createRandomKey, decrypt, encrypt } from "../util/cryptoHelper";
import { VWBLApi } from "./api";
import { signToProtocol, VWBLNFT } from "./blockchain";
import { ExtractMetadata, Metadata } from "./metadata";
import { ManageKeyType, UploadContentType, UploadFile, UploadMetadata, UploadMetadataType } from "./types";
import { getMimeType, toBase64FromBlob } from "../util/imageEditor";

export type ConstructorProps = {
  web3: Web3;
  contractAddress: string;
  manageKeyType: ManageKeyType;
  uploadContentType: UploadContentType;
  uploadMetadataType: UploadMetadataType;
  awsConfig?: AWSConfig;
  vwblNetworkUrl: string;
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

  sign = async () => {
    this.signature = await signToProtocol(this.opts.web3);
    console.log("signed");
  };

  createToken = async (
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

    const { manageKeyType, uploadContentType, uploadMetadataType, awsConfig, vwblNetworkUrl } = this.opts;
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
    const mimeType = await getMimeType(plainData);
    await uploadMetadataFunction(tokenId, name, description, thumbnailImageUrl, encryptedDataUrl, mimeType, awsConfig);
    // 6. set key to vwbl-network
    console.log("set key");
    await this.api.setKey(documentId, key, this.signature);
    return tokenId;
  };

  sendToken = async (to: string, tokenId: number) => {
    return await this.nft.send(to, tokenId);
  };

  getOwnTokenIds = async (): Promise<number[]> => {
    return await this.nft.getOwnTokenIds();
  };

  getTokenById = async (id: number): Promise<(ExtractMetadata | Metadata) & { owner: string }> => {
    const isOwner = await this.nft.isOwnerOf(id);
    const owner = await this.nft.getOwner(id);
    const metadata = isOwner ? await this.extractMetadata(id) : await this.getMetadata(id);
    if (!metadata) {
      throw new Error("metadata not found");
    }
    return { ...metadata, owner };
  };

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
    const decryptKey = await this.api.getKey(documentId, this.signature);
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
}
