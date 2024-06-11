"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCheckCancel = void 0;
const errors_1 = require("../../errors");
const common_1 = require("./common");
function validateCheckCancel(tx) {
    (0, common_1.validateBaseTransaction)(tx);
    if (tx.CheckID !== undefined && typeof tx.CheckID !== 'string') {
        throw new errors_1.ValidationError('CheckCancel: invalid CheckID');
    }
}
exports.validateCheckCancel = validateCheckCancel;
//# sourceMappingURL=checkCancel.js.map