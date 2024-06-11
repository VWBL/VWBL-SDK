"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateOfferCreate = exports.OfferCreateFlags = void 0;
const errors_1 = require("../../errors");
const common_1 = require("./common");
var OfferCreateFlags;
(function (OfferCreateFlags) {
    OfferCreateFlags[OfferCreateFlags["tfPassive"] = 65536] = "tfPassive";
    OfferCreateFlags[OfferCreateFlags["tfImmediateOrCancel"] = 131072] = "tfImmediateOrCancel";
    OfferCreateFlags[OfferCreateFlags["tfFillOrKill"] = 262144] = "tfFillOrKill";
    OfferCreateFlags[OfferCreateFlags["tfSell"] = 524288] = "tfSell";
})(OfferCreateFlags || (exports.OfferCreateFlags = OfferCreateFlags = {}));
function validateOfferCreate(tx) {
    (0, common_1.validateBaseTransaction)(tx);
    if (tx.TakerGets === undefined) {
        throw new errors_1.ValidationError('OfferCreate: missing field TakerGets');
    }
    if (tx.TakerPays === undefined) {
        throw new errors_1.ValidationError('OfferCreate: missing field TakerPays');
    }
    if (typeof tx.TakerGets !== 'string' && !(0, common_1.isAmount)(tx.TakerGets)) {
        throw new errors_1.ValidationError('OfferCreate: invalid TakerGets');
    }
    if (typeof tx.TakerPays !== 'string' && !(0, common_1.isAmount)(tx.TakerPays)) {
        throw new errors_1.ValidationError('OfferCreate: invalid TakerPays');
    }
    if (tx.Expiration !== undefined && typeof tx.Expiration !== 'number') {
        throw new errors_1.ValidationError('OfferCreate: invalid Expiration');
    }
    if (tx.OfferSequence !== undefined && typeof tx.OfferSequence !== 'number') {
        throw new errors_1.ValidationError('OfferCreate: invalid OfferSequence');
    }
}
exports.validateOfferCreate = validateOfferCreate;
//# sourceMappingURL=offerCreate.js.map