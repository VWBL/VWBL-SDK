import { BaseRequest, BaseResponse } from './baseMethod';
export interface RandomRequest extends BaseRequest {
    command: 'random';
}
export interface RandomResponse extends BaseResponse {
    result: {
        random: string;
    };
}
//# sourceMappingURL=random.d.ts.map