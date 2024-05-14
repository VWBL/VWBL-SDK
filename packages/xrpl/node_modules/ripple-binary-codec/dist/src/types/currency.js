"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Currency = void 0;
const hash_160_1 = require("./hash-160");
const utils_1 = require("@xrplf/isomorphic/utils");
const XRP_HEX_REGEX = /^0{40}$/;
const ISO_REGEX = /^[A-Z0-9a-z?!@#$%^&*(){}[\]|]{3}$/;
const HEX_REGEX = /^[A-F0-9]{40}$/;
// eslint-disable-next-line no-control-regex
const STANDARD_FORMAT_HEX_REGEX = /^0{24}[\x00-\x7F]{6}0{10}$/;
/**
 * Convert an ISO code to a currency bytes representation
 */
function isoToBytes(iso) {
    const bytes = new Uint8Array(20);
    if (iso !== 'XRP') {
        const isoBytes = iso.split('').map((c) => c.charCodeAt(0));
        bytes.set(isoBytes, 12);
    }
    return bytes;
}
/**
 * Tests if ISO is a valid iso code
 */
function isIsoCode(iso) {
    return ISO_REGEX.test(iso);
}
function isoCodeFromHex(code) {
    const iso = (0, utils_1.hexToString)((0, utils_1.bytesToHex)(code));
    if (iso === 'XRP') {
        return null;
    }
    if (isIsoCode(iso)) {
        return iso;
    }
    return null;
}
/**
 * Tests if hex is a valid hex-string
 */
function isHex(hex) {
    return HEX_REGEX.test(hex);
}
/**
 * Tests if a string is a valid representation of a currency
 */
function isStringRepresentation(input) {
    return input.length === 3 || isHex(input);
}
/**
 * Tests if a Uint8Array is a valid representation of a currency
 */
function isBytesArray(bytes) {
    return bytes.byteLength === 20;
}
/**
 * Ensures that a value is a valid representation of a currency
 */
function isValidRepresentation(input) {
    return input instanceof Uint8Array
        ? isBytesArray(input)
        : isStringRepresentation(input);
}
/**
 * Generate bytes from a string or UInt8Array representation of a currency
 */
function bytesFromRepresentation(input) {
    if (!isValidRepresentation(input)) {
        throw new Error(`Unsupported Currency representation: ${input}`);
    }
    return input.length === 3 ? isoToBytes(input) : (0, utils_1.hexToBytes)(input);
}
/**
 * Class defining how to encode and decode Currencies
 */
class Currency extends hash_160_1.Hash160 {
    constructor(byteBuf) {
        super(byteBuf !== null && byteBuf !== void 0 ? byteBuf : Currency.XRP.bytes);
        const hex = (0, utils_1.bytesToHex)(this.bytes);
        if (XRP_HEX_REGEX.test(hex)) {
            this._iso = 'XRP';
        }
        else if (STANDARD_FORMAT_HEX_REGEX.test(hex)) {
            this._iso = isoCodeFromHex(this.bytes.slice(12, 15));
        }
        else {
            this._iso = null;
        }
    }
    /**
     * Return the ISO code of this currency
     *
     * @returns ISO code if it exists, else null
     */
    iso() {
        return this._iso;
    }
    /**
     * Constructs a Currency object
     *
     * @param val Currency object or a string representation of a currency
     */
    static from(value) {
        if (value instanceof Currency) {
            return value;
        }
        if (typeof value === 'string') {
            return new Currency(bytesFromRepresentation(value));
        }
        throw new Error('Cannot construct Currency from value given');
    }
    /**
     * Gets the JSON representation of a currency
     *
     * @returns JSON representation
     */
    toJSON() {
        const iso = this.iso();
        if (iso !== null) {
            return iso;
        }
        return (0, utils_1.bytesToHex)(this.bytes);
    }
}
exports.Currency = Currency;
Currency.XRP = new Currency(new Uint8Array(20));
//# sourceMappingURL=currency.js.map