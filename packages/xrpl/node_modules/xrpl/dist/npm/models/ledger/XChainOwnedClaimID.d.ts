import { Amount } from 'ripple-binary-codec/dist/types';
import { XChainBridge } from '../common';
import { BaseLedgerEntry, HasPreviousTxnID } from './BaseLedgerEntry';
export default interface XChainOwnedClaimID extends BaseLedgerEntry, HasPreviousTxnID {
    LedgerEntryType: 'XChainOwnedClaimID';
    Account: string;
    XChainBridge: XChainBridge;
    XChainClaimID: string;
    OtherChainSource: string;
    XChainClaimAttestations: Array<{
        XChainClaimProofSig: {
            Amount: Amount;
            AttestationRewardAccount: string;
            AttestationSignerAccount: string;
            Destination?: string;
            PublicKey: string;
            WasLockingChainSend: 0 | 1;
        };
    }>;
    SignatureReward: string;
    Flags: 0;
    OwnerNode: string;
}
//# sourceMappingURL=XChainOwnedClaimID.d.ts.map