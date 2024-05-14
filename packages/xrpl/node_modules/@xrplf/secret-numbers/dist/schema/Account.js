"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Account = void 0;
const ripple_keypairs_1 = require("ripple-keypairs");
const utils_1 = require("../utils");
class Account {
    constructor(secretNumbers) {
        this._account = {
            familySeed: '',
            address: '',
            keypair: {
                publicKey: '',
                privateKey: '',
            },
        };
        if (typeof secretNumbers === 'string') {
            this._secret = (0, utils_1.parseSecretString)(secretNumbers);
        }
        else if (Array.isArray(secretNumbers)) {
            this._secret = secretNumbers;
        }
        else if (secretNumbers instanceof Uint8Array) {
            this._secret = (0, utils_1.entropyToSecret)(secretNumbers);
        }
        else {
            this._secret = (0, utils_1.randomSecret)();
        }
        validateLengths(this._secret);
        this.derive();
    }
    getSecret() {
        return this._secret;
    }
    getSecretString() {
        return this._secret.join(' ');
    }
    getAddress() {
        return this._account.address;
    }
    getFamilySeed() {
        return this._account.familySeed;
    }
    getKeypair() {
        return this._account.keypair;
    }
    toString() {
        return this.getSecretString();
    }
    derive() {
        try {
            const entropy = (0, utils_1.secretToEntropy)(this._secret);
            this._account.familySeed = (0, ripple_keypairs_1.generateSeed)({ entropy });
            this._account.keypair = (0, ripple_keypairs_1.deriveKeypair)(this._account.familySeed);
            this._account.address = (0, ripple_keypairs_1.deriveAddress)(this._account.keypair.publicKey);
        }
        catch (error) {
            let message = 'Unknown Error';
            if (error instanceof Error) {
                message = error.message;
            }
            throw new Error(message);
        }
    }
}
exports.Account = Account;
function validateLengths(secretNumbers) {
    if (secretNumbers.length !== 8) {
        throw new Error('Secret must have 8 numbers');
    }
    secretNumbers.forEach((num) => {
        if (num.length !== 6) {
            throw new Error('Each secret number must be 6 digits');
        }
    });
}
//# sourceMappingURL=Account.js.map