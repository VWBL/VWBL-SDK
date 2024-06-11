import { ResponseOnlyTxInfo } from '../common';
import { Transaction, TransactionMetadata } from '../transactions';
import { BaseRequest, BaseResponse, LookupByLedgerRequest } from './baseMethod';
export interface NFTHistoryRequest extends BaseRequest, LookupByLedgerRequest {
    command: 'nft_history';
    nft_id: string;
    ledger_index_min?: number;
    ledger_index_max?: number;
    binary?: boolean;
    forward?: boolean;
    limit?: number;
    marker?: unknown;
}
export interface NFTHistoryTransaction {
    ledger_index: number;
    meta: string | TransactionMetadata;
    tx?: Transaction & ResponseOnlyTxInfo;
    tx_blob?: string;
    validated: boolean;
}
export interface NFTHistoryResponse extends BaseResponse {
    result: {
        nft_id: string;
        ledger_index_min: number;
        ledger_index_max: number;
        limit?: number;
        marker?: unknown;
        transactions: NFTHistoryTransaction[];
        validated?: boolean;
    };
}
//# sourceMappingURL=nftHistory.d.ts.map