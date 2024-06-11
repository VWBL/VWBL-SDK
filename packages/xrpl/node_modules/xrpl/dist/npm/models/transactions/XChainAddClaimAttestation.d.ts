import { Amount, XChainBridge } from '../common';
import { Account, BaseTransaction } from './common';
export interface XChainAddClaimAttestation extends BaseTransaction {
    TransactionType: 'XChainAddClaimAttestation';
    Amount: Amount;
    AttestationRewardAccount: Account;
    AttestationSignerAccount: Account;
    Destination?: Account;
    OtherChainSource: Account;
    PublicKey: string;
    Signature: string;
    WasLockingChainSend: 0 | 1;
    XChainBridge: XChainBridge;
    XChainClaimID: number | string;
}
export declare function validateXChainAddClaimAttestation(tx: Record<string, unknown>): void;
//# sourceMappingURL=XChainAddClaimAttestation.d.ts.map