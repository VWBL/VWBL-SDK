"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ripple_binary_codec_1 = require("ripple-binary-codec");
const ripple_keypairs_1 = require("ripple-keypairs");
const xrpConversion_1 = require("./xrpConversion");
function verifyPaymentChannelClaim(channel, xrpAmount, signature, publicKey) {
    const signingData = (0, ripple_binary_codec_1.encodeForSigningClaim)({
        channel,
        amount: (0, xrpConversion_1.xrpToDrops)(xrpAmount),
    });
    return (0, ripple_keypairs_1.verify)(signingData, signature, publicKey);
}
exports.default = verifyPaymentChannelClaim;
//# sourceMappingURL=verifyPaymentChannelClaim.js.map