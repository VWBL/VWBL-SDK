import { BaseLedgerEntry, HasPreviousTxnID } from './BaseLedgerEntry';
export default interface DID extends BaseLedgerEntry, HasPreviousTxnID {
    LedgerEntryType: 'DID';
    Account: string;
    Data: string;
    DIDDocument: string;
    URI: string;
    Flags: 0;
    OwnerNode: string;
}
//# sourceMappingURL=DID.d.ts.map