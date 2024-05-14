"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashTxTree = exports.hashStateTree = exports.hashLedger = exports.hashSignedTx = exports.hashLedgerHeader = exports.hashPaymentChannel = exports.hashEscrow = exports.hashTrustline = exports.hashOfferId = exports.hashSignerListId = exports.hashAccountRoot = exports.hashTx = void 0;
const utils_1 = require("@xrplf/isomorphic/utils");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const ripple_address_codec_1 = require("ripple-address-codec");
const hashLedger_1 = __importStar(require("./hashLedger"));
exports.hashLedger = hashLedger_1.default;
Object.defineProperty(exports, "hashLedgerHeader", { enumerable: true, get: function () { return hashLedger_1.hashLedgerHeader; } });
Object.defineProperty(exports, "hashSignedTx", { enumerable: true, get: function () { return hashLedger_1.hashSignedTx; } });
Object.defineProperty(exports, "hashTxTree", { enumerable: true, get: function () { return hashLedger_1.hashTxTree; } });
Object.defineProperty(exports, "hashStateTree", { enumerable: true, get: function () { return hashLedger_1.hashStateTree; } });
const HashPrefix_1 = __importDefault(require("./HashPrefix"));
const ledgerSpaces_1 = __importDefault(require("./ledgerSpaces"));
const sha512Half_1 = __importDefault(require("./sha512Half"));
const HEX = 16;
const BYTE_LENGTH = 4;
function addressToHex(address) {
    return (0, utils_1.bytesToHex)((0, ripple_address_codec_1.decodeAccountID)(address));
}
function ledgerSpaceHex(name) {
    return ledgerSpaces_1.default[name].charCodeAt(0).toString(HEX).padStart(4, '0');
}
const MASK = 0xff;
function currencyToHex(currency) {
    if (currency.length !== 3) {
        return currency;
    }
    const bytes = Array(20).fill(0);
    bytes[12] = currency.charCodeAt(0) & MASK;
    bytes[13] = currency.charCodeAt(1) & MASK;
    bytes[14] = currency.charCodeAt(2) & MASK;
    return (0, utils_1.bytesToHex)(Uint8Array.from(bytes));
}
function hashTx(txBlobHex) {
    const prefix = HashPrefix_1.default.TRANSACTION_SIGN.toString(HEX).toUpperCase();
    return (0, sha512Half_1.default)(prefix + txBlobHex);
}
exports.hashTx = hashTx;
function hashAccountRoot(address) {
    return (0, sha512Half_1.default)(ledgerSpaceHex('account') + addressToHex(address));
}
exports.hashAccountRoot = hashAccountRoot;
function hashSignerListId(address) {
    return (0, sha512Half_1.default)(`${ledgerSpaceHex('signerList') + addressToHex(address)}00000000`);
}
exports.hashSignerListId = hashSignerListId;
function hashOfferId(address, sequence) {
    const hexPrefix = ledgerSpaces_1.default.offer
        .charCodeAt(0)
        .toString(HEX)
        .padStart(2, '0');
    const hexSequence = sequence.toString(HEX).padStart(8, '0');
    const prefix = `00${hexPrefix}`;
    return (0, sha512Half_1.default)(prefix + addressToHex(address) + hexSequence);
}
exports.hashOfferId = hashOfferId;
function hashTrustline(address1, address2, currency) {
    const address1Hex = addressToHex(address1);
    const address2Hex = addressToHex(address2);
    const swap = new bignumber_js_1.default(address1Hex, 16).isGreaterThan(new bignumber_js_1.default(address2Hex, 16));
    const lowAddressHex = swap ? address2Hex : address1Hex;
    const highAddressHex = swap ? address1Hex : address2Hex;
    const prefix = ledgerSpaceHex('rippleState');
    return (0, sha512Half_1.default)(prefix + lowAddressHex + highAddressHex + currencyToHex(currency));
}
exports.hashTrustline = hashTrustline;
function hashEscrow(address, sequence) {
    return (0, sha512Half_1.default)(ledgerSpaceHex('escrow') +
        addressToHex(address) +
        sequence.toString(HEX).padStart(BYTE_LENGTH * 2, '0'));
}
exports.hashEscrow = hashEscrow;
function hashPaymentChannel(address, dstAddress, sequence) {
    return (0, sha512Half_1.default)(ledgerSpaceHex('paychan') +
        addressToHex(address) +
        addressToHex(dstAddress) +
        sequence.toString(HEX).padStart(BYTE_LENGTH * 2, '0'));
}
exports.hashPaymentChannel = hashPaymentChannel;
//# sourceMappingURL=index.js.map