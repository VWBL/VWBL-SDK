"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRunningOnBrowser = exports.isRunningOnNode = void 0;
function isRunningOnNode() {
    return typeof process !== "undefined" && process.versions != null && process.versions.node != null;
}
exports.isRunningOnNode = isRunningOnNode;
function isRunningOnBrowser() {
    return typeof window !== "undefined";
}
exports.isRunningOnBrowser = isRunningOnBrowser;
//# sourceMappingURL=envUtil.js.map