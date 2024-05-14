import { IssuedCurrencyAmount } from '../common';
import { BaseTransaction, GlobalFlags } from './common';
export declare enum TrustSetFlags {
    tfSetfAuth = 65536,
    tfSetNoRipple = 131072,
    tfClearNoRipple = 262144,
    tfSetFreeze = 1048576,
    tfClearFreeze = 2097152
}
export interface TrustSetFlagsInterface extends GlobalFlags {
    tfSetfAuth?: boolean;
    tfSetNoRipple?: boolean;
    tfClearNoRipple?: boolean;
    tfSetFreeze?: boolean;
    tfClearFreeze?: boolean;
}
export interface TrustSet extends BaseTransaction {
    TransactionType: 'TrustSet';
    LimitAmount: IssuedCurrencyAmount;
    QualityIn?: number;
    QualityOut?: number;
    Flags?: number | TrustSetFlagsInterface;
}
export declare function validateTrustSet(tx: Record<string, unknown>): void;
//# sourceMappingURL=trustSet.d.ts.map