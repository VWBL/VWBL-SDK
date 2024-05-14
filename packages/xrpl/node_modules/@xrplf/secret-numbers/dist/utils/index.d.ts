declare function randomEntropy(): Uint8Array;
declare function calculateChecksum(position: number, value: number): number;
declare function checkChecksum(position: number, value: number | string, checksum?: number): boolean;
declare function entropyToSecret(entropy: Uint8Array): string[];
declare function randomSecret(): string[];
declare function secretToEntropy(secret: string[]): Uint8Array;
declare function parseSecretString(secret: string): string[];
export { randomEntropy, randomSecret, entropyToSecret, secretToEntropy, calculateChecksum, checkChecksum, parseSecretString, };
//# sourceMappingURL=index.d.ts.map