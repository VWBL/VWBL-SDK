"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../../../errors");
const HashPrefix_1 = __importDefault(require("../HashPrefix"));
const sha512Half_1 = __importDefault(require("../sha512Half"));
const node_1 = require("./node");
const HEX = 16;
class LeafNode extends node_1.Node {
    constructor(tag, data, type) {
        super();
        this.tag = tag;
        this.type = type;
        this.data = data;
    }
    get hash() {
        switch (this.type) {
            case node_1.NodeType.ACCOUNT_STATE: {
                const leafPrefix = HashPrefix_1.default.LEAF_NODE.toString(HEX);
                return (0, sha512Half_1.default)(leafPrefix + this.data + this.tag);
            }
            case node_1.NodeType.TRANSACTION_NO_METADATA: {
                const txIDPrefix = HashPrefix_1.default.TRANSACTION_ID.toString(HEX);
                return (0, sha512Half_1.default)(txIDPrefix + this.data);
            }
            case node_1.NodeType.TRANSACTION_METADATA: {
                const txNodePrefix = HashPrefix_1.default.TRANSACTION_NODE.toString(HEX);
                return (0, sha512Half_1.default)(txNodePrefix + this.data + this.tag);
            }
            default:
                throw new errors_1.XrplError('Tried to hash a SHAMap node of unknown type.');
        }
    }
    addItem(tag, node) {
        throw new errors_1.XrplError('Cannot call addItem on a LeafNode');
        this.addItem(tag, node);
    }
}
exports.default = LeafNode;
//# sourceMappingURL=LeafNode.js.map