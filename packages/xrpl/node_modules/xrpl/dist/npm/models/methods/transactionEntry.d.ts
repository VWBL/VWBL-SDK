import { ResponseOnlyTxInfo } from '../common';
import { Transaction, TransactionMetadata } from '../transactions';
import { BaseRequest, BaseResponse, LookupByLedgerRequest } from './baseMethod';
export interface TransactionEntryRequest extends BaseRequest, LookupByLedgerRequest {
    command: 'transaction_entry';
    tx_hash: string;
}
export interface TransactionEntryResponse extends BaseResponse {
    result: {
        ledger_hash: string;
        ledger_index: number;
        metadata: TransactionMetadata;
        tx_json: Transaction & ResponseOnlyTxInfo;
    };
}
//# sourceMappingURL=transactionEntry.d.ts.map