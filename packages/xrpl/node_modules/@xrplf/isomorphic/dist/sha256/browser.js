"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sha256 = void 0;
const sha256_1 = require("@noble/hashes/sha256");
const wrapNoble_1 = __importDefault(require("../internal/wrapNoble"));
/**
 * Wrap noble-libs's sha256 implementation in HashFn
 */
exports.sha256 = (0, wrapNoble_1.default)(sha256_1.sha256);
//# sourceMappingURL=browser.js.map