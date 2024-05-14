"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateXChainAccountCreateCommit = void 0;
const common_1 = require("./common");
function validateXChainAccountCreateCommit(tx) {
    (0, common_1.validateBaseTransaction)(tx);
    (0, common_1.validateRequiredField)(tx, 'XChainBridge', common_1.isXChainBridge);
    (0, common_1.validateRequiredField)(tx, 'SignatureReward', common_1.isAmount);
    (0, common_1.validateRequiredField)(tx, 'Destination', common_1.isAccount);
    (0, common_1.validateRequiredField)(tx, 'Amount', common_1.isAmount);
}
exports.validateXChainAccountCreateCommit = validateXChainAccountCreateCommit;
//# sourceMappingURL=XChainAccountCreateCommit.js.map