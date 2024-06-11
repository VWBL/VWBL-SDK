"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getXChainClaimID = exports.parseNFTokenID = exports.getNFTokenID = exports.encodeForSigningClaim = exports.encodeForSigning = exports.encodeForMultiSigning = exports.decode = exports.encode = exports.decodeXAddress = exports.encodeXAddress = exports.decodeAccountPublic = exports.encodeAccountPublic = exports.decodeNodePublic = exports.encodeNodePublic = exports.decodeAccountID = exports.encodeAccountID = exports.decodeSeed = exports.encodeSeed = exports.isValidClassicAddress = exports.isValidXAddress = exports.xAddressToClassicAddress = exports.classicAddressToXAddress = exports.convertHexToString = exports.convertStringToHex = exports.verifyPaymentChannelClaim = exports.verifyKeypairSignature = exports.signPaymentChannelClaim = exports.deriveXAddress = exports.deriveAddress = exports.deriveKeypair = exports.hashes = exports.isValidAddress = exports.isValidSecret = exports.qualityToDecimal = exports.transferRateToDecimal = exports.decimalToTransferRate = exports.percentToTransferRate = exports.decimalToQuality = exports.percentToQuality = exports.unixTimeToRippleTime = exports.rippleTimeToUnixTime = exports.isoTimeToRippleTime = exports.rippleTimeToISOTime = exports.hasNextPage = exports.xrpToDrops = exports.dropsToXrp = exports.getBalanceChanges = void 0;
const ripple_address_codec_1 = require("ripple-address-codec");
Object.defineProperty(exports, "classicAddressToXAddress", { enumerable: true, get: function () { return ripple_address_codec_1.classicAddressToXAddress; } });
Object.defineProperty(exports, "decodeAccountID", { enumerable: true, get: function () { return ripple_address_codec_1.decodeAccountID; } });
Object.defineProperty(exports, "decodeAccountPublic", { enumerable: true, get: function () { return ripple_address_codec_1.decodeAccountPublic; } });
Object.defineProperty(exports, "decodeNodePublic", { enumerable: true, get: function () { return ripple_address_codec_1.decodeNodePublic; } });
Object.defineProperty(exports, "decodeSeed", { enumerable: true, get: function () { return ripple_address_codec_1.decodeSeed; } });
Object.defineProperty(exports, "decodeXAddress", { enumerable: true, get: function () { return ripple_address_codec_1.decodeXAddress; } });
Object.defineProperty(exports, "encodeAccountID", { enumerable: true, get: function () { return ripple_address_codec_1.encodeAccountID; } });
Object.defineProperty(exports, "encodeAccountPublic", { enumerable: true, get: function () { return ripple_address_codec_1.encodeAccountPublic; } });
Object.defineProperty(exports, "encodeNodePublic", { enumerable: true, get: function () { return ripple_address_codec_1.encodeNodePublic; } });
Object.defineProperty(exports, "encodeSeed", { enumerable: true, get: function () { return ripple_address_codec_1.encodeSeed; } });
Object.defineProperty(exports, "encodeXAddress", { enumerable: true, get: function () { return ripple_address_codec_1.encodeXAddress; } });
Object.defineProperty(exports, "isValidClassicAddress", { enumerable: true, get: function () { return ripple_address_codec_1.isValidClassicAddress; } });
Object.defineProperty(exports, "isValidXAddress", { enumerable: true, get: function () { return ripple_address_codec_1.isValidXAddress; } });
Object.defineProperty(exports, "xAddressToClassicAddress", { enumerable: true, get: function () { return ripple_address_codec_1.xAddressToClassicAddress; } });
const ripple_binary_codec_1 = require("ripple-binary-codec");
const ripple_keypairs_1 = require("ripple-keypairs");
Object.defineProperty(exports, "verifyKeypairSignature", { enumerable: true, get: function () { return ripple_keypairs_1.verify; } });
const derive_1 = require("./derive");
Object.defineProperty(exports, "deriveKeypair", { enumerable: true, get: function () { return derive_1.deriveKeypair; } });
Object.defineProperty(exports, "deriveAddress", { enumerable: true, get: function () { return derive_1.deriveAddress; } });
Object.defineProperty(exports, "deriveXAddress", { enumerable: true, get: function () { return derive_1.deriveXAddress; } });
const getBalanceChanges_1 = __importDefault(require("./getBalanceChanges"));
exports.getBalanceChanges = getBalanceChanges_1.default;
const getNFTokenID_1 = __importDefault(require("./getNFTokenID"));
exports.getNFTokenID = getNFTokenID_1.default;
const getXChainClaimID_1 = __importDefault(require("./getXChainClaimID"));
exports.getXChainClaimID = getXChainClaimID_1.default;
const hashes_1 = require("./hashes");
const parseNFTokenID_1 = __importDefault(require("./parseNFTokenID"));
exports.parseNFTokenID = parseNFTokenID_1.default;
const quality_1 = require("./quality");
Object.defineProperty(exports, "percentToTransferRate", { enumerable: true, get: function () { return quality_1.percentToTransferRate; } });
Object.defineProperty(exports, "decimalToTransferRate", { enumerable: true, get: function () { return quality_1.decimalToTransferRate; } });
Object.defineProperty(exports, "transferRateToDecimal", { enumerable: true, get: function () { return quality_1.transferRateToDecimal; } });
Object.defineProperty(exports, "percentToQuality", { enumerable: true, get: function () { return quality_1.percentToQuality; } });
Object.defineProperty(exports, "decimalToQuality", { enumerable: true, get: function () { return quality_1.decimalToQuality; } });
Object.defineProperty(exports, "qualityToDecimal", { enumerable: true, get: function () { return quality_1.qualityToDecimal; } });
const signPaymentChannelClaim_1 = __importDefault(require("./signPaymentChannelClaim"));
exports.signPaymentChannelClaim = signPaymentChannelClaim_1.default;
const stringConversion_1 = require("./stringConversion");
Object.defineProperty(exports, "convertHexToString", { enumerable: true, get: function () { return stringConversion_1.convertHexToString; } });
Object.defineProperty(exports, "convertStringToHex", { enumerable: true, get: function () { return stringConversion_1.convertStringToHex; } });
const timeConversion_1 = require("./timeConversion");
Object.defineProperty(exports, "rippleTimeToISOTime", { enumerable: true, get: function () { return timeConversion_1.rippleTimeToISOTime; } });
Object.defineProperty(exports, "isoTimeToRippleTime", { enumerable: true, get: function () { return timeConversion_1.isoTimeToRippleTime; } });
Object.defineProperty(exports, "rippleTimeToUnixTime", { enumerable: true, get: function () { return timeConversion_1.rippleTimeToUnixTime; } });
Object.defineProperty(exports, "unixTimeToRippleTime", { enumerable: true, get: function () { return timeConversion_1.unixTimeToRippleTime; } });
const verifyPaymentChannelClaim_1 = __importDefault(require("./verifyPaymentChannelClaim"));
exports.verifyPaymentChannelClaim = verifyPaymentChannelClaim_1.default;
const xrpConversion_1 = require("./xrpConversion");
Object.defineProperty(exports, "xrpToDrops", { enumerable: true, get: function () { return xrpConversion_1.xrpToDrops; } });
Object.defineProperty(exports, "dropsToXrp", { enumerable: true, get: function () { return xrpConversion_1.dropsToXrp; } });
function isValidSecret(secret) {
    try {
        (0, derive_1.deriveKeypair)(secret);
        return true;
    }
    catch (_err) {
        return false;
    }
}
exports.isValidSecret = isValidSecret;
function encode(object) {
    return (0, ripple_binary_codec_1.encode)(object);
}
exports.encode = encode;
function encodeForSigning(object) {
    return (0, ripple_binary_codec_1.encodeForSigning)(object);
}
exports.encodeForSigning = encodeForSigning;
function encodeForSigningClaim(object) {
    return (0, ripple_binary_codec_1.encodeForSigningClaim)(object);
}
exports.encodeForSigningClaim = encodeForSigningClaim;
function encodeForMultiSigning(object, signer) {
    return (0, ripple_binary_codec_1.encodeForMultisigning)(object, signer);
}
exports.encodeForMultiSigning = encodeForMultiSigning;
function decode(hex) {
    return (0, ripple_binary_codec_1.decode)(hex);
}
exports.decode = decode;
function isValidAddress(address) {
    return (0, ripple_address_codec_1.isValidXAddress)(address) || (0, ripple_address_codec_1.isValidClassicAddress)(address);
}
exports.isValidAddress = isValidAddress;
function hasNextPage(response) {
    return Boolean(response.result['marker']);
}
exports.hasNextPage = hasNextPage;
const hashes = {
    hashSignedTx: hashes_1.hashSignedTx,
    hashTx: hashes_1.hashTx,
    hashAccountRoot: hashes_1.hashAccountRoot,
    hashSignerListId: hashes_1.hashSignerListId,
    hashOfferId: hashes_1.hashOfferId,
    hashTrustline: hashes_1.hashTrustline,
    hashTxTree: hashes_1.hashTxTree,
    hashStateTree: hashes_1.hashStateTree,
    hashLedger: hashes_1.hashLedger,
    hashLedgerHeader: hashes_1.hashLedgerHeader,
    hashEscrow: hashes_1.hashEscrow,
    hashPaymentChannel: hashes_1.hashPaymentChannel,
};
exports.hashes = hashes;
//# sourceMappingURL=index.js.map