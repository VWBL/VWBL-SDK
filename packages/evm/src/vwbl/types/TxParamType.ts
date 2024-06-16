import { GasSettings } from "./GasSettings";

export type MintTxParam = {
  decryptUrl: string;
  feeNumerator: number;
  documentId: string;
  gasSettings?: GasSettings;
  // param of ERC6150
  parentId?: number;
};

export type MintMetaTxParam = MintTxParam & {
  mintApiId: string;
};

export type MintForIPFSTxParam = MintTxParam & {
  metadataUrl: string;
};

export type MintForIPFSMetaTxParam = MintForIPFSTxParam & {
  mintApiId: string;
};

export type GrantViewPermissionTxParam = {
  tokenId: number;
  grantee: string;
  gasSettings?: GasSettings;
  // param of ERC6150
  toDir?: boolean;
};

export type GrantViewPermissionMetaTxParam = GrantViewPermissionTxParam & {
  grantViewPermissionApiId: string;
};
