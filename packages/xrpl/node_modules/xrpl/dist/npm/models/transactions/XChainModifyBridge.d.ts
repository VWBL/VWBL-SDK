import { Amount, XChainBridge } from '../common';
import { BaseTransaction, GlobalFlags } from './common';
export declare enum XChainModifyBridgeFlags {
    tfClearAccountCreateAmount = 65536
}
export interface XChainModifyBridgeFlagsInterface extends GlobalFlags {
    tfClearAccountCreateAmount?: boolean;
}
export interface XChainModifyBridge extends BaseTransaction {
    TransactionType: 'XChainModifyBridge';
    XChainBridge: XChainBridge;
    SignatureReward?: Amount;
    MinAccountCreateAmount?: Amount;
    Flags?: number | XChainModifyBridgeFlagsInterface;
}
export declare function validateXChainModifyBridge(tx: Record<string, unknown>): void;
//# sourceMappingURL=XChainModifyBridge.d.ts.map