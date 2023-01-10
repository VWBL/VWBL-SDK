import { ethers } from "ethers";
import Web3 from "web3";

import { AWSConfig } from "../../storage/aws/types";
import { BiconomyConfig } from "./BiconomyConfigType";
import { ManageKeyType } from "./ManageKeyType";
import { UploadContentType } from "./UploadContentType";
import { UploadMetadataType } from "./UploadMetadataType";

export type BaseConstructorProps = {
  vwblNetworkUrl: string;
  uploadContentType?: UploadContentType;
  uploadMetadataType?: UploadMetadataType;
  awsConfig?: AWSConfig;
  ipfsNftStorageKey?: string;
};

export type ConstructorProps = BaseConstructorProps & {
  web3: Web3;
  contractAddress: string;
  manageKeyType?: ManageKeyType;
};

export type VWBLOption = ConstructorProps;

export type EthersConstructorProps = BaseConstructorProps & {
  ethersProvider: ethers.providers.BaseProvider;
  ethersSigner: ethers.providers.JsonRpcSigner | ethers.Wallet;
  contractAddress: string;
  manageKeyType?: ManageKeyType;
};

export type VWBLEthersOption = EthersConstructorProps;

export type MetaTxConstructorProps = BaseConstructorProps & {
  bcProvider: ethers.providers.ExternalProvider | ethers.providers.JsonRpcFetchFunc;
  contractAddress: string;
  biconomyConfig: BiconomyConfig;
  manageKeyType?: ManageKeyType;
};

export type VWBLMetaTxOption = MetaTxConstructorProps;

export type ViewerConstructorProps = BaseConstructorProps & {
  web3: Web3;
  dataCollectorAddress: string;
};

export type ViewerOption = ViewerConstructorProps;
