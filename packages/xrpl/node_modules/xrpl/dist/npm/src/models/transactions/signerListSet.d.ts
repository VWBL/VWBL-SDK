import { SignerEntry } from '../common';
import { BaseTransaction } from './common';
export interface SignerListSet extends BaseTransaction {
    TransactionType: 'SignerListSet';
    SignerQuorum: number;
    SignerEntries?: SignerEntry[];
}
export declare function validateSignerListSet(tx: Record<string, unknown>): void;
//# sourceMappingURL=signerListSet.d.ts.map