"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sha512 = void 0;
const crypto_1 = require("crypto");
const wrapCryptoCreateHash_1 = __importDefault(require("../internal/wrapCryptoCreateHash"));
/**
 * Wrap node's native sha512 implementation in HashFn
 */
exports.sha512 = (0, wrapCryptoCreateHash_1.default)('sha512', crypto_1.createHash);
//# sourceMappingURL=index.js.map