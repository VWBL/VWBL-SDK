"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertStringToHex = exports.convertHexToString = void 0;
const utils_1 = require("@xrplf/isomorphic/utils");
function convertStringToHex(string) {
    return (0, utils_1.stringToHex)(string);
}
exports.convertStringToHex = convertStringToHex;
function convertHexToString(hex, encoding = 'utf8') {
    return (0, utils_1.hexToString)(hex, encoding);
}
exports.convertHexToString = convertHexToString;
//# sourceMappingURL=stringConversion.js.map