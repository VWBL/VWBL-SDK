"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.quality = void 0;
const types_1 = require("./types");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const utils_1 = require("@xrplf/isomorphic/utils");
/**
 * class for encoding and decoding quality
 */
class quality {
    /**
     * Encode quality amount
     *
     * @param arg string representation of an amount
     * @returns Serialized quality
     */
    static encode(quality) {
        const decimal = (0, bignumber_js_1.default)(quality);
        const exponent = ((decimal === null || decimal === void 0 ? void 0 : decimal.e) || 0) - 15;
        const qualityString = decimal.times(`1e${-exponent}`).abs().toString();
        const bytes = types_1.coreTypes.UInt64.from(BigInt(qualityString)).toBytes();
        bytes[0] = exponent + 100;
        return bytes;
    }
    /**
     * Decode quality amount
     *
     * @param arg hex-string denoting serialized quality
     * @returns deserialized quality
     */
    static decode(quality) {
        const bytes = (0, utils_1.hexToBytes)(quality).slice(-8);
        const exponent = bytes[0] - 100;
        const mantissa = new bignumber_js_1.default(`0x${(0, utils_1.bytesToHex)(bytes.slice(1))}`);
        return mantissa.times(`1e${exponent}`);
    }
}
exports.quality = quality;
//# sourceMappingURL=quality.js.map