"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sha512 = void 0;
const sha512_1 = require("@noble/hashes/sha512");
const wrapNoble_1 = __importDefault(require("../internal/wrapNoble"));
/**
 * Wrap noble-libs's sha512 implementation in HashFn
 */
exports.sha512 = (0, wrapNoble_1.default)(sha512_1.sha512);
//# sourceMappingURL=browser.js.map