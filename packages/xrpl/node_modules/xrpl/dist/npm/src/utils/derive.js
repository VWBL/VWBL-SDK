"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deriveXAddress = exports.deriveAddress = exports.deriveKeypair = void 0;
const ripple_address_codec_1 = require("ripple-address-codec");
const ripple_keypairs_1 = require("ripple-keypairs");
Object.defineProperty(exports, "deriveKeypair", { enumerable: true, get: function () { return ripple_keypairs_1.deriveKeypair; } });
Object.defineProperty(exports, "deriveAddress", { enumerable: true, get: function () { return ripple_keypairs_1.deriveAddress; } });
function deriveXAddress(options) {
    const classicAddress = (0, ripple_keypairs_1.deriveAddress)(options.publicKey);
    return (0, ripple_address_codec_1.classicAddressToXAddress)(classicAddress, options.tag, options.test);
}
exports.deriveXAddress = deriveXAddress;
//# sourceMappingURL=derive.js.map