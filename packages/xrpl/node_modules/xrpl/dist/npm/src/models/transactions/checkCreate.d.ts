import { Amount } from '../common';
import { BaseTransaction, Account } from './common';
export interface CheckCreate extends BaseTransaction {
    TransactionType: 'CheckCreate';
    Destination: Account;
    SendMax: Amount;
    DestinationTag?: number;
    Expiration?: number;
    InvoiceID?: string;
}
export declare function validateCheckCreate(tx: Record<string, unknown>): void;
//# sourceMappingURL=checkCreate.d.ts.map