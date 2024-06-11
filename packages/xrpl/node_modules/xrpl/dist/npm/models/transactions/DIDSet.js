"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDIDSet = void 0;
const errors_1 = require("../../errors");
const common_1 = require("./common");
function validateDIDSet(tx) {
    (0, common_1.validateBaseTransaction)(tx);
    (0, common_1.validateOptionalField)(tx, 'Data', common_1.isString);
    (0, common_1.validateOptionalField)(tx, 'DIDDocument', common_1.isString);
    (0, common_1.validateOptionalField)(tx, 'URI', common_1.isString);
    if (tx.Data === undefined &&
        tx.DIDDocument === undefined &&
        tx.URI === undefined) {
        throw new errors_1.ValidationError('DIDSet: Must have at least one of `Data`, `DIDDocument`, and `URI`');
    }
}
exports.validateDIDSet = validateDIDSet;
//# sourceMappingURL=DIDSet.js.map