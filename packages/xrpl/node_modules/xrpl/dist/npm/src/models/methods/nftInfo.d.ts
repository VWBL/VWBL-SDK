import { NFToken } from '../common';
import { BaseRequest, BaseResponse, LookupByLedgerRequest } from './baseMethod';
export interface NFTInfoRequest extends BaseRequest, LookupByLedgerRequest {
    command: 'nft_info';
    nft_id: string;
}
export interface NFTInfoResponse extends BaseResponse {
    result: NFToken;
}
//# sourceMappingURL=nftInfo.d.ts.map