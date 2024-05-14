"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCheckCreate = void 0;
const errors_1 = require("../../errors");
const common_1 = require("./common");
function validateCheckCreate(tx) {
    (0, common_1.validateBaseTransaction)(tx);
    if (tx.SendMax === undefined) {
        throw new errors_1.ValidationError('CheckCreate: missing field SendMax');
    }
    (0, common_1.validateRequiredField)(tx, 'Destination', common_1.isAccount);
    (0, common_1.validateOptionalField)(tx, 'DestinationTag', common_1.isNumber);
    if (typeof tx.SendMax !== 'string' &&
        !(0, common_1.isIssuedCurrency)(tx.SendMax)) {
        throw new errors_1.ValidationError('CheckCreate: invalid SendMax');
    }
    if (tx.Expiration !== undefined && typeof tx.Expiration !== 'number') {
        throw new errors_1.ValidationError('CheckCreate: invalid Expiration');
    }
    if (tx.InvoiceID !== undefined && typeof tx.InvoiceID !== 'string') {
        throw new errors_1.ValidationError('CheckCreate: invalid InvoiceID');
    }
}
exports.validateCheckCreate = validateCheckCreate;
//# sourceMappingURL=checkCreate.js.map