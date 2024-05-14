import { BaseLedgerEntry, HasPreviousTxnID } from './BaseLedgerEntry';
export default interface AccountRoot extends BaseLedgerEntry, HasPreviousTxnID {
    LedgerEntryType: 'AccountRoot';
    Account: string;
    Balance: string;
    Flags: number;
    OwnerCount: number;
    Sequence: number;
    AccountTxnID?: string;
    AMMID?: string;
    Domain?: string;
    EmailHash?: string;
    MessageKey?: string;
    RegularKey?: string;
    TicketCount?: number;
    TickSize?: number;
    TransferRate?: number;
    WalletLocator?: string;
    BurnedNFTokens?: number;
    FirstNFTSequence: number;
    MintedNFTokens?: number;
    NFTokenMinter?: string;
}
export interface AccountRootFlagsInterface {
    lsfPasswordSpent?: boolean;
    lsfRequireDestTag?: boolean;
    lsfRequireAuth?: boolean;
    lsfDisallowXRP?: boolean;
    lsfDisableMaster?: boolean;
    lsfNoFreeze?: boolean;
    lsfGlobalFreeze?: boolean;
    lsfDefaultRipple?: boolean;
    lsfDepositAuth?: boolean;
    lsfAMM?: boolean;
    lsfDisallowIncomingNFTokenOffer?: boolean;
    lsfDisallowIncomingCheck?: boolean;
    lsfDisallowIncomingPayChan?: boolean;
    lsfDisallowIncomingTrustline?: boolean;
    lsfAllowTrustLineClawback?: boolean;
}
export declare enum AccountRootFlags {
    lsfPasswordSpent = 65536,
    lsfRequireDestTag = 131072,
    lsfRequireAuth = 262144,
    lsfDisallowXRP = 524288,
    lsfDisableMaster = 1048576,
    lsfNoFreeze = 2097152,
    lsfGlobalFreeze = 4194304,
    lsfDefaultRipple = 8388608,
    lsfDepositAuth = 16777216,
    lsfAMM = 33554432,
    lsfDisallowIncomingNFTokenOffer = 67108864,
    lsfDisallowIncomingCheck = 134217728,
    lsfDisallowIncomingPayChan = 268435456,
    lsfDisallowIncomingTrustline = 536870912,
    lsfAllowTrustLineClawback = 2147483648
}
//# sourceMappingURL=AccountRoot.d.ts.map