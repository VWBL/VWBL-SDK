import { Amount, Currency, IssuedCurrencyAmount } from '../common';
import { BaseTransaction, GlobalFlags } from './common';
export declare enum AMMWithdrawFlags {
    tfLPToken = 65536,
    tfWithdrawAll = 131072,
    tfOneAssetWithdrawAll = 262144,
    tfSingleAsset = 524288,
    tfTwoAsset = 1048576,
    tfOneAssetLPToken = 2097152,
    tfLimitLPToken = 4194304
}
export interface AMMWithdrawFlagsInterface extends GlobalFlags {
    tfLPToken?: boolean;
    tfWithdrawAll?: boolean;
    tfOneAssetWithdrawAll?: boolean;
    tfSingleAsset?: boolean;
    tfTwoAsset?: boolean;
    tfOneAssetLPToken?: boolean;
    tfLimitLPToken?: boolean;
}
export interface AMMWithdraw extends BaseTransaction {
    TransactionType: 'AMMWithdraw';
    Asset: Currency;
    Asset2: Currency;
    Amount?: Amount;
    Amount2?: Amount;
    EPrice?: Amount;
    LPTokenIn?: IssuedCurrencyAmount;
}
export declare function validateAMMWithdraw(tx: Record<string, unknown>): void;
//# sourceMappingURL=AMMWithdraw.d.ts.map