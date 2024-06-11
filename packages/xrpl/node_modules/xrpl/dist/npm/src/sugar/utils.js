"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureClassicAddress = void 0;
const ripple_address_codec_1 = require("ripple-address-codec");
function ensureClassicAddress(account) {
    if ((0, ripple_address_codec_1.isValidXAddress)(account)) {
        const { classicAddress, tag } = (0, ripple_address_codec_1.xAddressToClassicAddress)(account);
        if (tag !== false) {
            throw new Error('This command does not support the use of a tag. Use an address without a tag.');
        }
        return classicAddress;
    }
    return account;
}
exports.ensureClassicAddress = ensureClassicAddress;
//# sourceMappingURL=utils.js.map