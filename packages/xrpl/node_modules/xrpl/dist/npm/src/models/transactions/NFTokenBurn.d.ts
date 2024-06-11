import { Account, BaseTransaction } from './common';
export interface NFTokenBurn extends BaseTransaction {
    TransactionType: 'NFTokenBurn';
    Account: Account;
    NFTokenID: string;
    Owner?: Account;
}
export declare function validateNFTokenBurn(tx: Record<string, unknown>): void;
//# sourceMappingURL=NFTokenBurn.d.ts.map