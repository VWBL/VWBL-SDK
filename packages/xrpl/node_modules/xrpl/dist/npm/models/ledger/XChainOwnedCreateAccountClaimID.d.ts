import { XChainBridge } from '../common';
import { BaseLedgerEntry, HasPreviousTxnID } from './BaseLedgerEntry';
export default interface XChainOwnedCreateAccountClaimID extends BaseLedgerEntry, HasPreviousTxnID {
    LedgerEntryType: 'XChainOwnedCreateAccountClaimID';
    Account: string;
    XChainBridge: XChainBridge;
    XChainAccountCreateCount: number;
    XChainCreateAccountAttestations: Array<{
        XChainCreateAccountProofSig: {
            Amount: string;
            AttestationRewardAccount: string;
            AttestationSignerAccount: string;
            Destination: string;
            PublicKey: string;
            WasLockingChainSend: 0 | 1;
        };
    }>;
    Flags: 0;
    OwnerNode: string;
}
//# sourceMappingURL=XChainOwnedCreateAccountClaimID.d.ts.map