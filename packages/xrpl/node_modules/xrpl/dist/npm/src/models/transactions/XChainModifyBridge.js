"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateXChainModifyBridge = exports.XChainModifyBridgeFlags = void 0;
const common_1 = require("./common");
var XChainModifyBridgeFlags;
(function (XChainModifyBridgeFlags) {
    XChainModifyBridgeFlags[XChainModifyBridgeFlags["tfClearAccountCreateAmount"] = 65536] = "tfClearAccountCreateAmount";
})(XChainModifyBridgeFlags || (exports.XChainModifyBridgeFlags = XChainModifyBridgeFlags = {}));
function validateXChainModifyBridge(tx) {
    (0, common_1.validateBaseTransaction)(tx);
    (0, common_1.validateRequiredField)(tx, 'XChainBridge', common_1.isXChainBridge);
    (0, common_1.validateOptionalField)(tx, 'SignatureReward', common_1.isAmount);
    (0, common_1.validateOptionalField)(tx, 'MinAccountCreateAmount', common_1.isAmount);
}
exports.validateXChainModifyBridge = validateXChainModifyBridge;
//# sourceMappingURL=XChainModifyBridge.js.map