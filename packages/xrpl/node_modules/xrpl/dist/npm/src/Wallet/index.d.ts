import ECDSA from '../ECDSA';
import { Transaction } from '../models/transactions';
export declare class Wallet {
    readonly publicKey: string;
    readonly privateKey: string;
    readonly classicAddress: string;
    readonly seed?: string;
    constructor(publicKey: string, privateKey: string, opts?: {
        masterAddress?: string;
        seed?: string;
    });
    get address(): string;
    static generate(algorithm?: ECDSA): Wallet;
    static fromSeed(seed: string, opts?: {
        masterAddress?: string;
        algorithm?: ECDSA;
    }): Wallet;
    static fromSecret: typeof Wallet.fromSeed;
    static fromEntropy(entropy: Uint8Array | number[], opts?: {
        masterAddress?: string;
        algorithm?: ECDSA;
    }): Wallet;
    static fromMnemonic(mnemonic: string, opts?: {
        masterAddress?: string;
        derivationPath?: string;
        mnemonicEncoding?: 'bip39' | 'rfc1751';
        algorithm?: ECDSA;
    }): Wallet;
    private static fromRFC1751Mnemonic;
    private static deriveWallet;
    sign(this: Wallet, transaction: Transaction, multisign?: boolean | string): {
        tx_blob: string;
        hash: string;
    };
    verifyTransaction(signedTransaction: Transaction | string): boolean;
    getXAddress(tag?: number | false, isTestnet?: boolean): string;
}
//# sourceMappingURL=index.d.ts.map