"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDeletedNode = exports.isModifiedNode = exports.isCreatedNode = void 0;
function isCreatedNode(node) {
    return Object.prototype.hasOwnProperty.call(node, `CreatedNode`);
}
exports.isCreatedNode = isCreatedNode;
function isModifiedNode(node) {
    return Object.prototype.hasOwnProperty.call(node, `ModifiedNode`);
}
exports.isModifiedNode = isModifiedNode;
function isDeletedNode(node) {
    return Object.prototype.hasOwnProperty.call(node, `DeletedNode`);
}
exports.isDeletedNode = isDeletedNode;
//# sourceMappingURL=metadata.js.map