"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sha256 = void 0;
const crypto_1 = require("crypto");
const wrapCryptoCreateHash_1 = __importDefault(require("../internal/wrapCryptoCreateHash"));
/**
 * Wrap node's native sha256 implementation in HashFn
 */
exports.sha256 = (0, wrapCryptoCreateHash_1.default)('sha256', crypto_1.createHash);
//# sourceMappingURL=index.js.map