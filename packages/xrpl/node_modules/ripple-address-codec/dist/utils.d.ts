export type ByteArray = number[] | Uint8Array;
/**
 * Check whether two sequences (e.g. Arrays of numbers) are equal.
 *
 * @param arr1 - One of the arrays to compare.
 * @param arr2 - The other array to compare.
 */
export declare function arrayEqual(arr1: ByteArray, arr2: ByteArray): boolean;
/**
 * Concatenate all `arguments` into a single array. Each argument can be either
 * a single element or a sequence, which has a `length` property and supports
 * element retrieval via sequence[ix].
 *
 * > concatArgs(1, [2, 3], Uint8Array.from([4,5]), new Uint8Array([6, 7]));
 * [1,2,3,4,5,6,7]
 *
 * @param args - Concatenate of these args into a single array.
 * @returns Array of concatenated arguments
 */
export declare function concatArgs(...args: Array<number | ByteArray>): number[];
