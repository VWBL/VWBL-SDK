import { Amount, XChainBridge } from '../common';
import { BaseTransaction } from './common';
export interface XChainCreateBridge extends BaseTransaction {
    TransactionType: 'XChainCreateBridge';
    XChainBridge: XChainBridge;
    SignatureReward: Amount;
    MinAccountCreateAmount?: Amount;
}
export declare function validateXChainCreateBridge(tx: Record<string, unknown>): void;
//# sourceMappingURL=XChainCreateBridge.d.ts.map