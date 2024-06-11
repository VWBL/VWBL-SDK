"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateOfferCancel = void 0;
const errors_1 = require("../../errors");
const common_1 = require("./common");
function validateOfferCancel(tx) {
    (0, common_1.validateBaseTransaction)(tx);
    if (tx.OfferSequence === undefined) {
        throw new errors_1.ValidationError('OfferCancel: missing field OfferSequence');
    }
    if (typeof tx.OfferSequence !== 'number') {
        throw new errors_1.ValidationError('OfferCancel: OfferSequence must be a number');
    }
}
exports.validateOfferCancel = validateOfferCancel;
//# sourceMappingURL=offerCancel.js.map