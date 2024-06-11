import { Amount, XChainBridge } from '../common';
import { Account, BaseTransaction } from './common';
export interface XChainCreateClaimID extends BaseTransaction {
    TransactionType: 'XChainCreateClaimID';
    XChainBridge: XChainBridge;
    SignatureReward: Amount;
    OtherChainSource: Account;
}
export declare function validateXChainCreateClaimID(tx: Record<string, unknown>): void;
//# sourceMappingURL=XChainCreateClaimID.d.ts.map