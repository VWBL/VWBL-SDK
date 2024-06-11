import { Amount, XChainBridge } from '../common';
import { Account, BaseTransaction } from './common';
export interface XChainClaim extends BaseTransaction {
    TransactionType: 'XChainClaim';
    XChainBridge: XChainBridge;
    XChainClaimID: number | string;
    Destination: Account;
    DestinationTag?: number;
    Amount: Amount;
}
export declare function validateXChainClaim(tx: Record<string, unknown>): void;
//# sourceMappingURL=XChainClaim.d.ts.map