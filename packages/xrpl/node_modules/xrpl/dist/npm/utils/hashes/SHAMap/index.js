"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const InnerNode_1 = __importDefault(require("./InnerNode"));
const LeafNode_1 = __importDefault(require("./LeafNode"));
class SHAMap {
    constructor() {
        this.root = new InnerNode_1.default(0);
    }
    get hash() {
        return this.root.hash;
    }
    addItem(tag, data, type) {
        this.root.addItem(tag, new LeafNode_1.default(tag, data, type));
    }
}
__exportStar(require("./node"), exports);
exports.default = SHAMap;
//# sourceMappingURL=index.js.map