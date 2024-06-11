"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDepositPreauth = void 0;
const errors_1 = require("../../errors");
const common_1 = require("./common");
function validateDepositPreauth(tx) {
    (0, common_1.validateBaseTransaction)(tx);
    if (tx.Authorize !== undefined && tx.Unauthorize !== undefined) {
        throw new errors_1.ValidationError("DepositPreauth: can't provide both Authorize and Unauthorize fields");
    }
    if (tx.Authorize === undefined && tx.Unauthorize === undefined) {
        throw new errors_1.ValidationError('DepositPreauth: must provide either Authorize or Unauthorize field');
    }
    if (tx.Authorize !== undefined) {
        if (typeof tx.Authorize !== 'string') {
            throw new errors_1.ValidationError('DepositPreauth: Authorize must be a string');
        }
        if (tx.Account === tx.Authorize) {
            throw new errors_1.ValidationError("DepositPreauth: Account can't preauthorize its own address");
        }
    }
    if (tx.Unauthorize !== undefined) {
        if (typeof tx.Unauthorize !== 'string') {
            throw new errors_1.ValidationError('DepositPreauth: Unauthorize must be a string');
        }
        if (tx.Account === tx.Unauthorize) {
            throw new errors_1.ValidationError("DepositPreauth: Account can't unauthorize its own address");
        }
    }
}
exports.validateDepositPreauth = validateDepositPreauth;
//# sourceMappingURL=depositPreauth.js.map