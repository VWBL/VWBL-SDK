"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSetRegularKey = void 0;
const errors_1 = require("../../errors");
const common_1 = require("./common");
function validateSetRegularKey(tx) {
    (0, common_1.validateBaseTransaction)(tx);
    if (tx.RegularKey !== undefined && typeof tx.RegularKey !== 'string') {
        throw new errors_1.ValidationError('SetRegularKey: RegularKey must be a string');
    }
}
exports.validateSetRegularKey = validateSetRegularKey;
//# sourceMappingURL=setRegularKey.js.map