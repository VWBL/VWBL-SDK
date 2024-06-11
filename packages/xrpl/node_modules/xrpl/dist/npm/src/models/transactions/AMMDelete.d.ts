import { Currency } from '../common';
import { BaseTransaction } from './common';
export interface AMMDelete extends BaseTransaction {
    TransactionType: 'AMMDelete';
    Asset: Currency;
    Asset2: Currency;
}
export declare function validateAMMDelete(tx: Record<string, unknown>): void;
//# sourceMappingURL=AMMDelete.d.ts.map