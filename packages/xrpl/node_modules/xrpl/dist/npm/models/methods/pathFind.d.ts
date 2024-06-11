import { Amount, Path } from '../common';
import { BaseRequest, BaseResponse } from './baseMethod';
interface BasePathFindRequest extends BaseRequest {
    command: 'path_find';
    subcommand: string;
}
export interface PathFindCreateRequest extends BasePathFindRequest {
    subcommand: 'create';
    source_account: string;
    destination_account: string;
    destination_amount: Amount;
    send_max?: Amount;
    paths?: Path[];
}
export interface PathFindCloseRequest extends BasePathFindRequest {
    subcommand: 'close';
}
export interface PathFindStatusRequest extends BasePathFindRequest {
    subcommand: 'status';
}
export type PathFindRequest = PathFindCreateRequest | PathFindCloseRequest | PathFindStatusRequest;
export interface PathFindPathOption {
    paths_computed: Path[];
    source_amount: Amount;
    destination_amount?: Amount;
}
export interface PathFindResponse extends BaseResponse {
    result: {
        alternatives: PathFindPathOption[];
        destination_account: string;
        destination_amount: Amount;
        source_account: string;
        full_reply: boolean;
        id?: number | string;
        closed?: true;
        status?: true;
    };
}
export {};
//# sourceMappingURL=pathFind.d.ts.map