import { BaseRequest, BaseResponse, LookupByLedgerRequest } from './baseMethod';
export interface GatewayBalancesRequest extends BaseRequest, LookupByLedgerRequest {
    command: 'gateway_balances';
    account: string;
    strict?: boolean;
    hotwallet?: string | string[];
}
export interface GatewayBalance {
    currency: string;
    value: string;
}
export interface GatewayBalancesResponse extends BaseResponse {
    result: {
        account: string;
        obligations?: {
            [currency: string]: string;
        };
        balances?: {
            [address: string]: GatewayBalance[];
        };
        assets?: {
            [address: string]: GatewayBalance[];
        };
        ledger_hash?: string;
        ledger_current_index?: number;
        ledger_index?: number;
    };
}
//# sourceMappingURL=gatewayBalances.d.ts.map