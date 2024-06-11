"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleStreamPartialPayment = exports.handlePartialPayment = void 0;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const ripple_binary_codec_1 = require("ripple-binary-codec");
const transactions_1 = require("../models/transactions");
const utils_1 = require("../models/utils");
const WARN_PARTIAL_PAYMENT_CODE = 2001;
function amountsEqual(amt1, amt2) {
    if (typeof amt1 === 'string' && typeof amt2 === 'string') {
        return amt1 === amt2;
    }
    if (typeof amt1 === 'string' || typeof amt2 === 'string') {
        return false;
    }
    const aValue = new bignumber_js_1.default(amt1.value);
    const bValue = new bignumber_js_1.default(amt2.value);
    return (amt1.currency === amt2.currency &&
        amt1.issuer === amt2.issuer &&
        aValue.isEqualTo(bValue));
}
function isPartialPayment(tx, metadata) {
    var _a;
    if (tx == null || metadata == null || tx.TransactionType !== 'Payment') {
        return false;
    }
    let meta = metadata;
    if (typeof meta === 'string') {
        if (meta === 'unavailable') {
            return false;
        }
        meta = (0, ripple_binary_codec_1.decode)(meta);
    }
    const tfPartial = typeof tx.Flags === 'number'
        ? (0, utils_1.isFlagEnabled)(tx.Flags, transactions_1.PaymentFlags.tfPartialPayment)
        : (_a = tx.Flags) === null || _a === void 0 ? void 0 : _a.tfPartialPayment;
    if (!tfPartial) {
        return false;
    }
    const delivered = meta.delivered_amount;
    const amount = tx.Amount;
    if (delivered === undefined) {
        return false;
    }
    return !amountsEqual(delivered, amount);
}
function txHasPartialPayment(response) {
    return isPartialPayment(response.result, response.result.meta);
}
function txEntryHasPartialPayment(response) {
    return isPartialPayment(response.result.tx_json, response.result.metadata);
}
function accountTxHasPartialPayment(response) {
    const { transactions } = response.result;
    const foo = transactions.some((tx) => isPartialPayment(tx.tx, tx.meta));
    return foo;
}
function hasPartialPayment(command, response) {
    switch (command) {
        case 'tx':
            return txHasPartialPayment(response);
        case 'transaction_entry':
            return txEntryHasPartialPayment(response);
        case 'account_tx':
            return accountTxHasPartialPayment(response);
        default:
            return false;
    }
}
function handlePartialPayment(command, response) {
    var _a;
    if (hasPartialPayment(command, response)) {
        const warnings = (_a = response.warnings) !== null && _a !== void 0 ? _a : [];
        const warning = {
            id: WARN_PARTIAL_PAYMENT_CODE,
            message: 'This response contains a Partial Payment',
        };
        warnings.push(warning);
        response.warnings = warnings;
    }
}
exports.handlePartialPayment = handlePartialPayment;
function handleStreamPartialPayment(stream, log) {
    var _a;
    if (isPartialPayment(stream.transaction, stream.meta)) {
        const warnings = (_a = stream.warnings) !== null && _a !== void 0 ? _a : [];
        const warning = {
            id: WARN_PARTIAL_PAYMENT_CODE,
            message: 'This response contains a Partial Payment',
        };
        warnings.push(warning);
        stream.warnings = warnings;
        log('Partial payment received', JSON.stringify(stream));
    }
}
exports.handleStreamPartialPayment = handleStreamPartialPayment;
//# sourceMappingURL=partialPayment.js.map