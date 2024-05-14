"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multisign = exports.verifySignature = void 0;
const utils_1 = require("@xrplf/isomorphic/utils");
const bignumber_js_1 = require("bignumber.js");
const ripple_address_codec_1 = require("ripple-address-codec");
const ripple_binary_codec_1 = require("ripple-binary-codec");
const ripple_keypairs_1 = require("ripple-keypairs");
const errors_1 = require("../errors");
const transactions_1 = require("../models/transactions");
function multisign(transactions) {
    if (transactions.length === 0) {
        throw new errors_1.ValidationError('There were 0 transactions to multisign');
    }
    const decodedTransactions = transactions.map((txOrBlob) => {
        return getDecodedTransaction(txOrBlob);
    });
    decodedTransactions.forEach((tx) => {
        (0, transactions_1.validate)(tx);
        if (tx.Signers == null || tx.Signers.length === 0) {
            throw new errors_1.ValidationError("For multisigning all transactions must include a Signers field containing an array of signatures. You may have forgotten to pass the 'forMultisign' parameter when signing.");
        }
        if (tx.SigningPubKey !== '') {
            throw new errors_1.ValidationError('SigningPubKey must be an empty string for all transactions when multisigning.');
        }
    });
    validateTransactionEquivalence(decodedTransactions);
    return (0, ripple_binary_codec_1.encode)(getTransactionWithAllSigners(decodedTransactions));
}
exports.multisign = multisign;
function verifySignature(tx, publicKey) {
    const decodedTx = getDecodedTransaction(tx);
    let key = publicKey;
    if (typeof decodedTx.TxnSignature !== 'string' || !decodedTx.TxnSignature) {
        throw new Error('Transaction is missing a signature, TxnSignature');
    }
    if (!key) {
        if (typeof decodedTx.SigningPubKey !== 'string' ||
            !decodedTx.SigningPubKey) {
            throw new Error('Transaction is missing a public key, SigningPubKey');
        }
        key = decodedTx.SigningPubKey;
    }
    return (0, ripple_keypairs_1.verify)((0, ripple_binary_codec_1.encodeForSigning)(decodedTx), decodedTx.TxnSignature, key);
}
exports.verifySignature = verifySignature;
function validateTransactionEquivalence(transactions) {
    const exampleTransaction = JSON.stringify(Object.assign(Object.assign({}, transactions[0]), { Signers: null }));
    if (transactions
        .slice(1)
        .some((tx) => JSON.stringify(Object.assign(Object.assign({}, tx), { Signers: null })) !== exampleTransaction)) {
        throw new errors_1.ValidationError('txJSON is not the same for all signedTransactions');
    }
}
function getTransactionWithAllSigners(transactions) {
    const sortedSigners = transactions
        .flatMap((tx) => { var _a; return (_a = tx.Signers) !== null && _a !== void 0 ? _a : []; })
        .sort(compareSigners);
    return Object.assign(Object.assign({}, transactions[0]), { Signers: sortedSigners });
}
function compareSigners(left, right) {
    return addressToBigNumber(left.Signer.Account).comparedTo(addressToBigNumber(right.Signer.Account));
}
const NUM_BITS_IN_HEX = 16;
function addressToBigNumber(address) {
    const hex = (0, utils_1.bytesToHex)((0, ripple_address_codec_1.decodeAccountID)(address));
    return new bignumber_js_1.BigNumber(hex, NUM_BITS_IN_HEX);
}
function getDecodedTransaction(txOrBlob) {
    if (typeof txOrBlob === 'object') {
        return (0, ripple_binary_codec_1.decode)((0, ripple_binary_codec_1.encode)(txOrBlob));
    }
    return (0, ripple_binary_codec_1.decode)(txOrBlob);
}
//# sourceMappingURL=signer.js.map