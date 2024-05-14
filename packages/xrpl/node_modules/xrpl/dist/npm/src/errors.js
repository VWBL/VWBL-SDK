"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XRPLFaucetError = exports.NotFoundError = exports.ValidationError = exports.ResponseFormatError = exports.TimeoutError = exports.RippledNotInitializedError = exports.DisconnectedError = exports.NotConnectedError = exports.RippledError = exports.ConnectionError = exports.UnexpectedError = exports.XrplError = void 0;
class XrplError extends Error {
    constructor(message = '', data) {
        super(message);
        this.name = this.constructor.name;
        this.message = message;
        this.data = data;
        if (Error.captureStackTrace != null) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
    toString() {
        let result = `[${this.name}(${this.message}`;
        if (this.data) {
            result += `, ${JSON.stringify(this.data)}`;
        }
        result += ')]';
        return result;
    }
    inspect() {
        return this.toString();
    }
}
exports.XrplError = XrplError;
class RippledError extends XrplError {
}
exports.RippledError = RippledError;
class UnexpectedError extends XrplError {
}
exports.UnexpectedError = UnexpectedError;
class ConnectionError extends XrplError {
}
exports.ConnectionError = ConnectionError;
class NotConnectedError extends ConnectionError {
}
exports.NotConnectedError = NotConnectedError;
class DisconnectedError extends ConnectionError {
}
exports.DisconnectedError = DisconnectedError;
class RippledNotInitializedError extends ConnectionError {
}
exports.RippledNotInitializedError = RippledNotInitializedError;
class TimeoutError extends ConnectionError {
}
exports.TimeoutError = TimeoutError;
class ResponseFormatError extends ConnectionError {
}
exports.ResponseFormatError = ResponseFormatError;
class ValidationError extends XrplError {
}
exports.ValidationError = ValidationError;
class XRPLFaucetError extends XrplError {
}
exports.XRPLFaucetError = XRPLFaucetError;
class NotFoundError extends XrplError {
    constructor(message = 'Not found') {
        super(message);
    }
}
exports.NotFoundError = NotFoundError;
//# sourceMappingURL=errors.js.map