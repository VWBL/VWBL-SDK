import Web3 from "web3";
import AWS from "aws-sdk";
import { VWBLNFT } from "../blockchain/VWBLProtocol";
import ManageKeyType from "../types/ManageKeyType";
import UploadImageType from "../types/UploadImageType";
import UploadMetadataType from "../types/UploadMetadataType";
import VWBLApi from "../api/VWBLApi";
import { createRandomKey, encrypt } from "../../util/cryptoHelper";
import { AWSConfig } from "../../aws/types";
import { FileContent, UploadFile } from "../../common/types/File";
import { uploadAll } from "../../aws/upload";

type ConstructorProps = {
  web3: Web3;
  address: string;
  manageKeyType: ManageKeyType;
  uploadImageType: UploadImageType;
  uploadMetadataType: UploadMetadataType;
  awsConfig: AWSConfig;
  vwblNetworkUrl: string
}

type VWBLOption = Omit<ConstructorProps, "web3">;

type CreateTokenProps = {
  plainData: string;
}

class VWBL {
  private nft: VWBLNFT;
  private opts: VWBLOption;
  private api: VWBLApi;

  constructor(props: ConstructorProps) {
    const {web3, address, manageKeyType, uploadImageType, uploadMetadataType, awsConfig, vwblNetworkUrl} = props;
    this.nft = new VWBLNFT(web3, address);
    this.opts = props;
    this.api = new VWBLApi(vwblNetworkUrl);
    if (uploadImageType === UploadImageType.S3 || uploadMetadataType === UploadMetadataType.S3) {
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

  createToken = async (plainData: FileContent, thumbnailImage: FileContent, uploadFileCallback: UploadFile) => {
    const {manageKeyType, uploadImageType, uploadMetadataType, awsConfig, vwblNetworkUrl} = this.opts;
    // 1. create key in frontend
    const key = createRandomKey();
    // 2. encrypt data
    const encryptedContent = encrypt(plainData.content, key);
    // 3. upload data
    const uploadAllFunction = uploadImageType === UploadImageType.S3 ? uploadAll : uploadFileCallback;
    const {encryptedDataUrl, thumbnailImageUrl} = await uploadAllFunction(plainData,thumbnailImage,encryptedContent,awsConfig)
  }
}
