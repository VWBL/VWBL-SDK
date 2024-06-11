import { Comparable } from './serialized-type';
/**
 * Base class for serializing and deserializing unsigned integers.
 */
declare abstract class UInt extends Comparable<UInt | number> {
    protected static width: number;
    constructor(bytes: Uint8Array);
    /**
     * Overload of compareTo for Comparable
     *
     * @param other other UInt to compare this to
     * @returns -1, 0, or 1 depending on how the objects relate to each other
     */
    compareTo(other: UInt | number): number;
    /**
     * Convert a UInt object to JSON
     *
     * @returns number or string represented by this.bytes
     */
    toJSON(): number | string;
    /**
     * Get the value of the UInt represented by this.bytes
     *
     * @returns the value
     */
    abstract valueOf(): number | bigint;
    static checkUintRange(val: number, min: number, max: number): void;
}
export { UInt };
