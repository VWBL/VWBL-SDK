import { BaseRequest, BaseResponse } from './baseMethod';
export interface ServerDefinitionsRequest extends BaseRequest {
    command: 'server_definitions';
    hash?: string;
}
export interface ServerDefinitionsResponse extends BaseResponse {
    result: {
        hash: string;
    } & ({
        FIELDS: Array<[
            string,
            {
                nth: number;
                isVLEncoded: boolean;
                isSerialized: boolean;
                isSigningField: boolean;
                type: string;
            }
        ]>;
        LEDGER_ENTRY_TYPES: Record<string, number>;
        TRANSACTION_RESULTS: Record<string, number>;
        TRANSACTION_TYPES: Record<string, number>;
        TYPES: Record<string, number>;
    } | {
        FIELDS?: never;
        LEDGER_ENTRY_TYPES?: never;
        TRANSACTION_RESULTS?: never;
        TRANSACTION_TYPES?: never;
        TYPES?: never;
    });
}
//# sourceMappingURL=serverDefinitions.d.ts.map