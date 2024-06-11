"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateXChainCreateBridge = void 0;
const common_1 = require("./common");
function validateXChainCreateBridge(tx) {
    (0, common_1.validateBaseTransaction)(tx);
    (0, common_1.validateRequiredField)(tx, 'XChainBridge', common_1.isXChainBridge);
    (0, common_1.validateRequiredField)(tx, 'SignatureReward', common_1.isAmount);
    (0, common_1.validateOptionalField)(tx, 'MinAccountCreateAmount', common_1.isAmount);
}
exports.validateXChainCreateBridge = validateXChainCreateBridge;
//# sourceMappingURL=XChainCreateBridge.js.map