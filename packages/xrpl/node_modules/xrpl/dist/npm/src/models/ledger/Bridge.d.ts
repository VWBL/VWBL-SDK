import { Amount, XChainBridge } from '../common';
import { BaseLedgerEntry, HasPreviousTxnID } from './BaseLedgerEntry';
export default interface Bridge extends BaseLedgerEntry, HasPreviousTxnID {
    LedgerEntryType: 'Bridge';
    Account: string;
    SignatureReward: Amount;
    XChainBridge: XChainBridge;
    XChainClaimID: string;
    XChainAccountCreateCount: string;
    XChainAccountClaimCount: string;
    MinAccountCreateAmount?: string;
    Flags: 0;
    OwnerNode: string;
}
//# sourceMappingURL=Bridge.d.ts.map