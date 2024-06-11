"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Normalize a string, number array, or Uint8Array to a string or Uint8Array.
 * Both node and noble lib functions accept these types.
 *
 * @param input - value to normalize
 */
function normalizeInput(input) {
    return Array.isArray(input) ? new Uint8Array(input) : input;
}
exports.default = normalizeInput;
//# sourceMappingURL=normalizeInput.js.map