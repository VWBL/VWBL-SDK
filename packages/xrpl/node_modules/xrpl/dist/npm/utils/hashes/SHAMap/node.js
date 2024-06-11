"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Node = exports.NodeType = void 0;
var NodeType;
(function (NodeType) {
    NodeType[NodeType["INNER"] = 1] = "INNER";
    NodeType[NodeType["TRANSACTION_NO_METADATA"] = 2] = "TRANSACTION_NO_METADATA";
    NodeType[NodeType["TRANSACTION_METADATA"] = 3] = "TRANSACTION_METADATA";
    NodeType[NodeType["ACCOUNT_STATE"] = 4] = "ACCOUNT_STATE";
})(NodeType || (exports.NodeType = NodeType = {}));
class Node {
}
exports.Node = Node;
//# sourceMappingURL=node.js.map