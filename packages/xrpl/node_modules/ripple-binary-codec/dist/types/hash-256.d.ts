import { Hash } from './hash';
/**
 * Hash with a width of 256 bits
 */
declare class Hash256 extends Hash {
    static readonly width = 32;
    static readonly ZERO_256: Hash256;
    constructor(bytes: Uint8Array);
}
export { Hash256 };
