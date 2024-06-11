import { LedgerIndex, ResponseOnlyTxInfo } from '../common';
import { Transaction } from '../transactions';
import { BaseRequest, BaseResponse } from './baseMethod';
export interface NoRippleCheckRequest extends BaseRequest {
    command: 'noripple_check';
    account: string;
    role: 'gateway' | 'user';
    transactions?: boolean;
    limit?: number;
    ledger_hash?: string;
    ledger_index?: LedgerIndex;
}
export interface NoRippleCheckResponse extends BaseResponse {
    result: {
        ledger_current_index: number;
        problems: string[];
        transactions: Array<Transaction & ResponseOnlyTxInfo>;
    };
}
//# sourceMappingURL=norippleCheck.d.ts.map