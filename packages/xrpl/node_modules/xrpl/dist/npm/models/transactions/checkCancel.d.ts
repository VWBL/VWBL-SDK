import { BaseTransaction } from './common';
export interface CheckCancel extends BaseTransaction {
    TransactionType: 'CheckCancel';
    CheckID: string;
}
export declare function validateCheckCancel(tx: Record<string, unknown>): void;
//# sourceMappingURL=checkCancel.d.ts.map