"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ripemd160 = void 0;
const crypto_1 = require("crypto");
const wrapCryptoCreateHash_1 = __importDefault(require("../internal/wrapCryptoCreateHash"));
/**
 * Wrap node's native ripemd160 implementation in HashFn
 */
exports.ripemd160 = (0, wrapCryptoCreateHash_1.default)('ripemd160', crypto_1.createHash);
//# sourceMappingURL=index.js.map