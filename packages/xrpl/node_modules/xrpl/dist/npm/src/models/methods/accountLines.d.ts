import { BaseRequest, BaseResponse, LookupByLedgerRequest } from './baseMethod';
export interface AccountLinesTrustline {
    account: string;
    balance: string;
    currency: string;
    limit: string;
    limit_peer: string;
    quality_in: number;
    quality_out: number;
    no_ripple?: boolean;
    no_ripple_peer?: boolean;
    authorized?: boolean;
    peer_authorized?: boolean;
    freeze?: boolean;
    freeze_peer?: boolean;
}
export interface AccountLinesRequest extends BaseRequest, LookupByLedgerRequest {
    command: 'account_lines';
    account: string;
    peer?: string;
    limit?: number;
    marker?: unknown;
}
export interface AccountLinesResponse extends BaseResponse {
    result: {
        account: string;
        lines: AccountLinesTrustline[];
        ledger_current_index?: number;
        ledger_index?: number;
        ledger_hash?: string;
        marker?: unknown;
    };
}
//# sourceMappingURL=accountLines.d.ts.map