import { BaseTransaction } from './common';
export interface UNLModify extends BaseTransaction {
    TransactionType: 'UNLModify';
    LedgerSequence: number;
    UNLModifyDisabling: 0 | 1;
    UNLModifyValidator: string;
}
//# sourceMappingURL=UNLModify.d.ts.map