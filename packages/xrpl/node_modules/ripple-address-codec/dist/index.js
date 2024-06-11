"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidXAddress = exports.decodeXAddress = exports.xAddressToClassicAddress = exports.encodeXAddress = exports.classicAddressToXAddress = exports.isValidClassicAddress = exports.decodeAccountPublic = exports.encodeAccountPublic = exports.decodeNodePublic = exports.encodeNodePublic = exports.decodeAccountID = exports.encodeAccountID = exports.decodeSeed = exports.encodeSeed = exports.codec = void 0;
const utils_1 = require("@xrplf/isomorphic/utils");
const xrp_codec_1 = require("./xrp-codec");
Object.defineProperty(exports, "codec", { enumerable: true, get: function () { return xrp_codec_1.codec; } });
Object.defineProperty(exports, "encodeSeed", { enumerable: true, get: function () { return xrp_codec_1.encodeSeed; } });
Object.defineProperty(exports, "decodeSeed", { enumerable: true, get: function () { return xrp_codec_1.decodeSeed; } });
Object.defineProperty(exports, "encodeAccountID", { enumerable: true, get: function () { return xrp_codec_1.encodeAccountID; } });
Object.defineProperty(exports, "decodeAccountID", { enumerable: true, get: function () { return xrp_codec_1.decodeAccountID; } });
Object.defineProperty(exports, "encodeNodePublic", { enumerable: true, get: function () { return xrp_codec_1.encodeNodePublic; } });
Object.defineProperty(exports, "decodeNodePublic", { enumerable: true, get: function () { return xrp_codec_1.decodeNodePublic; } });
Object.defineProperty(exports, "encodeAccountPublic", { enumerable: true, get: function () { return xrp_codec_1.encodeAccountPublic; } });
Object.defineProperty(exports, "decodeAccountPublic", { enumerable: true, get: function () { return xrp_codec_1.decodeAccountPublic; } });
Object.defineProperty(exports, "isValidClassicAddress", { enumerable: true, get: function () { return xrp_codec_1.isValidClassicAddress; } });
const PREFIX_BYTES = {
    // 5, 68
    main: Uint8Array.from([0x05, 0x44]),
    // 4, 147
    test: Uint8Array.from([0x04, 0x93]),
};
const MAX_32_BIT_UNSIGNED_INT = 4294967295;
function classicAddressToXAddress(classicAddress, tag, test) {
    const accountId = (0, xrp_codec_1.decodeAccountID)(classicAddress);
    return encodeXAddress(accountId, tag, test);
}
exports.classicAddressToXAddress = classicAddressToXAddress;
function encodeXAddress(accountId, tag, test) {
    if (accountId.length !== 20) {
        // RIPEMD160 is 160 bits = 20 bytes
        throw new Error('Account ID must be 20 bytes');
    }
    if (tag !== false && tag > MAX_32_BIT_UNSIGNED_INT) {
        throw new Error('Invalid tag');
    }
    const theTag = tag || 0;
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- Passing null is a common js mistake
    const flag = tag === false || tag == null ? 0 : 1;
    /* eslint-disable no-bitwise ---
     * need to use bitwise operations here */
    const bytes = (0, utils_1.concat)([
        test ? PREFIX_BYTES.test : PREFIX_BYTES.main,
        accountId,
        Uint8Array.from([
            // 0x00 if no tag, 0x01 if 32-bit tag
            flag,
            // first byte
            theTag & 0xff,
            // second byte
            (theTag >> 8) & 0xff,
            // third byte
            (theTag >> 16) & 0xff,
            // fourth byte
            (theTag >> 24) & 0xff,
            0,
            0,
            0,
            // four zero bytes (reserved for 64-bit tags)
            0,
        ]),
    ]);
    /* eslint-enable no-bitwise */
    return xrp_codec_1.codec.encodeChecked(bytes);
}
exports.encodeXAddress = encodeXAddress;
function xAddressToClassicAddress(xAddress) {
    /* eslint-disable @typescript-eslint/naming-convention --
     * TODO 'test' should be something like 'isTest', do this later
     */
    const { accountId, tag, test } = decodeXAddress(xAddress);
    /* eslint-enable @typescript-eslint/naming-convention */
    const classicAddress = (0, xrp_codec_1.encodeAccountID)(accountId);
    return {
        classicAddress,
        tag,
        test,
    };
}
exports.xAddressToClassicAddress = xAddressToClassicAddress;
function decodeXAddress(xAddress) {
    const decoded = xrp_codec_1.codec.decodeChecked(xAddress);
    /* eslint-disable @typescript-eslint/naming-convention --
     * TODO 'test' should be something like 'isTest', do this later
     */
    const test = isUint8ArrayForTestAddress(decoded);
    /* eslint-enable @typescript-eslint/naming-convention */
    const accountId = decoded.slice(2, 22);
    const tag = tagFromUint8Array(decoded);
    return {
        accountId,
        tag,
        test,
    };
}
exports.decodeXAddress = decodeXAddress;
function isUint8ArrayForTestAddress(buf) {
    const decodedPrefix = buf.slice(0, 2);
    if ((0, utils_1.equal)(PREFIX_BYTES.main, decodedPrefix)) {
        return false;
    }
    if ((0, utils_1.equal)(PREFIX_BYTES.test, decodedPrefix)) {
        return true;
    }
    throw new Error('Invalid X-address: bad prefix');
}
function tagFromUint8Array(buf) {
    const flag = buf[22];
    if (flag >= 2) {
        // No support for 64-bit tags at this time
        throw new Error('Unsupported X-address');
    }
    if (flag === 1) {
        // Little-endian to big-endian
        return buf[23] + buf[24] * 0x100 + buf[25] * 0x10000 + buf[26] * 0x1000000;
    }
    if (flag !== 0) {
        throw new Error('flag must be zero to indicate no tag');
    }
    if (!(0, utils_1.equal)((0, utils_1.hexToBytes)('0000000000000000'), buf.slice(23, 23 + 8))) {
        throw new Error('remaining bytes must be zero');
    }
    return false;
}
function isValidXAddress(xAddress) {
    try {
        decodeXAddress(xAddress);
    }
    catch (_error) {
        return false;
    }
    return true;
}
exports.isValidXAddress = isValidXAddress;
//# sourceMappingURL=index.js.map