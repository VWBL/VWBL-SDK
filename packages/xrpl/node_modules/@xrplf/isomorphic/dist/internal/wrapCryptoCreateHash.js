"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const normalizeInput_1 = __importDefault(require("./normalizeInput"));
/**
 * Wrap createHash from node to provide an interface that is isomorphic
 *
 * @param type - the hash name
 * @param fn - {createHash} the hash factory
 */
function wrapCryptoCreateHash(type, fn) {
    function hashFn(input) {
        return fn(type).update((0, normalizeInput_1.default)(input)).digest();
    }
    hashFn.create = () => {
        const hash = fn(type);
        return {
            update(input) {
                hash.update((0, normalizeInput_1.default)(input));
                return this;
            },
            digest() {
                return hash.digest();
            },
        };
    };
    return hashFn;
}
exports.default = wrapCryptoCreateHash;
//# sourceMappingURL=wrapCryptoCreateHash.js.map