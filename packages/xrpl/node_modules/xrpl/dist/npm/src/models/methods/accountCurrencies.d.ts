import { BaseRequest, BaseResponse, LookupByLedgerRequest } from './baseMethod';
export interface AccountCurrenciesRequest extends BaseRequest, LookupByLedgerRequest {
    command: 'account_currencies';
    account: string;
    strict?: boolean;
}
export interface AccountCurrenciesResponse extends BaseResponse {
    result: {
        ledger_hash?: string;
        ledger_index: number;
        receive_currencies: string[];
        send_currencies: string[];
        validated: boolean;
    };
}
//# sourceMappingURL=accountCurrencies.d.ts.map