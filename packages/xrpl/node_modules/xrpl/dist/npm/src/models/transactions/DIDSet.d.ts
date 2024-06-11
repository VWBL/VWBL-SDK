import { BaseTransaction } from './common';
export interface DIDSet extends BaseTransaction {
    TransactionType: 'DIDSet';
    Data?: string;
    DIDDocument?: string;
    URI?: string;
}
export declare function validateDIDSet(tx: Record<string, unknown>): void;
//# sourceMappingURL=DIDSet.d.ts.map