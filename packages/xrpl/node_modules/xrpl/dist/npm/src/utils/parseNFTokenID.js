"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@xrplf/isomorphic/utils");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const ripple_address_codec_1 = require("ripple-address-codec");
const errors_1 = require("../errors");
function unscrambleTaxon(taxon, tokenSeq) {
    const seed = 384160001;
    const increment = 2459;
    const max = 4294967296;
    const scramble = new bignumber_js_1.default(seed)
        .multipliedBy(tokenSeq)
        .modulo(max)
        .plus(increment)
        .modulo(max)
        .toNumber();
    return (taxon ^ scramble) >>> 0;
}
function parseNFTokenID(nftokenID) {
    const expectedLength = 64;
    if (nftokenID.length !== expectedLength) {
        throw new errors_1.XrplError(`Attempting to parse a nftokenID with length ${nftokenID.length}
    , but expected a token with length ${expectedLength}`);
    }
    const scrambledTaxon = new bignumber_js_1.default(nftokenID.substring(48, 56), 16).toNumber();
    const sequence = new bignumber_js_1.default(nftokenID.substring(56, 64), 16).toNumber();
    const NFTokenIDData = {
        NFTokenID: nftokenID,
        Flags: new bignumber_js_1.default(nftokenID.substring(0, 4), 16).toNumber(),
        TransferFee: new bignumber_js_1.default(nftokenID.substring(4, 8), 16).toNumber(),
        Issuer: (0, ripple_address_codec_1.encodeAccountID)((0, utils_1.hexToBytes)(nftokenID.substring(8, 48))),
        Taxon: unscrambleTaxon(scrambledTaxon, sequence),
        Sequence: sequence,
    };
    return NFTokenIDData;
}
exports.default = parseNFTokenID;
//# sourceMappingURL=parseNFTokenID.js.map