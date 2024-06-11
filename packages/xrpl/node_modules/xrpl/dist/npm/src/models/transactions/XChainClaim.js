"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateXChainClaim = void 0;
const common_1 = require("./common");
function validateXChainClaim(tx) {
    (0, common_1.validateBaseTransaction)(tx);
    (0, common_1.validateRequiredField)(tx, 'XChainBridge', common_1.isXChainBridge);
    (0, common_1.validateRequiredField)(tx, 'XChainClaimID', (inp) => (0, common_1.isNumber)(inp) || (0, common_1.isString)(inp));
    (0, common_1.validateRequiredField)(tx, 'Destination', common_1.isAccount);
    (0, common_1.validateOptionalField)(tx, 'DestinationTag', common_1.isNumber);
    (0, common_1.validateRequiredField)(tx, 'Amount', common_1.isAmount);
}
exports.validateXChainClaim = validateXChainClaim;
//# sourceMappingURL=XChainClaim.js.map