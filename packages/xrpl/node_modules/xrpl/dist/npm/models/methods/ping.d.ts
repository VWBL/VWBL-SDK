import type { BaseRequest, BaseResponse } from './baseMethod';
export interface PingRequest extends BaseRequest {
    command: 'ping';
}
export interface PingResponse extends BaseResponse {
    result: {
        role?: string;
        unlimited?: boolean;
    };
}
//# sourceMappingURL=ping.d.ts.map