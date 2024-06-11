"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateNFTokenAcceptOffer = void 0;
const errors_1 = require("../../errors");
const common_1 = require("./common");
function validateNFTokenBrokerFee(tx) {
    const value = (0, common_1.parseAmountValue)(tx.NFTokenBrokerFee);
    if (Number.isNaN(value)) {
        throw new errors_1.ValidationError('NFTokenAcceptOffer: invalid NFTokenBrokerFee');
    }
    if (value <= 0) {
        throw new errors_1.ValidationError('NFTokenAcceptOffer: NFTokenBrokerFee must be greater than 0; omit if there is no fee');
    }
    if (tx.NFTokenSellOffer == null || tx.NFTokenBuyOffer == null) {
        throw new errors_1.ValidationError('NFTokenAcceptOffer: both NFTokenSellOffer and NFTokenBuyOffer must be set if using brokered mode');
    }
}
function validateNFTokenAcceptOffer(tx) {
    (0, common_1.validateBaseTransaction)(tx);
    if (tx.NFTokenBrokerFee != null) {
        validateNFTokenBrokerFee(tx);
    }
    if (tx.NFTokenSellOffer == null && tx.NFTokenBuyOffer == null) {
        throw new errors_1.ValidationError('NFTokenAcceptOffer: must set either NFTokenSellOffer or NFTokenBuyOffer');
    }
}
exports.validateNFTokenAcceptOffer = validateNFTokenAcceptOffer;
//# sourceMappingURL=NFTokenAcceptOffer.js.map