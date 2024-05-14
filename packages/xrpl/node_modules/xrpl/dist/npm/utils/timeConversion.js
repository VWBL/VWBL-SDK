"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isoTimeToRippleTime = exports.rippleTimeToISOTime = exports.unixTimeToRippleTime = exports.rippleTimeToUnixTime = void 0;
const RIPPLE_EPOCH_DIFF = 0x386d4380;
function rippleTimeToUnixTime(rpepoch) {
    return (rpepoch + RIPPLE_EPOCH_DIFF) * 1000;
}
exports.rippleTimeToUnixTime = rippleTimeToUnixTime;
function unixTimeToRippleTime(timestamp) {
    return Math.round(timestamp / 1000) - RIPPLE_EPOCH_DIFF;
}
exports.unixTimeToRippleTime = unixTimeToRippleTime;
function rippleTimeToISOTime(rippleTime) {
    return new Date(rippleTimeToUnixTime(rippleTime)).toISOString();
}
exports.rippleTimeToISOTime = rippleTimeToISOTime;
function isoTimeToRippleTime(iso8601) {
    const isoDate = typeof iso8601 === 'string' ? new Date(iso8601) : iso8601;
    return unixTimeToRippleTime(isoDate.getTime());
}
exports.isoTimeToRippleTime = isoTimeToRippleTime;
//# sourceMappingURL=timeConversion.js.map