/// <reference types="node" />
import { createHash } from 'crypto';
import { HashFn } from './types';
/**
 * Wrap createHash from node to provide an interface that is isomorphic
 *
 * @param type - the hash name
 * @param fn - {createHash} the hash factory
 */
export default function wrapCryptoCreateHash(type: string, fn: typeof createHash): HashFn;
//# sourceMappingURL=wrapCryptoCreateHash.d.ts.map