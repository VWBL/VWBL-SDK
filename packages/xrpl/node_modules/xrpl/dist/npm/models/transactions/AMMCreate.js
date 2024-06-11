"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAMMCreate = exports.AMM_MAX_TRADING_FEE = void 0;
const errors_1 = require("../../errors");
const common_1 = require("./common");
exports.AMM_MAX_TRADING_FEE = 1000;
function validateAMMCreate(tx) {
    (0, common_1.validateBaseTransaction)(tx);
    if (tx.Amount == null) {
        throw new errors_1.ValidationError('AMMCreate: missing field Amount');
    }
    if (!(0, common_1.isAmount)(tx.Amount)) {
        throw new errors_1.ValidationError('AMMCreate: Amount must be an Amount');
    }
    if (tx.Amount2 == null) {
        throw new errors_1.ValidationError('AMMCreate: missing field Amount2');
    }
    if (!(0, common_1.isAmount)(tx.Amount2)) {
        throw new errors_1.ValidationError('AMMCreate: Amount2 must be an Amount');
    }
    if (tx.TradingFee == null) {
        throw new errors_1.ValidationError('AMMCreate: missing field TradingFee');
    }
    if (typeof tx.TradingFee !== 'number') {
        throw new errors_1.ValidationError('AMMCreate: TradingFee must be a number');
    }
    if (tx.TradingFee < 0 || tx.TradingFee > exports.AMM_MAX_TRADING_FEE) {
        throw new errors_1.ValidationError(`AMMCreate: TradingFee must be between 0 and ${exports.AMM_MAX_TRADING_FEE}`);
    }
}
exports.validateAMMCreate = validateAMMCreate;
//# sourceMappingURL=AMMCreate.js.map