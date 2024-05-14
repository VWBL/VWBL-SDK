import type { Client } from '../client';
import { LedgerIndex } from '../models/common';
import { BookOffer, BookOfferCurrency, BookOffersRequest } from '../models/methods/bookOffers';
export interface GetOrderBookOptions {
    limit?: number;
    ledger_index?: LedgerIndex;
    ledger_hash?: string | null;
    taker?: string | null;
}
export declare function validateOrderbookOptions(options: GetOrderBookOptions): void;
export declare function createBookOffersRequest(currency1: BookOfferCurrency, currency2: BookOfferCurrency, options: {
    limit?: number;
    ledger_index?: LedgerIndex;
    ledger_hash?: string | null;
    taker?: string | null;
}): BookOffersRequest;
type BookOfferResult = BookOffer[];
export declare function requestAllOffers(client: Client, request: BookOffersRequest): Promise<BookOfferResult[]>;
export declare function reverseRequest(request: BookOffersRequest): BookOffersRequest;
export declare function extractOffers(offerResults: BookOfferResult[]): BookOffer[];
export declare function combineOrders(directOffers: BookOffer[], reverseOffers: BookOffer[]): BookOffer[];
export declare function separateBuySellOrders(orders: BookOffer[]): {
    buy: BookOffer[];
    sell: BookOffer[];
};
export declare function sortAndLimitOffers(offers: BookOffer[], limit?: number): BookOffer[];
export {};
//# sourceMappingURL=getOrderbook.d.ts.map