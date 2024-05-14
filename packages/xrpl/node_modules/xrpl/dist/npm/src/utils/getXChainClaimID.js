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
function getXChainClaimID(meta) {
    if (typeof meta !== 'string' && (meta === null || meta === void 0 ? void 0 : meta.AffectedNodes) === undefined) {
        throw new TypeError(`Unable to parse the parameter given to getXChainClaimID.
      'meta' must be the metadata from an XChainCreateClaimID transaction. Received ${JSON.stringify(meta)} instead.`);
    }
    const decodedMeta = ensureDecodedMeta(meta);
    if (!decodedMeta.TransactionResult) {
        throw new TypeError('Cannot get XChainClaimID from un-validated transaction');
    }
    if (decodedMeta.TransactionResult !== 'tesSUCCESS') {
        return undefined;
    }
    const createdNode = decodedMeta.AffectedNodes.find((node) => (0, metadata_1.isCreatedNode)(node) &&
        node.CreatedNode.LedgerEntryType === 'XChainOwnedClaimID');
    return createdNode.CreatedNode.NewFields
        .XChainClaimID;
}
exports.default = getXChainClaimID;
//# sourceMappingURL=getXChainClaimID.js.map