import { Amount, XChainBridge } from '../common';
import { Account, BaseTransaction } from './common';
export interface XChainCommit extends BaseTransaction {
    TransactionType: 'XChainCommit';
    XChainBridge: XChainBridge;
    XChainClaimID: number | string;
    OtherChainDestination?: Account;
    Amount: Amount;
}
export declare function validateXChainCommit(tx: Record<string, unknown>): void;
//# sourceMappingURL=XChainCommit.d.ts.map