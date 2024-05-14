import hashLedger, { hashLedgerHeader, hashSignedTx, hashTxTree, hashStateTree } from './hashLedger';
export declare function hashTx(txBlobHex: string): string;
export declare function hashAccountRoot(address: string): string;
export declare function hashSignerListId(address: string): string;
export declare function hashOfferId(address: string, sequence: number): string;
export declare function hashTrustline(address1: string, address2: string, currency: string): string;
export declare function hashEscrow(address: string, sequence: number): string;
export declare function hashPaymentChannel(address: string, dstAddress: string, sequence: number): string;
export { hashLedgerHeader, hashSignedTx, hashLedger, hashStateTree, hashTxTree };
//# sourceMappingURL=index.d.ts.map