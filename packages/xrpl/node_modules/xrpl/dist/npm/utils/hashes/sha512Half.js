"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sha512_1 = require("@xrplf/isomorphic/sha512");
const utils_1 = require("@xrplf/isomorphic/utils");
const HASH_BYTES = 32;
function sha512Half(hex) {
    return (0, utils_1.bytesToHex)((0, sha512_1.sha512)((0, utils_1.hexToBytes)(hex)).slice(0, HASH_BYTES));
}
exports.default = sha512Half;
//# sourceMappingURL=sha512Half.js.map