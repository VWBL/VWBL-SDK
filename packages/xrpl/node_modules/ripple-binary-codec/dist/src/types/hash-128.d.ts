import { Hash } from './hash';
/**
 * Hash with a width of 128 bits
 */
declare class Hash128 extends Hash {
    static readonly width = 16;
    static readonly ZERO_128: Hash128;
    constructor(bytes: Uint8Array);
    /**
     * Get the hex representation of a hash-128 bytes, allowing unset
     *
     * @returns hex String of this.bytes
     */
    toHex(): string;
}
export { Hash128 };
