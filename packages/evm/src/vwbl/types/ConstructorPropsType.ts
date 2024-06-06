import { ethers } from "ethers";
import { Web3 } from "web3";

import { CoreConstructorProps, ManageKeyType } from "vwbl-core";
import { BiconomyConfig } from "./BiconomyConfigType";

export type BaseConstructorProps = {
  contractAddress: string;
  vwblNetworkUrl: string;
} & CoreConstructorProps;

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
  biconomyConfig: BiconomyConfig;
  manageKeyType?: ManageKeyType;
  dataCollectorAddress?: string;
};

export type VWBLMetaTxOption = MetaTxConstructorProps;

export type ViewerConstructorProps = {
  provider: Web3 | ethers.providers.BaseProvider | ethers.Wallet;
  dataCollectorAddress: string;
};

export type ViewerOption = ViewerConstructorProps;
