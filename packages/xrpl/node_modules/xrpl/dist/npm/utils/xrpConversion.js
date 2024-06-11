"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.xrpToDrops = exports.dropsToXrp = void 0;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const errors_1 = require("../errors");
const DROPS_PER_XRP = 1000000.0;
const MAX_FRACTION_LENGTH = 6;
const BASE_TEN = 10;
const SANITY_CHECK = /^-?[0-9.]+$/u;
function dropsToXrp(dropsToConvert) {
    const drops = new bignumber_js_1.default(dropsToConvert).toString(BASE_TEN);
    if (typeof dropsToConvert === 'string' && drops === 'NaN') {
        throw new errors_1.ValidationError(`dropsToXrp: invalid value '${dropsToConvert}', should be a BigNumber or string-encoded number.`);
    }
    if (drops.includes('.')) {
        throw new errors_1.ValidationError(`dropsToXrp: value '${drops}' has too many decimal places.`);
    }
    if (!SANITY_CHECK.exec(drops)) {
        throw new errors_1.ValidationError(`dropsToXrp: failed sanity check -` +
            ` value '${drops}',` +
            ` does not match (^-?[0-9]+$).`);
    }
    return new bignumber_js_1.default(drops).dividedBy(DROPS_PER_XRP).toNumber();
}
exports.dropsToXrp = dropsToXrp;
function xrpToDrops(xrpToConvert) {
    const xrp = new bignumber_js_1.default(xrpToConvert).toString(BASE_TEN);
    if (typeof xrpToConvert === 'string' && xrp === 'NaN') {
        throw new errors_1.ValidationError(`xrpToDrops: invalid value '${xrpToConvert}', should be a BigNumber or string-encoded number.`);
    }
    if (!SANITY_CHECK.exec(xrp)) {
        throw new errors_1.ValidationError(`xrpToDrops: failed sanity check - value '${xrp}', does not match (^-?[0-9.]+$).`);
    }
    const components = xrp.split('.');
    if (components.length > 2) {
        throw new errors_1.ValidationError(`xrpToDrops: failed sanity check - value '${xrp}' has too many decimal points.`);
    }
    const fraction = components[1] || '0';
    if (fraction.length > MAX_FRACTION_LENGTH) {
        throw new errors_1.ValidationError(`xrpToDrops: value '${xrp}' has too many decimal places.`);
    }
    return new bignumber_js_1.default(xrp)
        .times(DROPS_PER_XRP)
        .integerValue(bignumber_js_1.default.ROUND_FLOOR)
        .toString(BASE_TEN);
}
exports.xrpToDrops = xrpToDrops;
//# sourceMappingURL=xrpConversion.js.map