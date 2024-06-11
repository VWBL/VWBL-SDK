import { BaseTransaction } from './common';
export interface TicketCreate extends BaseTransaction {
    TransactionType: 'TicketCreate';
    TicketCount: number;
}
export declare function validateTicketCreate(tx: Record<string, unknown>): void;
//# sourceMappingURL=ticketCreate.d.ts.map