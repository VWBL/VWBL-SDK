"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@noble/curves/abstract/utils");
const secp256k1_1 = require("@noble/curves/secp256k1");
const utils_2 = require("@xrplf/isomorphic/utils");
const utils_3 = require("./utils");
const assert_1 = __importDefault(require("../../utils/assert"));
const Sha512_1 = __importDefault(require("../../utils/Sha512"));
const SECP256K1_PREFIX = '00';
const secp256k1 = {
    deriveKeypair(entropy, options) {
        const derived = (0, utils_3.derivePrivateKey)(entropy, options);
        const privateKey = SECP256K1_PREFIX + (0, utils_2.bytesToHex)((0, utils_1.numberToBytesBE)(derived, 32));
        const publicKey = (0, utils_2.bytesToHex)(secp256k1_1.secp256k1.getPublicKey(derived, true));
        return { privateKey, publicKey };
    },
    sign(message, privateKey) {
        // Some callers pass the privateKey with the prefix, others without.
        // @noble/curves will throw if the key is not exactly 32 bytes, so we
        // normalize it before passing to the sign method.
        assert_1.default.ok((privateKey.length === 66 && privateKey.startsWith(SECP256K1_PREFIX)) ||
            privateKey.length === 64);
        const normedPrivateKey = privateKey.length === 66 ? privateKey.slice(2) : privateKey;
        return secp256k1_1.secp256k1
            .sign(Sha512_1.default.half(message), normedPrivateKey, {
            // "Canonical" signatures
            lowS: true,
            // Would fail tests if signatures aren't deterministic
            extraEntropy: undefined,
        })
            .toDERHex(true)
            .toUpperCase();
    },
    verify(message, signature, publicKey) {
        const decoded = secp256k1_1.secp256k1.Signature.fromDER(signature);
        return secp256k1_1.secp256k1.verify(decoded, Sha512_1.default.half(message), publicKey);
    },
};
exports.default = secp256k1;
//# sourceMappingURL=index.js.map