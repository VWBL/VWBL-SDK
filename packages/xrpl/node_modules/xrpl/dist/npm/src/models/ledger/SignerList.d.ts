import { SignerEntry } from '../common';
import { BaseLedgerEntry, HasPreviousTxnID } from './BaseLedgerEntry';
export default interface SignerList extends BaseLedgerEntry, HasPreviousTxnID {
    LedgerEntryType: 'SignerList';
    Flags: number;
    OwnerNode: string;
    SignerEntries: SignerEntry[];
    SignerListID: number;
    SignerQuorum: number;
}
export declare enum SignerListFlags {
    lsfOneOwnerCount = 65536
}
//# sourceMappingURL=SignerList.d.ts.map