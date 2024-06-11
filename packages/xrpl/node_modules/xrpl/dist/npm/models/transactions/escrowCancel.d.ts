import { Account, BaseTransaction } from './common';
export interface EscrowCancel extends BaseTransaction {
    TransactionType: 'EscrowCancel';
    Owner: Account;
    OfferSequence: number | string;
}
export declare function validateEscrowCancel(tx: Record<string, unknown>): void;
//# sourceMappingURL=escrowCancel.d.ts.map