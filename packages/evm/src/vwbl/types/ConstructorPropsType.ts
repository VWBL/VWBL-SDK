import { ethers } from "ethers";
import { Web3 } from "web3";

import {
  IPFSConfig,
  AWSConfig,
  ManageKeyType,
  UploadContentType,
  UploadMetadataType
} from "vwbl-core";
import { MetaTxConfig } from "./MetaTxConfigType";

export type BaseConstructorProps = {
  contractAddress: string;
  vwblNetworkUrl: string;
  uploadContentType?: UploadContentType;
  uploadMetadataType?: UploadMetadataType;
  awsConfig?: AWSConfig;
  ipfsConfig?: IPFSConfig;
};

export type ConstructorProps = BaseConstructorProps & {
  web3: Web3;
  manageKeyType?: ManageKeyType;
  dataCollectorAddress?: string;
};

export type VWBLOption = ConstructorProps;

export type EthersConstructorProps = BaseConstructorProps & {
  ethersProvider: ethers.providers.BaseProvider;
  ethersSigner: ethers.Signer;
  manageKeyType?: ManageKeyType;
  dataCollectorAddress?: string;
};

export type VWBLEthersOption = EthersConstructorProps;

export type MetaTxConstructorProps = BaseConstructorProps & {
  bcProvider: ethers.providers.ExternalProvider | ethers.providers.JsonRpcFetchFunc | ethers.Wallet;
  metaTxConfig: MetaTxConfig;
  manageKeyType?: ManageKeyType;
  dataCollectorAddress?: string;
};

export type VWBLMetaTxOption = MetaTxConstructorProps;

export type ViewerConstructorProps = {
  provider: Web3 | ethers.providers.BaseProvider | ethers.Wallet;
  dataCollectorAddress: string;
};

export type ViewerOption = ViewerConstructorProps;
