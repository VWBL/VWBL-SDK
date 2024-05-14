"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ripemd160 = void 0;
const ripemd160_1 = require("@noble/hashes/ripemd160");
const wrapNoble_1 = __importDefault(require("../internal/wrapNoble"));
/**
 * Wrap noble-libs's ripemd160 implementation in HashFn
 */
exports.ripemd160 = (0, wrapNoble_1.default)(ripemd160_1.ripemd160);
//# sourceMappingURL=browser.js.map