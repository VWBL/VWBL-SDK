import { Amount } from '../common';
import { Offer } from '../ledger';
import { BaseRequest, BaseResponse, LookupByLedgerRequest } from './baseMethod';
export interface BookOfferCurrency {
    currency: string;
    issuer?: string;
}
export interface BookOffersRequest extends BaseRequest, LookupByLedgerRequest {
    command: 'book_offers';
    limit?: number;
    taker?: string;
    taker_gets: BookOfferCurrency;
    taker_pays: BookOfferCurrency;
}
export interface BookOffer extends Offer {
    owner_funds?: string;
    taker_gets_funded?: Amount;
    taker_pays_funded?: Amount;
    quality?: string;
}
export interface BookOffersResponse extends BaseResponse {
    result: {
        ledger_current_index?: number;
        ledger_index?: number;
        ledger_hash?: string;
        offers: BookOffer[];
        validated?: boolean;
    };
}
//# sourceMappingURL=bookOffers.d.ts.map