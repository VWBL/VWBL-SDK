import type { Algorithm, HexString, KeyType } from '../types';
/**
 * Determines the algorithm associated with a given key (public/private).
 *
 * @param key - hexadecimal string representation of the key.
 * @param type - whether expected key is public or private
 * @returns Algorithm algorithm for signing/verifying
 * @throws Error when key is invalid
 */
export declare function getAlgorithmFromKey(key: HexString, type: KeyType): Algorithm;
export declare function getAlgorithmFromPublicKey(key: HexString): Algorithm;
export declare function getAlgorithmFromPrivateKey(key: HexString): Algorithm;
//# sourceMappingURL=getAlgorithmFromKey.d.ts.map