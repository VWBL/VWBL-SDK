import { Transaction } from '../models/transactions';
declare function multisign(transactions: Array<Transaction | string>): string;
declare function verifySignature(tx: Transaction | string, publicKey?: string): boolean;
export { verifySignature, multisign };
//# sourceMappingURL=signer.d.ts.map