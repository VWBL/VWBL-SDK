import type { Client, SubmitResponse, SubmittableTransaction, Transaction, Wallet } from '..';
import { TxResponse } from '../models/methods';
import { BaseTransaction } from '../models/transactions/common';
export declare function submitRequest(client: Client, signedTransaction: SubmittableTransaction | string, failHard?: boolean): Promise<SubmitResponse>;
export declare function waitForFinalTransactionOutcome<T extends BaseTransaction = SubmittableTransaction>(client: Client, txHash: string, lastLedger: number, submissionResult: string): Promise<TxResponse<T>>;
export declare function getSignedTx(client: Client, transaction: SubmittableTransaction | string, { autofill, wallet, }?: {
    autofill?: boolean;
    wallet?: Wallet;
}): Promise<SubmittableTransaction | string>;
export declare function getLastLedgerSequence(transaction: Transaction | string): number | null;
//# sourceMappingURL=submit.d.ts.map