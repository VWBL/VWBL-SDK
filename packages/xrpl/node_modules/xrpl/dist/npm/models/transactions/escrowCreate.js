"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEscrowCreate = void 0;
const errors_1 = require("../../errors");
const common_1 = require("./common");
function validateEscrowCreate(tx) {
    (0, common_1.validateBaseTransaction)(tx);
    if (tx.Amount === undefined) {
        throw new errors_1.ValidationError('EscrowCreate: missing field Amount');
    }
    if (typeof tx.Amount !== 'string') {
        throw new errors_1.ValidationError('EscrowCreate: Amount must be a string');
    }
    (0, common_1.validateRequiredField)(tx, 'Destination', common_1.isAccount);
    (0, common_1.validateOptionalField)(tx, 'DestinationTag', common_1.isNumber);
    if (tx.CancelAfter === undefined && tx.FinishAfter === undefined) {
        throw new errors_1.ValidationError('EscrowCreate: Either CancelAfter or FinishAfter must be specified');
    }
    if (tx.FinishAfter === undefined && tx.Condition === undefined) {
        throw new errors_1.ValidationError('EscrowCreate: Either Condition or FinishAfter must be specified');
    }
    if (tx.CancelAfter !== undefined && typeof tx.CancelAfter !== 'number') {
        throw new errors_1.ValidationError('EscrowCreate: CancelAfter must be a number');
    }
    if (tx.FinishAfter !== undefined && typeof tx.FinishAfter !== 'number') {
        throw new errors_1.ValidationError('EscrowCreate: FinishAfter must be a number');
    }
    if (tx.Condition !== undefined && typeof tx.Condition !== 'string') {
        throw new errors_1.ValidationError('EscrowCreate: Condition must be a string');
    }
}
exports.validateEscrowCreate = validateEscrowCreate;
//# sourceMappingURL=escrowCreate.js.map