"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSignerListSet = void 0;
const errors_1 = require("../../errors");
const common_1 = require("./common");
const MAX_SIGNERS = 32;
const HEX_WALLET_LOCATOR_REGEX = /^[0-9A-Fa-f]{64}$/u;
function validateSignerListSet(tx) {
    (0, common_1.validateBaseTransaction)(tx);
    if (tx.SignerQuorum === undefined) {
        throw new errors_1.ValidationError('SignerListSet: missing field SignerQuorum');
    }
    if (typeof tx.SignerQuorum !== 'number') {
        throw new errors_1.ValidationError('SignerListSet: invalid SignerQuorum');
    }
    if (tx.SignerQuorum === 0) {
        return;
    }
    if (tx.SignerEntries === undefined) {
        throw new errors_1.ValidationError('SignerListSet: missing field SignerEntries');
    }
    if (!Array.isArray(tx.SignerEntries)) {
        throw new errors_1.ValidationError('SignerListSet: invalid SignerEntries');
    }
    if (tx.SignerEntries.length === 0) {
        throw new errors_1.ValidationError('SignerListSet: need at least 1 member in SignerEntries');
    }
    if (tx.SignerEntries.length > MAX_SIGNERS) {
        throw new errors_1.ValidationError(`SignerListSet: maximum of ${MAX_SIGNERS} members allowed in SignerEntries`);
    }
    for (const entry of tx.SignerEntries) {
        const signerEntry = entry;
        const { WalletLocator } = signerEntry.SignerEntry;
        if (WalletLocator !== undefined &&
            !HEX_WALLET_LOCATOR_REGEX.test(WalletLocator)) {
            throw new errors_1.ValidationError(`SignerListSet: WalletLocator in SignerEntry must be a 256-bit (32-byte) hexadecimal value`);
        }
    }
}
exports.validateSignerListSet = validateSignerListSet;
//# sourceMappingURL=signerListSet.js.map