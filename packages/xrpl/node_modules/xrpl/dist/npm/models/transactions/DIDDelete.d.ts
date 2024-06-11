import { BaseTransaction } from './common';
export interface DIDDelete extends BaseTransaction {
    TransactionType: 'DIDDelete';
}
export declare function validateDIDDelete(tx: Record<string, unknown>): void;
//# sourceMappingURL=DIDDelete.d.ts.map