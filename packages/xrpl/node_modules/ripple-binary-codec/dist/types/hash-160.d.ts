import { Hash } from './hash';
/**
 * Hash with a width of 160 bits
 */
declare class Hash160 extends Hash {
    static readonly width = 20;
    static readonly ZERO_160: Hash160;
    constructor(bytes?: Uint8Array);
}
export { Hash160 };
