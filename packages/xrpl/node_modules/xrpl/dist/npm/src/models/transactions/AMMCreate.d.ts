import { Amount } from '../common';
import { BaseTransaction } from './common';
export declare const AMM_MAX_TRADING_FEE = 1000;
export interface AMMCreate extends BaseTransaction {
    TransactionType: 'AMMCreate';
    Amount: Amount;
    Amount2: Amount;
    TradingFee: number;
}
export declare function validateAMMCreate(tx: Record<string, unknown>): void;
//# sourceMappingURL=AMMCreate.d.ts.map