"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAMMVote = void 0;
const errors_1 = require("../../errors");
const AMMCreate_1 = require("./AMMCreate");
const common_1 = require("./common");
function validateAMMVote(tx) {
    (0, common_1.validateBaseTransaction)(tx);
    if (tx.Asset == null) {
        throw new errors_1.ValidationError('AMMVote: missing field Asset');
    }
    if (!(0, common_1.isCurrency)(tx.Asset)) {
        throw new errors_1.ValidationError('AMMVote: Asset must be a Currency');
    }
    if (tx.Asset2 == null) {
        throw new errors_1.ValidationError('AMMVote: missing field Asset2');
    }
    if (!(0, common_1.isCurrency)(tx.Asset2)) {
        throw new errors_1.ValidationError('AMMVote: Asset2 must be a Currency');
    }
    if (tx.TradingFee == null) {
        throw new errors_1.ValidationError('AMMVote: missing field TradingFee');
    }
    if (typeof tx.TradingFee !== 'number') {
        throw new errors_1.ValidationError('AMMVote: TradingFee must be a number');
    }
    if (tx.TradingFee < 0 || tx.TradingFee > AMMCreate_1.AMM_MAX_TRADING_FEE) {
        throw new errors_1.ValidationError(`AMMVote: TradingFee must be between 0 and ${AMMCreate_1.AMM_MAX_TRADING_FEE}`);
    }
}
exports.validateAMMVote = validateAMMVote;
//# sourceMappingURL=AMMVote.js.map