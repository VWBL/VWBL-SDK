"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletFromSecretNumbers = void 0;
const secret_numbers_1 = require("@xrplf/secret-numbers");
const ECDSA_1 = __importDefault(require("../ECDSA"));
const _1 = require(".");
function walletFromSecretNumbers(secretNumbers, opts) {
    var _a;
    const secret = new secret_numbers_1.Account(secretNumbers).getFamilySeed();
    const updatedOpts = {
        masterAddress: undefined,
        algorithm: undefined,
    };
    if (opts === undefined) {
        updatedOpts.algorithm = ECDSA_1.default.secp256k1;
    }
    else {
        updatedOpts.masterAddress = opts.masterAddress;
        updatedOpts.algorithm = (_a = opts.algorithm) !== null && _a !== void 0 ? _a : ECDSA_1.default.secp256k1;
    }
    return _1.Wallet.fromSecret(secret, updatedOpts);
}
exports.walletFromSecretNumbers = walletFromSecretNumbers;
//# sourceMappingURL=walletFromSecretNumbers.js.map