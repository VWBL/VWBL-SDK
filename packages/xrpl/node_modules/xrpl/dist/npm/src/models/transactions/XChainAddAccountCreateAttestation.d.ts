import { Amount, XChainBridge } from '../common';
import { Account, BaseTransaction } from './common';
export interface XChainAddAccountCreateAttestation extends BaseTransaction {
    TransactionType: 'XChainAddAccountCreateAttestation';
    Amount: Amount;
    AttestationRewardAccount: Account;
    AttestationSignerAccount: Account;
    Destination: Account;
    OtherChainSource: Account;
    PublicKey: string;
    Signature: string;
    SignatureReward: Amount;
    WasLockingChainSend: 0 | 1;
    XChainAccountCreateCount: number | string;
    XChainBridge: XChainBridge;
}
export declare function validateXChainAddAccountCreateAttestation(tx: Record<string, unknown>): void;
//# sourceMappingURL=XChainAddAccountCreateAttestation.d.ts.map