import { BaseLedgerEntry, HasPreviousTxnID } from './BaseLedgerEntry';
export default interface Escrow extends BaseLedgerEntry, HasPreviousTxnID {
    LedgerEntryType: 'Escrow';
    Account: string;
    Destination: string;
    Amount: string;
    Condition?: string;
    CancelAfter?: number;
    FinishAfter?: number;
    Flags: number;
    SourceTag?: number;
    DestinationTag?: number;
    OwnerNode: string;
    DestinationNode?: string;
}
//# sourceMappingURL=Escrow.d.ts.map