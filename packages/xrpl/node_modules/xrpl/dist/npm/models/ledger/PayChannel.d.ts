import { BaseLedgerEntry, HasPreviousTxnID } from './BaseLedgerEntry';
export default interface PayChannel extends BaseLedgerEntry, HasPreviousTxnID {
    LedgerEntryType: 'PayChannel';
    Account: string;
    Destination: string;
    Amount: string;
    Balance: string;
    PublicKey: string;
    SettleDelay: number;
    OwnerNode: string;
    Flags: number;
    Expiration?: number;
    CancelAfter?: number;
    SourceTag?: number;
    DestinationTag?: number;
    DestinationNode?: string;
}
//# sourceMappingURL=PayChannel.d.ts.map