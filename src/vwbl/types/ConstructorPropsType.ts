import { ethers } from "ethers";
import { Web3 } from "web3";

import { BiconomyConfig } from "./BiconomyConfigType.js";
import { ManageKeyType } from "./ManageKeyType.js";
import { UploadContentType } from "./UploadContentType.js";
import { UploadMetadataType } from "./UploadMetadataType.js";
import { AWSConfig } from "../../index.js";

export type BaseConstructorProps = {
  contractAddress: string;
  vwblNetworkUrl: string;
  uploadContentType?: UploadContentType;
  uploadMetadataType?: UploadMetadataType;
  awsConfig?: AWSConfig;
  ipfsNftStorageKey?: string;
};

export type ConstructorProps = BaseConstructorProps & {
  web3: Web3;
  manageKeyType?: ManageKeyType;
  dataCollectorAddress?: string;
};

export type VWBLOption = ConstructorProps;

export type EthersConstructorProps = BaseConstructorProps & {
  ethersProvider: ethers.providers.BaseProvider;
  ethersSigner: ethers.providers.JsonRpcSigner | ethers.Wallet;
  manageKeyType?: ManageKeyType;
  dataCollectorAddress?: string;
};

export type VWBLEthersOption = EthersConstructorProps;

export type MetaTxConstructorProps = BaseConstructorProps & {
  bcProvider:
    | ethers.providers.ExternalProvider
    | ethers.providers.JsonRpcFetchFunc;
  biconomyConfig: BiconomyConfig;
  manageKeyType?: ManageKeyType;
  dataCollectorAddress?: string;
};

export type VWBLMetaTxOption = MetaTxConstructorProps;

export type ViewerConstructorProps = {
  provider: Web3 | ethers.providers.BaseProvider;
  dataCollectorAddress: string;
};

export type ViewerOption = ViewerConstructorProps;
