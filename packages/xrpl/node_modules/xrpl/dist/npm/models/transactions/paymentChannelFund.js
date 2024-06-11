"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePaymentChannelFund = void 0;
const errors_1 = require("../../errors");
const common_1 = require("./common");
function validatePaymentChannelFund(tx) {
    (0, common_1.validateBaseTransaction)(tx);
    if (tx.Channel === undefined) {
        throw new errors_1.ValidationError('PaymentChannelFund: missing Channel');
    }
    if (typeof tx.Channel !== 'string') {
        throw new errors_1.ValidationError('PaymentChannelFund: Channel must be a string');
    }
    if (tx.Amount === undefined) {
        throw new errors_1.ValidationError('PaymentChannelFund: missing Amount');
    }
    if (typeof tx.Amount !== 'string') {
        throw new errors_1.ValidationError('PaymentChannelFund: Amount must be a string');
    }
    if (tx.Expiration !== undefined && typeof tx.Expiration !== 'number') {
        throw new errors_1.ValidationError('PaymentChannelFund: Expiration must be a number');
    }
}
exports.validatePaymentChannelFund = validatePaymentChannelFund;
//# sourceMappingURL=paymentChannelFund.js.map