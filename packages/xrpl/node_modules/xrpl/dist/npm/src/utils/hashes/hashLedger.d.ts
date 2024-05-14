import type { Ledger } from '../../models/ledger';
import { LedgerEntry } from '../../models/ledger';
import { Transaction, TransactionMetadata } from '../../models/transactions';
export declare function hashSignedTx(tx: Transaction | string): string;
export declare function hashLedgerHeader(ledgerHeader: Ledger): string;
export declare function hashTxTree(transactions: Array<Transaction & {
    metaData?: TransactionMetadata;
}>): string;
export declare function hashStateTree(entries: LedgerEntry[]): string;
declare function hashLedger(ledger: Ledger, options?: {
    computeTreeHashes?: boolean;
}): string;
export default hashLedger;
//# sourceMappingURL=hashLedger.d.ts.map