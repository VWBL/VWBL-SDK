"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAMMDelete = void 0;
const errors_1 = require("../../errors");
const common_1 = require("./common");
function validateAMMDelete(tx) {
    (0, common_1.validateBaseTransaction)(tx);
    if (tx.Asset == null) {
        throw new errors_1.ValidationError('AMMDelete: missing field Asset');
    }
    if (!(0, common_1.isCurrency)(tx.Asset)) {
        throw new errors_1.ValidationError('AMMDelete: Asset must be a Currency');
    }
    if (tx.Asset2 == null) {
        throw new errors_1.ValidationError('AMMDelete: missing field Asset2');
    }
    if (!(0, common_1.isCurrency)(tx.Asset2)) {
        throw new errors_1.ValidationError('AMMDelete: Asset2 must be a Currency');
    }
}
exports.validateAMMDelete = validateAMMDelete;
//# sourceMappingURL=AMMDelete.js.map