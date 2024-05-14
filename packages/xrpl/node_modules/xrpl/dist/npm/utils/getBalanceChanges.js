"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const collections_1 = require("./collections");
const xrpConversion_1 = require("./xrpConversion");
function normalizeNode(affectedNode) {
    const diffType = Object.keys(affectedNode)[0];
    const node = affectedNode[diffType];
    return Object.assign(Object.assign({}, node), { NodeType: diffType, LedgerEntryType: node.LedgerEntryType, LedgerIndex: node.LedgerIndex, NewFields: node.NewFields, FinalFields: node.FinalFields, PreviousFields: node.PreviousFields });
}
function normalizeNodes(metadata) {
    if (metadata.AffectedNodes.length === 0) {
        return [];
    }
    return metadata.AffectedNodes.map(normalizeNode);
}
function groupByAccount(balanceChanges) {
    const grouped = (0, collections_1.groupBy)(balanceChanges, (node) => node.account);
    return Object.entries(grouped).map(([account, items]) => {
        return { account, balances: items.map((item) => item.balance) };
    });
}
function getValue(balance) {
    if (typeof balance === 'string') {
        return new bignumber_js_1.default(balance);
    }
    return new bignumber_js_1.default(balance.value);
}
function computeBalanceChange(node) {
    var _a, _b, _c;
    let value = null;
    if ((_a = node.NewFields) === null || _a === void 0 ? void 0 : _a.Balance) {
        value = getValue(node.NewFields.Balance);
    }
    else if (((_b = node.PreviousFields) === null || _b === void 0 ? void 0 : _b.Balance) && ((_c = node.FinalFields) === null || _c === void 0 ? void 0 : _c.Balance)) {
        value = getValue(node.FinalFields.Balance).minus(getValue(node.PreviousFields.Balance));
    }
    if (value === null || value.isZero()) {
        return null;
    }
    return value;
}
function getXRPQuantity(node) {
    var _a, _b, _c;
    const value = computeBalanceChange(node);
    if (value === null) {
        return null;
    }
    return {
        account: ((_b = (_a = node.FinalFields) === null || _a === void 0 ? void 0 : _a.Account) !== null && _b !== void 0 ? _b : (_c = node.NewFields) === null || _c === void 0 ? void 0 : _c.Account),
        balance: {
            currency: 'XRP',
            value: (0, xrpConversion_1.dropsToXrp)(value).toString(),
        },
    };
}
function flipTrustlinePerspective(balanceChange) {
    const negatedBalance = new bignumber_js_1.default(balanceChange.balance.value).negated();
    return {
        account: balanceChange.balance.issuer,
        balance: {
            issuer: balanceChange.account,
            currency: balanceChange.balance.currency,
            value: negatedBalance.toString(),
        },
    };
}
function getTrustlineQuantity(node) {
    var _a, _b;
    const value = computeBalanceChange(node);
    if (value === null) {
        return null;
    }
    const fields = node.NewFields == null ? node.FinalFields : node.NewFields;
    const result = {
        account: (_a = fields === null || fields === void 0 ? void 0 : fields.LowLimit) === null || _a === void 0 ? void 0 : _a.issuer,
        balance: {
            issuer: (_b = fields === null || fields === void 0 ? void 0 : fields.HighLimit) === null || _b === void 0 ? void 0 : _b.issuer,
            currency: (fields === null || fields === void 0 ? void 0 : fields.Balance).currency,
            value: value.toString(),
        },
    };
    return [result, flipTrustlinePerspective(result)];
}
function getBalanceChanges(metadata) {
    const quantities = normalizeNodes(metadata).map((node) => {
        if (node.LedgerEntryType === 'AccountRoot') {
            const xrpQuantity = getXRPQuantity(node);
            if (xrpQuantity == null) {
                return [];
            }
            return [xrpQuantity];
        }
        if (node.LedgerEntryType === 'RippleState') {
            const trustlineQuantity = getTrustlineQuantity(node);
            if (trustlineQuantity == null) {
                return [];
            }
            return trustlineQuantity;
        }
        return [];
    });
    return groupByAccount(quantities.flat());
}
exports.default = getBalanceChanges;
//# sourceMappingURL=getBalanceChanges.js.map