"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const errors_1 = require("../errors");
const NUM_DECIMAL_PLACES = 6;
const BASE_10 = 10;
function getFeeXrp(client, cushion) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const feeCushion = cushion !== null && cushion !== void 0 ? cushion : client.feeCushion;
        const serverInfo = (yield client.request({ command: 'server_info' })).result
            .info;
        const baseFee = (_a = serverInfo.validated_ledger) === null || _a === void 0 ? void 0 : _a.base_fee_xrp;
        if (baseFee == null) {
            throw new errors_1.XrplError('getFeeXrp: Could not get base_fee_xrp from server_info');
        }
        const baseFeeXrp = new bignumber_js_1.default(baseFee);
        if (serverInfo.load_factor == null) {
            serverInfo.load_factor = 1;
        }
        let fee = baseFeeXrp.times(serverInfo.load_factor).times(feeCushion);
        fee = bignumber_js_1.default.min(fee, client.maxFeeXRP);
        return new bignumber_js_1.default(fee.toFixed(NUM_DECIMAL_PLACES)).toString(BASE_10);
    });
}
exports.default = getFeeXrp;
//# sourceMappingURL=getFeeXrp.js.map