import { GasSettings } from "./GasSettings";

export type MintTxParam = {
  decryptUrl: string;
  feeNumerator: number;
  documentId: string;
  gasSettings?: GasSettings;
  // param of ERC6150
  parentId?: number;
};

export type MintForIPFSTxParam = MintTxParam & {
  metadataUrl: string;
};

export type GrantViewPermissionTxParam = {
  tokenId: number;
  grantee: string;
  gasSettings?: GasSettings;
  // param of ERC6150
  toDir?: boolean;
};
