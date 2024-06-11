import { Amount } from '../common';
import { BaseRequest, BaseResponse, LookupByLedgerRequest } from './baseMethod';
export interface AccountOffersRequest extends BaseRequest, LookupByLedgerRequest {
    command: 'account_offers';
    account: string;
    limit?: number;
    marker?: unknown;
    strict?: boolean;
}
export interface AccountOffer {
    flags: number;
    seq: number;
    taker_gets: Amount;
    taker_pays: Amount;
    quality: string;
    expiration?: number;
}
export interface AccountOffersResponse extends BaseResponse {
    result: {
        account: string;
        offers?: AccountOffer[];
        ledger_current_index?: number;
        ledger_index?: number;
        ledger_hash?: string;
        marker?: unknown;
    };
}
//# sourceMappingURL=accountOffers.d.ts.map