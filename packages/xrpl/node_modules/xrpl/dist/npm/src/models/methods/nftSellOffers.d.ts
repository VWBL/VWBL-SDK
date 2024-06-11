import { NFTOffer } from '../common';
import { BaseRequest, BaseResponse, LookupByLedgerRequest } from './baseMethod';
export interface NFTSellOffersRequest extends BaseRequest, LookupByLedgerRequest {
    command: 'nft_sell_offers';
    nft_id: string;
}
export interface NFTSellOffersResponse extends BaseResponse {
    result: {
        offers: NFTOffer[];
        nft_id: string;
    };
}
//# sourceMappingURL=nftSellOffers.d.ts.map