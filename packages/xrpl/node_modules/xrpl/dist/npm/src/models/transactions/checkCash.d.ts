import { Amount } from '../common';
import { BaseTransaction } from './common';
export interface CheckCash extends BaseTransaction {
    TransactionType: 'CheckCash';
    CheckID: string;
    Amount?: Amount;
    DeliverMin?: Amount;
}
export declare function validateCheckCash(tx: Record<string, unknown>): void;
//# sourceMappingURL=checkCash.d.ts.map