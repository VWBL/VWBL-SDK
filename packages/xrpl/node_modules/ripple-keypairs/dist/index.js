"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeSeed = exports.deriveNodeAddress = exports.deriveAddress = exports.verify = exports.sign = exports.deriveKeypair = exports.generateSeed = void 0;
const ripple_address_codec_1 = require("ripple-address-codec");
Object.defineProperty(exports, "decodeSeed", { enumerable: true, get: function () { return ripple_address_codec_1.decodeSeed; } });
const ripemd160_1 = require("@xrplf/isomorphic/ripemd160");
const sha256_1 = require("@xrplf/isomorphic/sha256");
const utils_1 = require("@xrplf/isomorphic/utils");
const utils_2 = require("./signing-schemes/secp256k1/utils");
const Sha512_1 = __importDefault(require("./utils/Sha512"));
const assert_1 = __importDefault(require("./utils/assert"));
const getAlgorithmFromKey_1 = require("./utils/getAlgorithmFromKey");
const secp256k1_1 = __importDefault(require("./signing-schemes/secp256k1"));
const ed25519_1 = __importDefault(require("./signing-schemes/ed25519"));
function getSigningScheme(algorithm) {
    const schemes = { 'ecdsa-secp256k1': secp256k1_1.default, ed25519: ed25519_1.default };
    return schemes[algorithm];
}
function generateSeed(options = {}) {
    assert_1.default.ok(!options.entropy || options.entropy.length >= 16, 'entropy too short');
    const entropy = options.entropy
        ? options.entropy.slice(0, 16)
        : (0, utils_1.randomBytes)(16);
    const type = options.algorithm === 'ed25519' ? 'ed25519' : 'secp256k1';
    return (0, ripple_address_codec_1.encodeSeed)(entropy, type);
}
exports.generateSeed = generateSeed;
function deriveKeypair(seed, options) {
    var _a;
    const decoded = (0, ripple_address_codec_1.decodeSeed)(seed);
    const proposedAlgorithm = (_a = options === null || options === void 0 ? void 0 : options.algorithm) !== null && _a !== void 0 ? _a : decoded.type;
    const algorithm = proposedAlgorithm === 'ed25519' ? 'ed25519' : 'ecdsa-secp256k1';
    const scheme = getSigningScheme(algorithm);
    const keypair = scheme.deriveKeypair(decoded.bytes, options);
    const messageToVerify = Sha512_1.default.half('This test message should verify.');
    const signature = scheme.sign(messageToVerify, keypair.privateKey);
    /* istanbul ignore if */
    if (!scheme.verify(messageToVerify, signature, keypair.publicKey)) {
        throw new Error('derived keypair did not generate verifiable signature');
    }
    return keypair;
}
exports.deriveKeypair = deriveKeypair;
function sign(messageHex, privateKey) {
    const algorithm = (0, getAlgorithmFromKey_1.getAlgorithmFromPrivateKey)(privateKey);
    return getSigningScheme(algorithm).sign((0, utils_1.hexToBytes)(messageHex), privateKey);
}
exports.sign = sign;
function verify(messageHex, signature, publicKey) {
    const algorithm = (0, getAlgorithmFromKey_1.getAlgorithmFromPublicKey)(publicKey);
    return getSigningScheme(algorithm).verify((0, utils_1.hexToBytes)(messageHex), signature, publicKey);
}
exports.verify = verify;
function computePublicKeyHash(publicKeyBytes) {
    return (0, ripemd160_1.ripemd160)((0, sha256_1.sha256)(publicKeyBytes));
}
function deriveAddressFromBytes(publicKeyBytes) {
    return (0, ripple_address_codec_1.encodeAccountID)(computePublicKeyHash(publicKeyBytes));
}
function deriveAddress(publicKey) {
    return deriveAddressFromBytes((0, utils_1.hexToBytes)(publicKey));
}
exports.deriveAddress = deriveAddress;
function deriveNodeAddress(publicKey) {
    const generatorBytes = (0, ripple_address_codec_1.decodeNodePublic)(publicKey);
    const accountPublicBytes = (0, utils_2.accountPublicFromPublicGenerator)(generatorBytes);
    return deriveAddressFromBytes(accountPublicBytes);
}
exports.deriveNodeAddress = deriveNodeAddress;
//# sourceMappingURL=index.js.map