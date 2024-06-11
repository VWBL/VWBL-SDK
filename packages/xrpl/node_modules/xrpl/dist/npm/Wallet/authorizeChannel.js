"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeChannel = void 0;
const ripple_binary_codec_1 = require("ripple-binary-codec");
const ripple_keypairs_1 = require("ripple-keypairs");
function authorizeChannel(wallet, channelId, amount) {
    const signingData = (0, ripple_binary_codec_1.encodeForSigningClaim)({
        channel: channelId,
        amount,
    });
    return (0, ripple_keypairs_1.sign)(signingData, wallet.privateKey);
}
exports.authorizeChannel = authorizeChannel;
//# sourceMappingURL=authorizeChannel.js.map