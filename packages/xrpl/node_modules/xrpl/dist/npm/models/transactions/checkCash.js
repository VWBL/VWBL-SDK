"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCheckCash = void 0;
const errors_1 = require("../../errors");
const common_1 = require("./common");
function validateCheckCash(tx) {
    (0, common_1.validateBaseTransaction)(tx);
    if (tx.Amount == null && tx.DeliverMin == null) {
        throw new errors_1.ValidationError('CheckCash: must have either Amount or DeliverMin');
    }
    if (tx.Amount != null && tx.DeliverMin != null) {
        throw new errors_1.ValidationError('CheckCash: cannot have both Amount and DeliverMin');
    }
    if (tx.Amount != null && tx.Amount !== undefined && !(0, common_1.isAmount)(tx.Amount)) {
        throw new errors_1.ValidationError('CheckCash: invalid Amount');
    }
    if (tx.DeliverMin != null &&
        tx.DeliverMin !== undefined &&
        !(0, common_1.isAmount)(tx.DeliverMin)) {
        throw new errors_1.ValidationError('CheckCash: invalid DeliverMin');
    }
    if (tx.CheckID !== undefined && typeof tx.CheckID !== 'string') {
        throw new errors_1.ValidationError('CheckCash: invalid CheckID');
    }
}
exports.validateCheckCash = validateCheckCash;
//# sourceMappingURL=checkCash.js.map