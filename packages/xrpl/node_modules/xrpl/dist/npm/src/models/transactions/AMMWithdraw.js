"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAMMWithdraw = exports.AMMWithdrawFlags = void 0;
const errors_1 = require("../../errors");
const common_1 = require("./common");
var AMMWithdrawFlags;
(function (AMMWithdrawFlags) {
    AMMWithdrawFlags[AMMWithdrawFlags["tfLPToken"] = 65536] = "tfLPToken";
    AMMWithdrawFlags[AMMWithdrawFlags["tfWithdrawAll"] = 131072] = "tfWithdrawAll";
    AMMWithdrawFlags[AMMWithdrawFlags["tfOneAssetWithdrawAll"] = 262144] = "tfOneAssetWithdrawAll";
    AMMWithdrawFlags[AMMWithdrawFlags["tfSingleAsset"] = 524288] = "tfSingleAsset";
    AMMWithdrawFlags[AMMWithdrawFlags["tfTwoAsset"] = 1048576] = "tfTwoAsset";
    AMMWithdrawFlags[AMMWithdrawFlags["tfOneAssetLPToken"] = 2097152] = "tfOneAssetLPToken";
    AMMWithdrawFlags[AMMWithdrawFlags["tfLimitLPToken"] = 4194304] = "tfLimitLPToken";
})(AMMWithdrawFlags || (exports.AMMWithdrawFlags = AMMWithdrawFlags = {}));
function validateAMMWithdraw(tx) {
    (0, common_1.validateBaseTransaction)(tx);
    if (tx.Asset == null) {
        throw new errors_1.ValidationError('AMMWithdraw: missing field Asset');
    }
    if (!(0, common_1.isCurrency)(tx.Asset)) {
        throw new errors_1.ValidationError('AMMWithdraw: Asset must be a Currency');
    }
    if (tx.Asset2 == null) {
        throw new errors_1.ValidationError('AMMWithdraw: missing field Asset2');
    }
    if (!(0, common_1.isCurrency)(tx.Asset2)) {
        throw new errors_1.ValidationError('AMMWithdraw: Asset2 must be a Currency');
    }
    if (tx.Amount2 != null && tx.Amount == null) {
        throw new errors_1.ValidationError('AMMWithdraw: must set Amount with Amount2');
    }
    else if (tx.EPrice != null && tx.Amount == null) {
        throw new errors_1.ValidationError('AMMWithdraw: must set Amount with EPrice');
    }
    if (tx.LPTokenIn != null && !(0, common_1.isIssuedCurrency)(tx.LPTokenIn)) {
        throw new errors_1.ValidationError('AMMWithdraw: LPTokenIn must be an IssuedCurrencyAmount');
    }
    if (tx.Amount != null && !(0, common_1.isAmount)(tx.Amount)) {
        throw new errors_1.ValidationError('AMMWithdraw: Amount must be an Amount');
    }
    if (tx.Amount2 != null && !(0, common_1.isAmount)(tx.Amount2)) {
        throw new errors_1.ValidationError('AMMWithdraw: Amount2 must be an Amount');
    }
    if (tx.EPrice != null && !(0, common_1.isAmount)(tx.EPrice)) {
        throw new errors_1.ValidationError('AMMWithdraw: EPrice must be an Amount');
    }
}
exports.validateAMMWithdraw = validateAMMWithdraw;
//# sourceMappingURL=AMMWithdraw.js.map