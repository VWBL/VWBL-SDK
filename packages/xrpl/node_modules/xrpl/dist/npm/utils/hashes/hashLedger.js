"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashStateTree = exports.hashTxTree = exports.hashLedgerHeader = exports.hashSignedTx = void 0;
const utils_1 = require("@xrplf/isomorphic/utils");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const ripple_binary_codec_1 = require("ripple-binary-codec");
const errors_1 = require("../../errors");
const HashPrefix_1 = __importDefault(require("./HashPrefix"));
const sha512Half_1 = __importDefault(require("./sha512Half"));
const SHAMap_1 = __importStar(require("./SHAMap"));
const HEX = 16;
function intToHex(integer, byteLength) {
    const foo = Number(integer)
        .toString(HEX)
        .padStart(byteLength * 2, '0');
    return foo;
}
function bigintToHex(integerString, byteLength) {
    const hex = new bignumber_js_1.default(integerString).toString(HEX);
    return hex.padStart(byteLength * 2, '0');
}
function addLengthPrefix(hex) {
    const length = hex.length / 2;
    if (length <= 192) {
        return (0, utils_1.bytesToHex)([length]) + hex;
    }
    if (length <= 12480) {
        const prefix = length - 193;
        return (0, utils_1.bytesToHex)([193 + (prefix >>> 8), prefix & 0xff]) + hex;
    }
    if (length <= 918744) {
        const prefix = length - 12481;
        return ((0, utils_1.bytesToHex)([
            241 + (prefix >>> 16),
            (prefix >>> 8) & 0xff,
            prefix & 0xff,
        ]) + hex);
    }
    throw new errors_1.XrplError('Variable integer overflow.');
}
function hashSignedTx(tx) {
    let txBlob;
    let txObject;
    if (typeof tx === 'string') {
        txBlob = tx;
        txObject = (0, ripple_binary_codec_1.decode)(tx);
    }
    else {
        txBlob = (0, ripple_binary_codec_1.encode)(tx);
        txObject = tx;
    }
    if (txObject.TxnSignature === undefined &&
        txObject.Signers === undefined &&
        txObject.SigningPubKey === undefined) {
        throw new errors_1.ValidationError('The transaction must be signed to hash it.');
    }
    const prefix = HashPrefix_1.default.TRANSACTION_ID.toString(16).toUpperCase();
    return (0, sha512Half_1.default)(prefix.concat(txBlob));
}
exports.hashSignedTx = hashSignedTx;
function hashLedgerHeader(ledgerHeader) {
    const prefix = HashPrefix_1.default.LEDGER.toString(HEX).toUpperCase();
    const ledger = prefix +
        intToHex(Number(ledgerHeader.ledger_index), 4) +
        bigintToHex(ledgerHeader.total_coins, 8) +
        ledgerHeader.parent_hash +
        ledgerHeader.transaction_hash +
        ledgerHeader.account_hash +
        intToHex(ledgerHeader.parent_close_time, 4) +
        intToHex(ledgerHeader.close_time, 4) +
        intToHex(ledgerHeader.close_time_resolution, 1) +
        intToHex(ledgerHeader.close_flags, 1);
    return (0, sha512Half_1.default)(ledger);
}
exports.hashLedgerHeader = hashLedgerHeader;
function hashTxTree(transactions) {
    var _a;
    const shamap = new SHAMap_1.default();
    for (const txJSON of transactions) {
        const txBlobHex = (0, ripple_binary_codec_1.encode)(txJSON);
        const metaHex = (0, ripple_binary_codec_1.encode)((_a = txJSON.metaData) !== null && _a !== void 0 ? _a : {});
        const txHash = hashSignedTx(txBlobHex);
        const data = addLengthPrefix(txBlobHex) + addLengthPrefix(metaHex);
        shamap.addItem(txHash, data, SHAMap_1.NodeType.TRANSACTION_METADATA);
    }
    return shamap.hash;
}
exports.hashTxTree = hashTxTree;
function hashStateTree(entries) {
    const shamap = new SHAMap_1.default();
    entries.forEach((ledgerEntry) => {
        const data = (0, ripple_binary_codec_1.encode)(ledgerEntry);
        shamap.addItem(ledgerEntry.index, data, SHAMap_1.NodeType.ACCOUNT_STATE);
    });
    return shamap.hash;
}
exports.hashStateTree = hashStateTree;
function computeTransactionHash(ledger, options) {
    const { transaction_hash } = ledger;
    if (!options.computeTreeHashes) {
        return transaction_hash;
    }
    if (ledger.transactions == null) {
        throw new errors_1.ValidationError('transactions is missing from the ledger');
    }
    const transactionHash = hashTxTree(ledger.transactions);
    if (transaction_hash !== transactionHash) {
        throw new errors_1.ValidationError('transactionHash in header' +
            ' does not match computed hash of transactions', {
            transactionHashInHeader: transaction_hash,
            computedHashOfTransactions: transactionHash,
        });
    }
    return transactionHash;
}
function computeStateHash(ledger, options) {
    const { account_hash } = ledger;
    if (!options.computeTreeHashes) {
        return account_hash;
    }
    if (ledger.accountState == null) {
        throw new errors_1.ValidationError('accountState is missing from the ledger');
    }
    const stateHash = hashStateTree(ledger.accountState);
    if (account_hash !== stateHash) {
        throw new errors_1.ValidationError('stateHash in header does not match computed hash of state');
    }
    return stateHash;
}
function hashLedger(ledger, options = {}) {
    const subhashes = {
        transaction_hash: computeTransactionHash(ledger, options),
        account_hash: computeStateHash(ledger, options),
    };
    return hashLedgerHeader(Object.assign(Object.assign({}, ledger), subhashes));
}
exports.default = hashLedger;
//# sourceMappingURL=hashLedger.js.map