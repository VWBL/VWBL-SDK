import { LedgerEntry, LedgerEntryFilter } from '../ledger';
import { BaseRequest, BaseResponse, LookupByLedgerRequest } from './baseMethod';
export interface LedgerDataRequest extends BaseRequest, LookupByLedgerRequest {
    command: 'ledger_data';
    binary?: boolean;
    limit?: number;
    marker?: unknown;
    type?: LedgerEntryFilter;
}
export type LedgerDataLabeledLedgerEntry = {
    ledgerEntryType: string;
} & LedgerEntry;
export interface LedgerDataBinaryLedgerEntry {
    data: string;
}
export type LedgerDataLedgerState = {
    index: string;
} & (LedgerDataBinaryLedgerEntry | LedgerDataLabeledLedgerEntry);
export interface LedgerDataResponse extends BaseResponse {
    result: {
        ledger_index: number;
        ledger_hash: string;
        state: LedgerDataLedgerState[];
        marker?: unknown;
        validated?: boolean;
    };
}
//# sourceMappingURL=ledgerData.d.ts.map