declare class XrplError extends Error {
    readonly name: string;
    readonly message: string;
    readonly data?: unknown;
    constructor(message?: string, data?: unknown);
    toString(): string;
    inspect(): string;
}
declare class RippledError extends XrplError {
}
declare class UnexpectedError extends XrplError {
}
declare class ConnectionError extends XrplError {
}
declare class NotConnectedError extends ConnectionError {
}
declare class DisconnectedError extends ConnectionError {
}
declare class RippledNotInitializedError extends ConnectionError {
}
declare class TimeoutError extends ConnectionError {
}
declare class ResponseFormatError extends ConnectionError {
}
declare class ValidationError extends XrplError {
}
declare class XRPLFaucetError extends XrplError {
}
declare class NotFoundError extends XrplError {
    constructor(message?: string);
}
export { XrplError, UnexpectedError, ConnectionError, RippledError, NotConnectedError, DisconnectedError, RippledNotInitializedError, TimeoutError, ResponseFormatError, ValidationError, NotFoundError, XRPLFaucetError, };
//# sourceMappingURL=errors.d.ts.map