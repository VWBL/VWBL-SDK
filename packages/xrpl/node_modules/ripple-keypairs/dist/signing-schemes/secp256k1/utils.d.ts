/**
 * @param seed - Bytes.
 * @param [opts] - Object.
 * @param [opts.accountIndex=0] - The account number to generate.
 * @param [opts.validator=false] - Generate root key-pair,
 *                                              as used by validators.
 * @returns {bigint} 256 bit scalar value.
 *
 */
export declare function derivePrivateKey(seed: Uint8Array, opts?: {
    validator?: boolean;
    accountIndex?: number;
}): bigint;
export declare function accountPublicFromPublicGenerator(publicGenBytes: Uint8Array): Uint8Array;
//# sourceMappingURL=utils.d.ts.map