"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../../../errors");
const HashPrefix_1 = __importDefault(require("../HashPrefix"));
const sha512Half_1 = __importDefault(require("../sha512Half"));
const LeafNode_1 = __importDefault(require("./LeafNode"));
const node_1 = require("./node");
const HEX_ZERO = '0000000000000000000000000000000000000000000000000000000000000000';
const SLOT_MAX = 15;
const HEX = 16;
class InnerNode extends node_1.Node {
    constructor(depth = 0) {
        super();
        this.leaves = {};
        this.type = node_1.NodeType.INNER;
        this.depth = depth;
        this.empty = true;
    }
    get hash() {
        if (this.empty) {
            return HEX_ZERO;
        }
        let hex = '';
        for (let iter = 0; iter <= SLOT_MAX; iter++) {
            const child = this.leaves[iter];
            const hash = child == null ? HEX_ZERO : child.hash;
            hex += hash;
        }
        const prefix = HashPrefix_1.default.INNER_NODE.toString(HEX);
        return (0, sha512Half_1.default)(prefix + hex);
    }
    addItem(tag, node) {
        const existingNode = this.getNode(parseInt(tag[this.depth], HEX));
        if (existingNode === undefined) {
            this.setNode(parseInt(tag[this.depth], HEX), node);
            return;
        }
        if (existingNode instanceof InnerNode) {
            existingNode.addItem(tag, node);
        }
        else if (existingNode instanceof LeafNode_1.default) {
            if (existingNode.tag === tag) {
                throw new errors_1.XrplError('Tried to add a node to a SHAMap that was already in there.');
            }
            else {
                const newInnerNode = new InnerNode(this.depth + 1);
                newInnerNode.addItem(existingNode.tag, existingNode);
                newInnerNode.addItem(tag, node);
                this.setNode(parseInt(tag[this.depth], HEX), newInnerNode);
            }
        }
    }
    setNode(slot, node) {
        if (slot < 0 || slot > SLOT_MAX) {
            throw new errors_1.XrplError('Invalid slot: slot must be between 0-15.');
        }
        this.leaves[slot] = node;
        this.empty = false;
    }
    getNode(slot) {
        if (slot < 0 || slot > SLOT_MAX) {
            throw new errors_1.XrplError('Invalid slot: slot must be between 0-15.');
        }
        return this.leaves[slot];
    }
}
exports.default = InnerNode;
//# sourceMappingURL=InnerNode.js.map