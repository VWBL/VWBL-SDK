"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
class Socket extends ws_1.default {
    constructor(...args) {
        super(args[0], args[1], args[2]);
        this.setMaxListeners(Infinity);
    }
}
exports.default = Socket;
//# sourceMappingURL=index.js.map