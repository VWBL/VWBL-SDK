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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptFile = exports.encryptFile = exports.decryptStream = exports.encryptStream = exports.decryptFileOnNode = exports.encryptFileOnNode = exports.decryptFileOnBrowser = exports.encryptFileOnBrowser = exports.decryptString = exports.encryptString = exports.createRandomKey = void 0;
const crypto_1 = __importDefault(require("crypto"));
const crypto_js_1 = __importDefault(require("crypto-js"));
const uuid = __importStar(require("uuid"));
const fileHelper_1 = require("./fileHelper");
exports.createRandomKey = uuid.v4;
const encryptString = (message, key) => {
    return crypto_js_1.default.AES.encrypt(message, key).toString();
};
exports.encryptString = encryptString;
const decryptString = (cipherText, key) => {
    return crypto_js_1.default.AES.decrypt(cipherText, key).toString(crypto_js_1.default.enc.Utf8);
};
exports.decryptString = decryptString;
const encryptFileOnBrowser = (file, key) => __awaiter(void 0, void 0, void 0, function* () {
    const crypto = window.crypto;
    const subtle = crypto.subtle;
    const aes = {
        name: "AES-CBC",
        iv: new Uint8Array(16),
    };
    const aesAlgorithmKeyGen = {
        name: "AES-CBC",
        length: 256,
    };
    // UUID v4から-をとるとちょうど32文字 = 256bite
    const keyData = new TextEncoder().encode(key.replace(/-/g, ""));
    const aesKey = yield subtle.importKey("raw", keyData, aesAlgorithmKeyGen, true, ["encrypt"]);
    return new Uint8Array(yield subtle.encrypt(aes, aesKey, yield file.arrayBuffer()));
});
exports.encryptFileOnBrowser = encryptFileOnBrowser;
const decryptFileOnBrowser = (encryptedFile, key) => __awaiter(void 0, void 0, void 0, function* () {
    const crypto = window.crypto;
    const subtle = crypto.subtle;
    const aes = {
        name: "AES-CBC",
        iv: new Uint8Array(16),
    };
    const aesAlgorithmKeyGen = {
        name: "AES-CBC",
        length: 256,
    };
    const keyData = new TextEncoder().encode(key.replace(/-/g, ""));
    const aesKey = yield subtle.importKey("raw", keyData, aesAlgorithmKeyGen, true, ["decrypt"]);
    return yield subtle.decrypt(aes, aesKey, encryptedFile);
});
exports.decryptFileOnBrowser = decryptFileOnBrowser;
const encryptFileOnNode = (file, key) => __awaiter(void 0, void 0, void 0, function* () {
    const keyData = new TextEncoder().encode(key.replace(/-/g, ""));
    const cipher = crypto_1.default.createCipheriv("aes-256-cbc", keyData, new Uint8Array(16));
    const start = cipher.update(Buffer.from(yield (0, fileHelper_1.toArrayBuffer)(file)));
    const final = cipher.final();
    return new Uint8Array(Buffer.concat([start, final]).buffer);
});
exports.encryptFileOnNode = encryptFileOnNode;
const decryptFileOnNode = (encryptedFile, key) => {
    const keyData = new TextEncoder().encode(key.replace(/-/g, ""));
    const decipher = crypto_1.default.createDecipheriv("aes-256-cbc", keyData, new Uint8Array(16));
    const start = decipher.update(Buffer.from(encryptedFile));
    const final = decipher.final();
    return Buffer.concat([start, final]).buffer;
};
exports.decryptFileOnNode = decryptFileOnNode;
const encryptStream = (stream, key) => {
    const keyData = new TextEncoder().encode(key.replace(/-/g, ""));
    const cipher = crypto_1.default.createCipheriv("aes-256-cbc", keyData, new Uint8Array(16));
    return stream.pipe(cipher);
};
exports.encryptStream = encryptStream;
const decryptStream = (stream, key) => {
    const keyData = new TextEncoder().encode(key.replace(/-/g, ""));
    const decipher = crypto_1.default.createDecipheriv("aes-256-cbc", keyData, new Uint8Array(16));
    return stream.pipe(decipher);
};
exports.decryptStream = decryptStream;
exports.encryptFile = typeof window === "undefined" ? exports.encryptFileOnNode : exports.encryptFileOnBrowser;
exports.decryptFile = typeof window === "undefined" ? exports.decryptFileOnNode : exports.decryptFileOnBrowser;
//# sourceMappingURL=cryptoHelper.js.map