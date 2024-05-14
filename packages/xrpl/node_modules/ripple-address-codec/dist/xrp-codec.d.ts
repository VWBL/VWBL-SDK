/**
 * Codec class
 */
import { ByteArray } from './utils';
declare class Codec {
    private readonly _sha256;
    private readonly _codec;
    constructor(options: {
        sha256: (bytes: ByteArray) => Uint8Array;
    });
    /**
     * Encoder.
     *
     * @param bytes - Uint8Array of data to encode.
     * @param opts - Options object including the version bytes and the expected length of the data to encode.
     */
    encode(bytes: ByteArray, opts: {
        versions: number[];
        expectedLength: number;
    }): string;
    /**
     * Decoder.
     *
     * @param base58string - Base58Check-encoded string to decode.
     * @param opts - Options object including the version byte(s) and the expected length of the data after decoding.
     */
    decode(base58string: string, opts: {
        versions: Array<number | number[]>;
        expectedLength?: number;
        versionTypes?: ['ed25519', 'secp256k1'];
    }): {
        version: number[];
        bytes: Uint8Array;
        type: 'ed25519' | 'secp256k1' | null;
    };
    encodeChecked(bytes: ByteArray): string;
    decodeChecked(base58string: string): Uint8Array;
    private _encodeVersioned;
    private _encodeRaw;
    private _decodeRaw;
    private _verifyCheckSum;
}
export declare const codec: Codec;
export declare function encodeSeed(entropy: ByteArray, type: 'ed25519' | 'secp256k1'): string;
export declare function decodeSeed(seed: string, opts?: {
    versionTypes: ['ed25519', 'secp256k1'];
    versions: Array<number | number[]>;
    expectedLength: number;
}): {
    version: number[];
    bytes: Uint8Array;
    type: 'ed25519' | 'secp256k1' | null;
};
export declare function encodeAccountID(bytes: ByteArray): string;
export declare const encodeAddress: typeof encodeAccountID;
export declare function decodeAccountID(accountId: string): Uint8Array;
export declare const decodeAddress: typeof decodeAccountID;
export declare function decodeNodePublic(base58string: string): Uint8Array;
export declare function encodeNodePublic(bytes: ByteArray): string;
export declare function encodeAccountPublic(bytes: ByteArray): string;
export declare function decodeAccountPublic(base58string: string): Uint8Array;
export declare function isValidClassicAddress(address: string): boolean;
export {};
