import { AuthAccount, Currency, IssuedCurrencyAmount } from '../common';
import { BaseTransaction } from './common';
export interface AMMBid extends BaseTransaction {
    TransactionType: 'AMMBid';
    Asset: Currency;
    Asset2: Currency;
    BidMin?: IssuedCurrencyAmount;
    BidMax?: IssuedCurrencyAmount;
    AuthAccounts?: AuthAccount[];
}
export declare function validateAMMBid(tx: Record<string, unknown>): void;
//# sourceMappingURL=AMMBid.d.ts.map