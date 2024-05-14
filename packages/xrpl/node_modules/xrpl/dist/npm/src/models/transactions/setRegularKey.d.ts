import { BaseTransaction } from './common';
export interface SetRegularKey extends BaseTransaction {
    TransactionType: 'SetRegularKey';
    RegularKey?: string;
}
export declare function validateSetRegularKey(tx: Record<string, unknown>): void;
//# sourceMappingURL=setRegularKey.d.ts.map