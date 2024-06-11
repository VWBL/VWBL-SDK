"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.omitBy = exports.groupBy = void 0;
function groupBy(array, iteratee) {
    function predicate(acc, value, index, arrayReference) {
        const key = iteratee(value, index, arrayReference) || 0;
        const group = acc[key] || [];
        group.push(value);
        acc[key] = group;
        return acc;
    }
    return array.reduce(predicate, {});
}
exports.groupBy = groupBy;
function omitBy(obj, predicate) {
    const keys = Object.keys(obj);
    const keysToKeep = keys.filter((kb) => !predicate(obj[kb], kb));
    return keysToKeep.reduce((acc, key) => {
        acc[key] = obj[key];
        return acc;
    }, {});
}
exports.omitBy = omitBy;
//# sourceMappingURL=collections.js.map