import { BaseLedgerEntry, HasPreviousTxnID } from './BaseLedgerEntry';
export default interface Ticket extends BaseLedgerEntry, HasPreviousTxnID {
    LedgerEntryType: 'Ticket';
    Account: string;
    Flags: number;
    OwnerNode: string;
    TicketSequence: number;
}
//# sourceMappingURL=Ticket.d.ts.map