"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertHelper = {
    ok(cond, message) {
        if (!cond) {
            throw new Error(message);
        }
    },
};
exports.default = assertHelper;
//# sourceMappingURL=assert.js.map