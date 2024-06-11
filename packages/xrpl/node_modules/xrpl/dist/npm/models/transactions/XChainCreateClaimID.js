"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateXChainCreateClaimID = void 0;
const common_1 = require("./common");
function validateXChainCreateClaimID(tx) {
    (0, common_1.validateBaseTransaction)(tx);
    (0, common_1.validateRequiredField)(tx, 'XChainBridge', common_1.isXChainBridge);
    (0, common_1.validateRequiredField)(tx, 'SignatureReward', common_1.isAmount);
    (0, common_1.validateRequiredField)(tx, 'OtherChainSource', common_1.isAccount);
}
exports.validateXChainCreateClaimID = validateXChainCreateClaimID;
//# sourceMappingURL=XChainCreateClaimID.js.map