"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatBalances = void 0;
function formatBalances(trustlines) {
    return trustlines.map((trustline) => ({
        value: trustline.balance,
        currency: trustline.currency,
        issuer: trustline.account,
    }));
}
exports.formatBalances = formatBalances;
//# sourceMappingURL=balances.js.map