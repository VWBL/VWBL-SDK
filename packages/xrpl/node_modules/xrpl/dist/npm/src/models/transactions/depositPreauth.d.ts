import { BaseTransaction } from './common';
export interface DepositPreauth extends BaseTransaction {
    TransactionType: 'DepositPreauth';
    Authorize?: string;
    Unauthorize?: string;
}
export declare function validateDepositPreauth(tx: Record<string, unknown>): void;
//# sourceMappingURL=depositPreauth.d.ts.map