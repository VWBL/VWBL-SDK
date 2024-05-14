"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAMMBid = void 0;
const errors_1 = require("../../errors");
const common_1 = require("./common");
const MAX_AUTH_ACCOUNTS = 4;
function validateAMMBid(tx) {
    (0, common_1.validateBaseTransaction)(tx);
    if (tx.Asset == null) {
        throw new errors_1.ValidationError('AMMBid: missing field Asset');
    }
    if (!(0, common_1.isCurrency)(tx.Asset)) {
        throw new errors_1.ValidationError('AMMBid: Asset must be a Currency');
    }
    if (tx.Asset2 == null) {
        throw new errors_1.ValidationError('AMMBid: missing field Asset2');
    }
    if (!(0, common_1.isCurrency)(tx.Asset2)) {
        throw new errors_1.ValidationError('AMMBid: Asset2 must be a Currency');
    }
    if (tx.BidMin != null && !(0, common_1.isAmount)(tx.BidMin)) {
        throw new errors_1.ValidationError('AMMBid: BidMin must be an Amount');
    }
    if (tx.BidMax != null && !(0, common_1.isAmount)(tx.BidMax)) {
        throw new errors_1.ValidationError('AMMBid: BidMax must be an Amount');
    }
    if (tx.AuthAccounts != null) {
        if (!Array.isArray(tx.AuthAccounts)) {
            throw new errors_1.ValidationError(`AMMBid: AuthAccounts must be an AuthAccount array`);
        }
        if (tx.AuthAccounts.length > MAX_AUTH_ACCOUNTS) {
            throw new errors_1.ValidationError(`AMMBid: AuthAccounts length must not be greater than ${MAX_AUTH_ACCOUNTS}`);
        }
        validateAuthAccounts(tx.Account, tx.AuthAccounts);
    }
}
exports.validateAMMBid = validateAMMBid;
function validateAuthAccounts(senderAddress, authAccounts) {
    for (const authAccount of authAccounts) {
        if (authAccount.AuthAccount == null ||
            typeof authAccount.AuthAccount !== 'object') {
            throw new errors_1.ValidationError(`AMMBid: invalid AuthAccounts`);
        }
        if (authAccount.AuthAccount.Account == null) {
            throw new errors_1.ValidationError(`AMMBid: invalid AuthAccounts`);
        }
        if (typeof authAccount.AuthAccount.Account !== 'string') {
            throw new errors_1.ValidationError(`AMMBid: invalid AuthAccounts`);
        }
        if (authAccount.AuthAccount.Account === senderAddress) {
            throw new errors_1.ValidationError(`AMMBid: AuthAccounts must not include sender's address`);
        }
    }
    return true;
}
//# sourceMappingURL=AMMBid.js.map