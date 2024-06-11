import { BaseTransaction } from './common';
export interface OfferCancel extends BaseTransaction {
    TransactionType: 'OfferCancel';
    OfferSequence: number;
}
export declare function validateOfferCancel(tx: Record<string, unknown>): void;
//# sourceMappingURL=offerCancel.d.ts.map