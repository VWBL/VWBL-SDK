"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.percentToQuality = exports.transferRateToDecimal = exports.qualityToDecimal = exports.decimalToQuality = exports.percentToTransferRate = exports.decimalToTransferRate = void 0;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const errors_1 = require("../errors");
const BASE_TEN = 10;
const ONE_BILLION = '1000000000';
const TWO_BILLION = '2000000000';
function percentToDecimal(percent) {
    if (!percent.endsWith('%')) {
        throw new errors_1.ValidationError(`Value ${percent} must end with %`);
    }
    const split = percent.split('%').filter((str) => str !== '');
    if (split.length !== 1) {
        throw new errors_1.ValidationError(`Value ${percent} contains too many % signs`);
    }
    return new bignumber_js_1.default(split[0]).dividedBy('100').toString(BASE_TEN);
}
function decimalToTransferRate(decimal) {
    const rate = new bignumber_js_1.default(decimal).times(ONE_BILLION).plus(ONE_BILLION);
    if (rate.isLessThan(ONE_BILLION) || rate.isGreaterThan(TWO_BILLION)) {
        throw new errors_1.ValidationError(`Decimal value must be between 0 and 1.00.`);
    }
    const billionths = rate.toString(BASE_TEN);
    if (billionths === ONE_BILLION) {
        return 0;
    }
    if (billionths === 'NaN') {
        throw new errors_1.ValidationError(`Value is not a number`);
    }
    if (billionths.includes('.')) {
        throw new errors_1.ValidationError(`Decimal exceeds maximum precision.`);
    }
    return Number(billionths);
}
exports.decimalToTransferRate = decimalToTransferRate;
function percentToTransferRate(percent) {
    return decimalToTransferRate(percentToDecimal(percent));
}
exports.percentToTransferRate = percentToTransferRate;
function decimalToQuality(decimal) {
    const rate = new bignumber_js_1.default(decimal).times(ONE_BILLION);
    const billionths = rate.toString(BASE_TEN);
    if (billionths === 'NaN') {
        throw new errors_1.ValidationError(`Value is not a number`);
    }
    if (billionths.includes('-')) {
        throw new errors_1.ValidationError('Cannot have negative Quality');
    }
    if (billionths === ONE_BILLION) {
        return 0;
    }
    if (billionths.includes('.')) {
        throw new errors_1.ValidationError(`Decimal exceeds maximum precision.`);
    }
    return Number(billionths);
}
exports.decimalToQuality = decimalToQuality;
function qualityToDecimal(quality) {
    if (!Number.isInteger(quality)) {
        throw new errors_1.ValidationError('Quality must be an integer');
    }
    if (quality < 0) {
        throw new errors_1.ValidationError('Negative quality not allowed');
    }
    if (quality === 0) {
        return '1';
    }
    const decimal = new bignumber_js_1.default(quality).dividedBy(ONE_BILLION);
    return decimal.toString(BASE_TEN);
}
exports.qualityToDecimal = qualityToDecimal;
function transferRateToDecimal(rate) {
    if (!Number.isInteger(rate)) {
        throw new errors_1.ValidationError('Error decoding, transfer Rate must be an integer');
    }
    if (rate === 0) {
        return '0';
    }
    const decimal = new bignumber_js_1.default(rate).minus(ONE_BILLION).dividedBy(ONE_BILLION);
    if (decimal.isLessThan(0)) {
        throw new errors_1.ValidationError('Error decoding, negative transfer rate');
    }
    return decimal.toString(BASE_TEN);
}
exports.transferRateToDecimal = transferRateToDecimal;
function percentToQuality(percent) {
    return decimalToQuality(percentToDecimal(percent));
}
exports.percentToQuality = percentToQuality;
//# sourceMappingURL=quality.js.map