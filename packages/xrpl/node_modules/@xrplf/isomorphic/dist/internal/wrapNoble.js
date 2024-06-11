"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const normalizeInput_1 = __importDefault(require("./normalizeInput"));
/**
 * Wrap a CHash object from @noble/hashes to provide a interface that is isomorphic
 *
 * @param chash - {CHash} hash function to wrap
 */
function wrapNoble(chash) {
    function wrapped(input) {
        return chash((0, normalizeInput_1.default)(input));
    }
    wrapped.create = () => {
        const hash = chash.create();
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
    return wrapped;
}
exports.default = wrapNoble;
//# sourceMappingURL=wrapNoble.js.map