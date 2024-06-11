"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAccountSet = exports.AccountSetTfFlags = exports.AccountSetAsfFlags = void 0;
const errors_1 = require("../../errors");
const common_1 = require("./common");
var AccountSetAsfFlags;
(function (AccountSetAsfFlags) {
    AccountSetAsfFlags[AccountSetAsfFlags["asfRequireDest"] = 1] = "asfRequireDest";
    AccountSetAsfFlags[AccountSetAsfFlags["asfRequireAuth"] = 2] = "asfRequireAuth";
    AccountSetAsfFlags[AccountSetAsfFlags["asfDisallowXRP"] = 3] = "asfDisallowXRP";
    AccountSetAsfFlags[AccountSetAsfFlags["asfDisableMaster"] = 4] = "asfDisableMaster";
    AccountSetAsfFlags[AccountSetAsfFlags["asfAccountTxnID"] = 5] = "asfAccountTxnID";
    AccountSetAsfFlags[AccountSetAsfFlags["asfNoFreeze"] = 6] = "asfNoFreeze";
    AccountSetAsfFlags[AccountSetAsfFlags["asfGlobalFreeze"] = 7] = "asfGlobalFreeze";
    AccountSetAsfFlags[AccountSetAsfFlags["asfDefaultRipple"] = 8] = "asfDefaultRipple";
    AccountSetAsfFlags[AccountSetAsfFlags["asfDepositAuth"] = 9] = "asfDepositAuth";
    AccountSetAsfFlags[AccountSetAsfFlags["asfAuthorizedNFTokenMinter"] = 10] = "asfAuthorizedNFTokenMinter";
    AccountSetAsfFlags[AccountSetAsfFlags["asfDisallowIncomingNFTokenOffer"] = 12] = "asfDisallowIncomingNFTokenOffer";
    AccountSetAsfFlags[AccountSetAsfFlags["asfDisallowIncomingCheck"] = 13] = "asfDisallowIncomingCheck";
    AccountSetAsfFlags[AccountSetAsfFlags["asfDisallowIncomingPayChan"] = 14] = "asfDisallowIncomingPayChan";
    AccountSetAsfFlags[AccountSetAsfFlags["asfDisallowIncomingTrustline"] = 15] = "asfDisallowIncomingTrustline";
    AccountSetAsfFlags[AccountSetAsfFlags["asfAllowTrustLineClawback"] = 16] = "asfAllowTrustLineClawback";
})(AccountSetAsfFlags || (exports.AccountSetAsfFlags = AccountSetAsfFlags = {}));
var AccountSetTfFlags;
(function (AccountSetTfFlags) {
    AccountSetTfFlags[AccountSetTfFlags["tfRequireDestTag"] = 65536] = "tfRequireDestTag";
    AccountSetTfFlags[AccountSetTfFlags["tfOptionalDestTag"] = 131072] = "tfOptionalDestTag";
    AccountSetTfFlags[AccountSetTfFlags["tfRequireAuth"] = 262144] = "tfRequireAuth";
    AccountSetTfFlags[AccountSetTfFlags["tfOptionalAuth"] = 524288] = "tfOptionalAuth";
    AccountSetTfFlags[AccountSetTfFlags["tfDisallowXRP"] = 1048576] = "tfDisallowXRP";
    AccountSetTfFlags[AccountSetTfFlags["tfAllowXRP"] = 2097152] = "tfAllowXRP";
})(AccountSetTfFlags || (exports.AccountSetTfFlags = AccountSetTfFlags = {}));
const MIN_TICK_SIZE = 3;
const MAX_TICK_SIZE = 15;
function validateAccountSet(tx) {
    (0, common_1.validateBaseTransaction)(tx);
    (0, common_1.validateOptionalField)(tx, 'NFTokenMinter', common_1.isAccount);
    if (tx.ClearFlag !== undefined) {
        if (typeof tx.ClearFlag !== 'number') {
            throw new errors_1.ValidationError('AccountSet: invalid ClearFlag');
        }
        if (!Object.values(AccountSetAsfFlags).includes(tx.ClearFlag)) {
            throw new errors_1.ValidationError('AccountSet: invalid ClearFlag');
        }
    }
    if (tx.Domain !== undefined && typeof tx.Domain !== 'string') {
        throw new errors_1.ValidationError('AccountSet: invalid Domain');
    }
    if (tx.EmailHash !== undefined && typeof tx.EmailHash !== 'string') {
        throw new errors_1.ValidationError('AccountSet: invalid EmailHash');
    }
    if (tx.MessageKey !== undefined && typeof tx.MessageKey !== 'string') {
        throw new errors_1.ValidationError('AccountSet: invalid MessageKey');
    }
    if (tx.SetFlag !== undefined) {
        if (typeof tx.SetFlag !== 'number') {
            throw new errors_1.ValidationError('AccountSet: invalid SetFlag');
        }
        if (!Object.values(AccountSetAsfFlags).includes(tx.SetFlag)) {
            throw new errors_1.ValidationError('AccountSet: invalid SetFlag');
        }
    }
    if (tx.TransferRate !== undefined && typeof tx.TransferRate !== 'number') {
        throw new errors_1.ValidationError('AccountSet: invalid TransferRate');
    }
    if (tx.TickSize !== undefined) {
        if (typeof tx.TickSize !== 'number') {
            throw new errors_1.ValidationError('AccountSet: invalid TickSize');
        }
        if (tx.TickSize !== 0 &&
            (tx.TickSize < MIN_TICK_SIZE || tx.TickSize > MAX_TICK_SIZE)) {
            throw new errors_1.ValidationError('AccountSet: invalid TickSize');
        }
    }
}
exports.validateAccountSet = validateAccountSet;
//# sourceMappingURL=accountSet.js.map