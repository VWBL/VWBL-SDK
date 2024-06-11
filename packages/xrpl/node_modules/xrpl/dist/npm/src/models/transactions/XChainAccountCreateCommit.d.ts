import { Amount, XChainBridge } from '../common';
import { BaseTransaction, Account } from './common';
export interface XChainAccountCreateCommit extends BaseTransaction {
    TransactionType: 'XChainAccountCreateCommit';
    XChainBridge: XChainBridge;
    SignatureReward: Amount;
    Destination: Account;
    Amount: Amount;
}
export declare function validateXChainAccountCreateCommit(tx: Record<string, unknown>): void;
//# sourceMappingURL=XChainAccountCreateCommit.d.ts.map