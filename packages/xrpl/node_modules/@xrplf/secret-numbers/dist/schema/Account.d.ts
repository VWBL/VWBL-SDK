export interface Keypair {
    publicKey: string;
    privateKey: string;
}
export declare class Account {
    private readonly _secret;
    private readonly _account;
    constructor(secretNumbers?: string[] | string | Uint8Array);
    getSecret(): string[];
    getSecretString(): string;
    getAddress(): string;
    getFamilySeed(): string;
    getKeypair(): Keypair;
    toString(): string;
    private derive;
}
//# sourceMappingURL=Account.d.ts.map