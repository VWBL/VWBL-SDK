import { Amount, Currency, IssuedCurrencyAmount } from '../common';
import { BaseRequest, BaseResponse } from './baseMethod';
export interface AMMInfoRequest extends BaseRequest {
    command: 'amm_info';
    amm_account?: string;
    asset?: Currency;
    asset2?: Currency;
}
export interface AMMInfoResponse extends BaseResponse {
    result: {
        amm: {
            account: string;
            amount: Amount;
            amount2: Amount;
            asset_frozen?: boolean;
            asset2_frozen?: boolean;
            auction_slot?: {
                account: string;
                auth_accounts: Array<{
                    account: string;
                }>;
                discounted_fee: number;
                expiration: string;
                price: IssuedCurrencyAmount;
                time_interval: number;
            };
            lp_token: IssuedCurrencyAmount;
            trading_fee: number;
            vote_slots?: Array<{
                account: string;
                trading_fee: number;
                vote_weight: number;
            }>;
        };
        ledger_hash?: string;
        ledger_index?: number;
        validated?: boolean;
    };
}
//# sourceMappingURL=ammInfo.d.ts.map