"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateXChainAddClaimAttestation = void 0;
const common_1 = require("./common");
function validateXChainAddClaimAttestation(tx) {
    (0, common_1.validateBaseTransaction)(tx);
    (0, common_1.validateRequiredField)(tx, 'Amount', common_1.isAmount);
    (0, common_1.validateRequiredField)(tx, 'AttestationRewardAccount', common_1.isAccount);
    (0, common_1.validateRequiredField)(tx, 'AttestationSignerAccount', common_1.isAccount);
    (0, common_1.validateOptionalField)(tx, 'Destination', common_1.isAccount);
    (0, common_1.validateRequiredField)(tx, 'OtherChainSource', common_1.isAccount);
    (0, common_1.validateRequiredField)(tx, 'PublicKey', common_1.isString);
    (0, common_1.validateRequiredField)(tx, 'Signature', common_1.isString);
    (0, common_1.validateRequiredField)(tx, 'WasLockingChainSend', (inp) => inp === 0 || inp === 1);
    (0, common_1.validateRequiredField)(tx, 'XChainBridge', common_1.isXChainBridge);
    (0, common_1.validateRequiredField)(tx, 'XChainClaimID', (inp) => (0, common_1.isNumber)(inp) || (0, common_1.isString)(inp));
}
exports.validateXChainAddClaimAttestation = validateXChainAddClaimAttestation;
//# sourceMappingURL=XChainAddClaimAttestation.js.map