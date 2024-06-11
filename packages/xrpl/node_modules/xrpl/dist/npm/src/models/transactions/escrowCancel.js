"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEscrowCancel = void 0;
const errors_1 = require("../../errors");
const common_1 = require("./common");
function validateEscrowCancel(tx) {
    (0, common_1.validateBaseTransaction)(tx);
    (0, common_1.validateRequiredField)(tx, 'Owner', common_1.isAccount);
    if (tx.OfferSequence == null) {
        throw new errors_1.ValidationError('EscrowCancel: missing OfferSequence');
    }
    if ((typeof tx.OfferSequence !== 'number' &&
        typeof tx.OfferSequence !== 'string') ||
        Number.isNaN(Number(tx.OfferSequence))) {
        throw new errors_1.ValidationError('EscrowCancel: OfferSequence must be a number');
    }
}
exports.validateEscrowCancel = validateEscrowCancel;
//# sourceMappingURL=escrowCancel.js.map