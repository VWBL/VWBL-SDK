"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSecretString = exports.checkChecksum = exports.calculateChecksum = exports.secretToEntropy = exports.entropyToSecret = exports.randomSecret = exports.randomEntropy = void 0;
const utils_1 = require("@xrplf/isomorphic/utils");
function randomEntropy() {
    return (0, utils_1.randomBytes)(16);
}
exports.randomEntropy = randomEntropy;
function calculateChecksum(position, value) {
    return (value * (position * 2 + 1)) % 9;
}
exports.calculateChecksum = calculateChecksum;
function checkChecksum(position, value, checksum) {
    let normalizedChecksum;
    let normalizedValue;
    if (typeof value === 'string') {
        if (value.length !== 6) {
            throw new Error('value must have a length of 6');
        }
        normalizedChecksum = parseInt(value.slice(5), 10);
        normalizedValue = parseInt(value.slice(0, 5), 10);
    }
    else {
        if (typeof checksum !== 'number') {
            throw new Error('checksum must be a number when value is a number');
        }
        normalizedChecksum = checksum;
        normalizedValue = value;
    }
    return (normalizedValue * (position * 2 + 1)) % 9 === normalizedChecksum;
}
exports.checkChecksum = checkChecksum;
function entropyToSecret(entropy) {
    const len = new Array(Math.ceil(entropy.length / 2));
    const chunks = Array.from(len, (_a, chunk) => {
        const buffChunk = entropy.slice(chunk * 2, (chunk + 1) * 2);
        const no = parseInt((0, utils_1.bytesToHex)(buffChunk), 16);
        const fill = '0'.repeat(5 - String(no).length);
        return fill + String(no) + String(calculateChecksum(chunk, no));
    });
    if (chunks.length !== 8) {
        throw new Error('Chucks must have 8 digits');
    }
    return chunks;
}
exports.entropyToSecret = entropyToSecret;
function randomSecret() {
    return entropyToSecret(randomEntropy());
}
exports.randomSecret = randomSecret;
function secretToEntropy(secret) {
    return (0, utils_1.concat)(secret.map((chunk, i) => {
        const no = Number(chunk.slice(0, 5));
        const checksum = Number(chunk.slice(5));
        if (chunk.length !== 6) {
            throw new Error('Invalid secret: number invalid');
        }
        if (!checkChecksum(i, no, checksum)) {
            throw new Error('Invalid secret part: checksum invalid');
        }
        const hex = `0000${no.toString(16)}`.slice(-4);
        return (0, utils_1.hexToBytes)(hex);
    }));
}
exports.secretToEntropy = secretToEntropy;
function parseSecretString(secret) {
    const normalizedSecret = secret.replace(/[^0-9]/gu, '');
    if (normalizedSecret.length !== 48) {
        throw new Error('Invalid secret string (should contain 8 blocks of 6 digits');
    }
    return Array.from(new Array(8), (_a, index) => {
        return normalizedSecret.slice(index * 6, (index + 1) * 6);
    });
}
exports.parseSecretString = parseSecretString;
//# sourceMappingURL=index.js.map