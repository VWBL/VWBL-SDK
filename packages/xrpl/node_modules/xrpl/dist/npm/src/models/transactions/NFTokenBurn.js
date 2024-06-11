"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateNFTokenBurn = void 0;
const common_1 = require("./common");
function validateNFTokenBurn(tx) {
    (0, common_1.validateBaseTransaction)(tx);
    (0, common_1.validateRequiredField)(tx, 'NFTokenID', common_1.isString);
    (0, common_1.validateOptionalField)(tx, 'Owner', common_1.isAccount);
}
exports.validateNFTokenBurn = validateNFTokenBurn;
//# sourceMappingURL=NFTokenBurn.js.map