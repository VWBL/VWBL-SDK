import { CHash } from '@noble/hashes/utils';
import { HashFn } from './types';
/**
 * Wrap a CHash object from @noble/hashes to provide a interface that is isomorphic
 *
 * @param chash - {CHash} hash function to wrap
 */
export default function wrapNoble(chash: CHash): HashFn;
//# sourceMappingURL=wrapNoble.d.ts.map