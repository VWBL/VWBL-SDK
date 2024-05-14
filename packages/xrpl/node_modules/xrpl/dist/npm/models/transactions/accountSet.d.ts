import { Account, BaseTransaction } from './common';
export declare enum AccountSetAsfFlags {
    asfRequireDest = 1,
    asfRequireAuth = 2,
    asfDisallowXRP = 3,
    asfDisableMaster = 4,
    asfAccountTxnID = 5,
    asfNoFreeze = 6,
    asfGlobalFreeze = 7,
    asfDefaultRipple = 8,
    asfDepositAuth = 9,
    asfAuthorizedNFTokenMinter = 10,
    asfDisallowIncomingNFTokenOffer = 12,
    asfDisallowIncomingCheck = 13,
    asfDisallowIncomingPayChan = 14,
    asfDisallowIncomingTrustline = 15,
    asfAllowTrustLineClawback = 16
}
export declare enum AccountSetTfFlags {
    tfRequireDestTag = 65536,
    tfOptionalDestTag = 131072,
    tfRequireAuth = 262144,
    tfOptionalAuth = 524288,
    tfDisallowXRP = 1048576,
    tfAllowXRP = 2097152
}
export interface AccountSetFlagsInterface {
    tfRequireDestTag?: boolean;
    tfOptionalDestTag?: boolean;
    tfRequireAuth?: boolean;
    tfOptionalAuth?: boolean;
    tfDisallowXRP?: boolean;
    tfAllowXRP?: boolean;
}
export interface AccountSet extends BaseTransaction {
    TransactionType: 'AccountSet';
    Flags?: number | AccountSetFlagsInterface;
    ClearFlag?: number;
    Domain?: string;
    EmailHash?: string;
    MessageKey?: string;
    SetFlag?: AccountSetAsfFlags;
    TransferRate?: number;
    TickSize?: number;
    NFTokenMinter?: Account;
}
export declare function validateAccountSet(tx: Record<string, unknown>): void;
//# sourceMappingURL=accountSet.d.ts.map