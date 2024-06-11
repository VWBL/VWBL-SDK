import { BaseTransaction } from './common';
export declare enum EnableAmendmentFlags {
    tfGotMajority = 65536,
    tfLostMajority = 131072
}
export interface EnableAmendment extends BaseTransaction {
    TransactionType: 'EnableAmendment';
    Amendment: string;
    LedgerSequence: number;
}
//# sourceMappingURL=enableAmendment.d.ts.map