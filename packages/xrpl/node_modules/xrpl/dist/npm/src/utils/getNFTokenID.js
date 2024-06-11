"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ripple_binary_codec_1 = require("ripple-binary-codec");
const metadata_1 = require("../models/transactions/metadata");
function ensureDecodedMeta(meta) {
    if (typeof meta === 'string') {
        return (0, ripple_binary_codec_1.decode)(meta);
    }
    return meta;
}
function getNFTokenID(meta) {
    if (typeof meta !== 'string' && (meta === null || meta === void 0 ? void 0 : meta.AffectedNodes) === undefined) {
        throw new TypeError(`Unable to parse the parameter given to getNFTokenID.
      'meta' must be the metadata from an NFTokenMint transaction. Received ${JSON.stringify(meta)} instead.`);
    }
    const decodedMeta = ensureDecodedMeta(meta);
    const affectedNodes = decodedMeta.AffectedNodes.filter((node) => {
        var _a;
        if ((0, metadata_1.isCreatedNode)(node)) {
            return node.CreatedNode.LedgerEntryType === 'NFTokenPage';
        }
        if ((0, metadata_1.isModifiedNode)(node)) {
            return (node.ModifiedNode.LedgerEntryType === 'NFTokenPage' &&
                Boolean((_a = node.ModifiedNode.PreviousFields) === null || _a === void 0 ? void 0 : _a.NFTokens));
        }
        return false;
    });
    const previousTokenIDSet = new Set(affectedNodes
        .flatMap((node) => {
        var _a;
        const nftokens = (0, metadata_1.isModifiedNode)(node)
            ? (_a = node.ModifiedNode.PreviousFields) === null || _a === void 0 ? void 0 : _a.NFTokens
            : [];
        return nftokens.map((token) => token.NFToken.NFTokenID);
    })
        .filter((id) => Boolean(id)));
    const finalTokenIDs = affectedNodes
        .flatMap((node) => {
        var _a, _b, _c, _d, _e, _f;
        return ((_f = ((_c = (_b = (_a = node.ModifiedNode) === null || _a === void 0 ? void 0 : _a.FinalFields) === null || _b === void 0 ? void 0 : _b.NFTokens) !== null && _c !== void 0 ? _c : (_e = (_d = node.CreatedNode) === null || _d === void 0 ? void 0 : _d.NewFields) === null || _e === void 0 ? void 0 : _e.NFTokens)) !== null && _f !== void 0 ? _f : []).map((token) => token.NFToken.NFTokenID);
    })
        .filter((nftokenID) => Boolean(nftokenID));
    const nftokenID = finalTokenIDs.find((id) => !previousTokenIDSet.has(id));
    return nftokenID;
}
exports.default = getNFTokenID;
//# sourceMappingURL=getNFTokenID.js.map