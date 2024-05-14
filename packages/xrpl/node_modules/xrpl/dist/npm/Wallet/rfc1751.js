"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.keyToRFC1751Mnemonic = exports.rfc1751MnemonicToKey = void 0;
const utils_1 = require("@xrplf/isomorphic/utils");
const rfc1751Words_json_1 = __importDefault(require("./rfc1751Words.json"));
const rfc1751WordList = rfc1751Words_json_1.default;
const BINARY = ['0000', '0001', '0010', '0011', '0100', '0101', '0110', '0111',
    '1000', '1001', '1010', '1011', '1100', '1101', '1110', '1111'];
function keyToBinary(key) {
    let res = '';
    for (const num of key) {
        res += BINARY[num >> 4] + BINARY[num & 0x0f];
    }
    return res;
}
function extract(key, start, length) {
    const subKey = key.substring(start, start + length);
    let acc = 0;
    for (let index = 0; index < subKey.length; index++) {
        acc = acc * 2 + subKey.charCodeAt(index) - 48;
    }
    return acc;
}
function keyToRFC1751Mnemonic(hex_key) {
    const buf = (0, utils_1.hexToBytes)(hex_key.replace(/\s+/gu, ''));
    let key = bufferToArray(swap128(buf));
    const padding = [];
    for (let index = 0; index < (8 - (key.length % 8)) % 8; index++) {
        padding.push(0);
    }
    key = padding.concat(key);
    const english = [];
    for (let index = 0; index < key.length; index += 8) {
        const subKey = key.slice(index, index + 8);
        let skbin = keyToBinary(subKey);
        let parity = 0;
        for (let j = 0; j < 64; j += 2) {
            parity += extract(skbin, j, 2);
        }
        subKey.push((parity << 6) & 0xff);
        skbin = keyToBinary(subKey);
        for (let j = 0; j < 64; j += 11) {
            english.push(rfc1751WordList[extract(skbin, j, 11)]);
        }
    }
    return english.join(' ');
}
exports.keyToRFC1751Mnemonic = keyToRFC1751Mnemonic;
function rfc1751MnemonicToKey(english) {
    const words = english.split(' ');
    let key = [];
    for (let index = 0; index < words.length; index += 6) {
        const { subKey, word } = getSubKey(words, index);
        const skbin = keyToBinary(subKey);
        let parity = 0;
        for (let j = 0; j < 64; j += 2) {
            parity += extract(skbin, j, 2);
        }
        const cs0 = extract(skbin, 64, 2);
        const cs1 = parity & 3;
        if (cs0 !== cs1) {
            throw new Error(`Parity error at ${word}`);
        }
        key = key.concat(subKey.slice(0, 8));
    }
    const bufferKey = swap128(Uint8Array.from(key));
    return bufferKey;
}
exports.rfc1751MnemonicToKey = rfc1751MnemonicToKey;
function getSubKey(words, index) {
    const sublist = words.slice(index, index + 6);
    let bits = 0;
    const ch = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    let word = '';
    for (word of sublist) {
        const idx = rfc1751WordList.indexOf(word.toUpperCase());
        if (idx === -1) {
            throw new TypeError(`Expected an RFC1751 word, but received '${word}'. ` +
                `For the full list of words in the RFC1751 encoding see https://datatracker.ietf.org/doc/html/rfc1751`);
        }
        const shift = (8 - ((bits + 11) % 8)) % 8;
        const y = idx << shift;
        const cl = y >> 16;
        const cc = (y >> 8) & 0xff;
        const cr = y & 0xff;
        const t = Math.floor(bits / 8);
        if (shift > 5) {
            ch[t] |= cl;
            ch[t + 1] |= cc;
            ch[t + 2] |= cr;
        }
        else if (shift > -3) {
            ch[t] |= cc;
            ch[t + 1] |= cr;
        }
        else {
            ch[t] |= cr;
        }
        bits += 11;
    }
    const subKey = ch.slice();
    return { subKey, word };
}
function bufferToArray(buf) {
    return Array.prototype.slice.call(buf);
}
function swap(arr, n, m) {
    const i = arr[n];
    arr[n] = arr[m];
    arr[m] = i;
}
function swap64(arr) {
    const len = arr.length;
    for (let i = 0; i < len; i += 8) {
        swap(arr, i, i + 7);
        swap(arr, i + 1, i + 6);
        swap(arr, i + 2, i + 5);
        swap(arr, i + 3, i + 4);
    }
    return arr;
}
function swap128(arr) {
    const reversedBytes = swap64(arr);
    return (0, utils_1.concat)([reversedBytes.slice(8, 16), reversedBytes.slice(0, 8)]);
}
//# sourceMappingURL=rfc1751.js.map