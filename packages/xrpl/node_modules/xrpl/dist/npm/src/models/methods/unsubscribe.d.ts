import { Currency, StreamType } from '../common';
import type { BaseRequest, BaseResponse } from './baseMethod';
export interface UnsubscribeBook {
    taker_gets: Currency;
    taker_pays: Currency;
    both?: boolean;
}
export interface UnsubscribeRequest extends BaseRequest {
    command: 'unsubscribe';
    streams?: StreamType[];
    accounts?: string[];
    accounts_proposed?: string[];
    books?: UnsubscribeBook[];
}
export interface UnsubscribeResponse extends BaseResponse {
    result: Record<string, never>;
}
//# sourceMappingURL=unsubscribe.d.ts.map