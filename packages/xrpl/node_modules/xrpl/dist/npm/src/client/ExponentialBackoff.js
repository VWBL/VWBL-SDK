"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DEFAULT_MIN = 100;
const DEFAULT_MAX = 1000;
class ExponentialBackoff {
    constructor(opts = {}) {
        var _a, _b;
        this.factor = 2;
        this.numAttempts = 0;
        this.ms = (_a = opts.min) !== null && _a !== void 0 ? _a : DEFAULT_MIN;
        this.max = (_b = opts.max) !== null && _b !== void 0 ? _b : DEFAULT_MAX;
    }
    get attempts() {
        return this.numAttempts;
    }
    duration() {
        const ms = this.ms * Math.pow(this.factor, this.numAttempts);
        this.numAttempts += 1;
        return Math.floor(Math.min(ms, this.max));
    }
    reset() {
        this.numAttempts = 0;
    }
}
exports.default = ExponentialBackoff;
//# sourceMappingURL=ExponentialBackoff.js.map