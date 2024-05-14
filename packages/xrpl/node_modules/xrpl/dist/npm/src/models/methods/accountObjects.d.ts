import { Amendments, FeeSettings, LedgerHashes } from '../ledger';
import { LedgerEntry, LedgerEntryFilter } from '../ledger/LedgerEntry';
import { BaseRequest, BaseResponse, LookupByLedgerRequest } from './baseMethod';
export type AccountObjectType = Exclude<LedgerEntryFilter, 'amendments' | 'fee' | 'hashes'>;
export interface AccountObjectsRequest extends BaseRequest, LookupByLedgerRequest {
    command: 'account_objects';
    account: string;
    type?: AccountObjectType;
    deletion_blockers_only?: boolean;
    limit?: number;
    marker?: unknown;
}
export type AccountObject = Exclude<LedgerEntry, Amendments | FeeSettings | LedgerHashes>;
export interface AccountObjectsResponse extends BaseResponse {
    result: {
        account: string;
        account_objects: AccountObject[];
        ledger_hash?: string;
        ledger_index?: number;
        ledger_current_index?: number;
        limit?: number;
        marker?: string;
        validated?: boolean;
    };
}
//# sourceMappingURL=accountObjects.d.ts.map