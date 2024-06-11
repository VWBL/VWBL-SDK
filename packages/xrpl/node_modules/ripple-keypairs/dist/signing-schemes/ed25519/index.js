"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ed25519_1 = require("@noble/curves/ed25519");
const utils_1 = require("@xrplf/isomorphic/utils");
const assert_1 = __importDefault(require("../../utils/assert"));
const Sha512_1 = __importDefault(require("../../utils/Sha512"));
const ED_PREFIX = 'ED';
const ed25519 = {
    deriveKeypair(entropy) {
        const rawPrivateKey = Sha512_1.default.half(entropy);
        const privateKey = ED_PREFIX + (0, utils_1.bytesToHex)(rawPrivateKey);
        const publicKey = ED_PREFIX + (0, utils_1.bytesToHex)(ed25519_1.ed25519.getPublicKey(rawPrivateKey));
        return { privateKey, publicKey };
    },
    sign(message, privateKey) {
        assert_1.default.ok(message instanceof Uint8Array, 'message must be array of octets');
        assert_1.default.ok(privateKey.length === 66, 'private key must be 33 bytes including prefix');
        return (0, utils_1.bytesToHex)(ed25519_1.ed25519.sign(message, privateKey.slice(2)));
    },
    verify(message, signature, publicKey) {
        // Unlikely to be triggered as these are internal and guarded by getAlgorithmFromKey
        assert_1.default.ok(publicKey.length === 66, 'public key must be 33 bytes including prefix');
        return ed25519_1.ed25519.verify(signature, message, 
        // Remove the 0xED prefix
        publicKey.slice(2), 
        // By default, set zip215 to false for compatibility reasons.
        // ZIP 215 is a stricter Ed25519 signature verification scheme.
        // However, setting it to false adheres to the more commonly used
        // RFC8032 / NIST186-5 standards, making it compatible with systems
        // like the XRP Ledger.
        { zip215: false });
    },
};
exports.default = ed25519;
//# sourceMappingURL=index.js.map