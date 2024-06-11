import { NFTOffer } from '../common';
import { BaseRequest, BaseResponse, LookupByLedgerRequest } from './baseMethod';
export interface NFTBuyOffersRequest extends BaseRequest, LookupByLedgerRequest {
    command: 'nft_buy_offers';
    nft_id: string;
}
export interface NFTBuyOffersResponse extends BaseResponse {
    result: {
        offers: NFTOffer[];
        nft_id: string;
    };
}
//# sourceMappingURL=nftBuyOffers.d.ts.map