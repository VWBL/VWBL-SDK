import { decodeSeed } from 'ripple-address-codec';
import type { Algorithm, HexString, KeyPair } from './types';
declare function generateSeed(options?: {
    entropy?: Uint8Array;
    algorithm?: Algorithm;
}): string;
declare function deriveKeypair(seed: string, options?: {
    algorithm?: Algorithm;
    validator?: boolean;
    accountIndex?: number;
}): KeyPair;
declare function sign(messageHex: HexString, privateKey: HexString): HexString;
declare function verify(messageHex: HexString, signature: HexString, publicKey: HexString): boolean;
declare function deriveAddress(publicKey: string): string;
declare function deriveNodeAddress(publicKey: string): string;
export { generateSeed, deriveKeypair, sign, verify, deriveAddress, deriveNodeAddress, decodeSeed, };
//# sourceMappingURL=index.d.ts.map