"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wallet = void 0;
const bip32_1 = require("@scure/bip32");
const bip39_1 = require("@scure/bip39");
const english_1 = require("@scure/bip39/wordlists/english");
const utils_1 = require("@xrplf/isomorphic/utils");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const ripple_address_codec_1 = require("ripple-address-codec");
const ripple_binary_codec_1 = require("ripple-binary-codec");
const ripple_keypairs_1 = require("ripple-keypairs");
const ECDSA_1 = __importDefault(require("../ECDSA"));
const errors_1 = require("../errors");
const transactions_1 = require("../models/transactions");
const utils_2 = require("../sugar/utils");
const collections_1 = require("../utils/collections");
const hashLedger_1 = require("../utils/hashes/hashLedger");
const rfc1751_1 = require("./rfc1751");
const signer_1 = require("./signer");
const DEFAULT_ALGORITHM = ECDSA_1.default.ed25519;
const DEFAULT_DERIVATION_PATH = "m/44'/144'/0'/0/0";
function validateKey(node) {
    if (!(node.privateKey instanceof Uint8Array)) {
        throw new errors_1.ValidationError('Unable to derive privateKey from mnemonic input');
    }
    if (!(node.publicKey instanceof Uint8Array)) {
        throw new errors_1.ValidationError('Unable to derive publicKey from mnemonic input');
    }
}
class Wallet {
    constructor(publicKey, privateKey, opts = {}) {
        this.publicKey = publicKey;
        this.privateKey = privateKey;
        this.classicAddress = opts.masterAddress
            ? (0, utils_2.ensureClassicAddress)(opts.masterAddress)
            : (0, ripple_keypairs_1.deriveAddress)(publicKey);
        this.seed = opts.seed;
    }
    get address() {
        return this.classicAddress;
    }
    static generate(algorithm = DEFAULT_ALGORITHM) {
        if (!Object.values(ECDSA_1.default).includes(algorithm)) {
            throw new errors_1.ValidationError('Invalid cryptographic signing algorithm');
        }
        const seed = (0, ripple_keypairs_1.generateSeed)({ algorithm });
        return Wallet.fromSeed(seed, { algorithm });
    }
    static fromSeed(seed, opts = {}) {
        return Wallet.deriveWallet(seed, {
            algorithm: opts.algorithm,
            masterAddress: opts.masterAddress,
        });
    }
    static fromEntropy(entropy, opts = {}) {
        var _a;
        const algorithm = (_a = opts.algorithm) !== null && _a !== void 0 ? _a : DEFAULT_ALGORITHM;
        const options = {
            entropy: Uint8Array.from(entropy),
            algorithm,
        };
        const seed = (0, ripple_keypairs_1.generateSeed)(options);
        return Wallet.deriveWallet(seed, {
            algorithm,
            masterAddress: opts.masterAddress,
        });
    }
    static fromMnemonic(mnemonic, opts = {}) {
        var _a;
        if (opts.mnemonicEncoding === 'rfc1751') {
            return Wallet.fromRFC1751Mnemonic(mnemonic, {
                masterAddress: opts.masterAddress,
                algorithm: opts.algorithm,
            });
        }
        if (!(0, bip39_1.validateMnemonic)(mnemonic, english_1.wordlist)) {
            throw new errors_1.ValidationError('Unable to parse the given mnemonic using bip39 encoding');
        }
        const seed = (0, bip39_1.mnemonicToSeedSync)(mnemonic);
        const masterNode = bip32_1.HDKey.fromMasterSeed(seed);
        const node = masterNode.derive((_a = opts.derivationPath) !== null && _a !== void 0 ? _a : DEFAULT_DERIVATION_PATH);
        validateKey(node);
        const publicKey = (0, utils_1.bytesToHex)(node.publicKey);
        const privateKey = (0, utils_1.bytesToHex)(node.privateKey);
        return new Wallet(publicKey, `00${privateKey}`, {
            masterAddress: opts.masterAddress,
        });
    }
    static fromRFC1751Mnemonic(mnemonic, opts) {
        const seed = (0, rfc1751_1.rfc1751MnemonicToKey)(mnemonic);
        let encodeAlgorithm;
        if (opts.algorithm === ECDSA_1.default.ed25519) {
            encodeAlgorithm = 'ed25519';
        }
        else {
            encodeAlgorithm = 'secp256k1';
        }
        const encodedSeed = (0, ripple_address_codec_1.encodeSeed)(seed, encodeAlgorithm);
        return Wallet.fromSeed(encodedSeed, {
            masterAddress: opts.masterAddress,
            algorithm: opts.algorithm,
        });
    }
    static deriveWallet(seed, opts = {}) {
        var _a;
        const { publicKey, privateKey } = (0, ripple_keypairs_1.deriveKeypair)(seed, {
            algorithm: (_a = opts.algorithm) !== null && _a !== void 0 ? _a : DEFAULT_ALGORITHM,
        });
        return new Wallet(publicKey, privateKey, {
            seed,
            masterAddress: opts.masterAddress,
        });
    }
    sign(transaction, multisign) {
        let multisignAddress = false;
        if (typeof multisign === 'string' && multisign.startsWith('X')) {
            multisignAddress = multisign;
        }
        else if (multisign) {
            multisignAddress = this.classicAddress;
        }
        const tx = (0, collections_1.omitBy)(Object.assign({}, transaction), (value) => value == null);
        if (tx.TxnSignature || tx.Signers) {
            throw new errors_1.ValidationError('txJSON must not contain "TxnSignature" or "Signers" properties');
        }
        removeTrailingZeros(tx);
        (0, transactions_1.validate)(tx);
        const txToSignAndEncode = Object.assign({}, tx);
        txToSignAndEncode.SigningPubKey = multisignAddress ? '' : this.publicKey;
        if (multisignAddress) {
            const signer = {
                Account: multisignAddress,
                SigningPubKey: this.publicKey,
                TxnSignature: computeSignature(txToSignAndEncode, this.privateKey, multisignAddress),
            };
            txToSignAndEncode.Signers = [{ Signer: signer }];
        }
        else {
            txToSignAndEncode.TxnSignature = computeSignature(txToSignAndEncode, this.privateKey);
        }
        const serialized = (0, ripple_binary_codec_1.encode)(txToSignAndEncode);
        return {
            tx_blob: serialized,
            hash: (0, hashLedger_1.hashSignedTx)(serialized),
        };
    }
    verifyTransaction(signedTransaction) {
        return (0, signer_1.verifySignature)(signedTransaction, this.publicKey);
    }
    getXAddress(tag = false, isTestnet = false) {
        return (0, ripple_address_codec_1.classicAddressToXAddress)(this.classicAddress, tag, isTestnet);
    }
}
exports.Wallet = Wallet;
Wallet.fromSecret = Wallet.fromSeed;
function computeSignature(tx, privateKey, signAs) {
    if (signAs) {
        const classicAddress = (0, ripple_address_codec_1.isValidXAddress)(signAs)
            ? (0, ripple_address_codec_1.xAddressToClassicAddress)(signAs).classicAddress
            : signAs;
        return (0, ripple_keypairs_1.sign)((0, ripple_binary_codec_1.encodeForMultisigning)(tx, classicAddress), privateKey);
    }
    return (0, ripple_keypairs_1.sign)((0, ripple_binary_codec_1.encodeForSigning)(tx), privateKey);
}
function removeTrailingZeros(tx) {
    if (tx.TransactionType === 'Payment' &&
        typeof tx.Amount !== 'string' &&
        tx.Amount.value.includes('.') &&
        tx.Amount.value.endsWith('0')) {
        tx.Amount = Object.assign({}, tx.Amount);
        tx.Amount.value = new bignumber_js_1.default(tx.Amount.value).toString();
    }
}
//# sourceMappingURL=index.js.map