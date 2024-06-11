"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountID = void 0;
const ripple_address_codec_1 = require("ripple-address-codec");
const hash_160_1 = require("./hash-160");
const utils_1 = require("@xrplf/isomorphic/utils");
const HEX_REGEX = /^[A-F0-9]{40}$/;
/**
 * Class defining how to encode and decode an AccountID
 */
class AccountID extends hash_160_1.Hash160 {
    constructor(bytes) {
        super(bytes !== null && bytes !== void 0 ? bytes : AccountID.defaultAccountID.bytes);
    }
    /**
     * Defines how to construct an AccountID
     *
     * @param value either an existing AccountID, a hex-string, or a base58 r-Address
     * @returns an AccountID object
     */
    static from(value) {
        if (value instanceof AccountID) {
            return value;
        }
        if (typeof value === 'string') {
            if (value === '') {
                return new AccountID();
            }
            return HEX_REGEX.test(value)
                ? new AccountID((0, utils_1.hexToBytes)(value))
                : this.fromBase58(value);
        }
        throw new Error('Cannot construct AccountID from value given');
    }
    /**
     * Defines how to build an AccountID from a base58 r-Address
     *
     * @param value a base58 r-Address
     * @returns an AccountID object
     */
    static fromBase58(value) {
        if ((0, ripple_address_codec_1.isValidXAddress)(value)) {
            const classic = (0, ripple_address_codec_1.xAddressToClassicAddress)(value);
            if (classic.tag !== false)
                throw new Error('Only allowed to have tag on Account or Destination');
            value = classic.classicAddress;
        }
        return new AccountID(Uint8Array.from((0, ripple_address_codec_1.decodeAccountID)(value)));
    }
    /**
     * Overload of toJSON
     *
     * @returns the base58 string for this AccountID
     */
    toJSON() {
        return this.toBase58();
    }
    /**
     * Defines how to encode AccountID into a base58 address
     *
     * @returns the base58 string defined by this.bytes
     */
    toBase58() {
        return (0, ripple_address_codec_1.encodeAccountID)(this.bytes);
    }
}
exports.AccountID = AccountID;
AccountID.defaultAccountID = new AccountID(new Uint8Array(20));
//# sourceMappingURL=account-id.js.map