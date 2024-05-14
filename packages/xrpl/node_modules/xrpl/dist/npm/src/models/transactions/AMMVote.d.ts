import { Currency } from '../common';
import { BaseTransaction } from './common';
export interface AMMVote extends BaseTransaction {
    TransactionType: 'AMMVote';
    Asset: Currency;
    Asset2: Currency;
    TradingFee: number;
}
export declare function validateAMMVote(tx: Record<string, unknown>): void;
//# sourceMappingURL=AMMVote.d.ts.map