"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Connection = exports.INTENTIONAL_DISCONNECT_CODE = void 0;
const utils_1 = require("@xrplf/isomorphic/utils");
const ws_1 = __importDefault(require("@xrplf/isomorphic/ws"));
const eventemitter3_1 = require("eventemitter3");
const errors_1 = require("../errors");
const ConnectionManager_1 = __importDefault(require("./ConnectionManager"));
const ExponentialBackoff_1 = __importDefault(require("./ExponentialBackoff"));
const RequestManager_1 = __importDefault(require("./RequestManager"));
const SECONDS_PER_MINUTE = 60;
const TIMEOUT = 20;
const CONNECTION_TIMEOUT = 5;
exports.INTENTIONAL_DISCONNECT_CODE = 4000;
function createWebSocket(url, config) {
    const options = {
        agent: config.agent,
    };
    if (config.headers) {
        options.headers = config.headers;
    }
    if (config.authorization != null) {
        options.headers = Object.assign(Object.assign({}, options.headers), { Authorization: `Basic ${btoa(config.authorization)}` });
    }
    const websocketOptions = Object.assign({}, options);
    return new ws_1.default(url, websocketOptions);
}
function websocketSendAsync(ws, message) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            ws.send(message, (error) => {
                if (error) {
                    reject(new errors_1.DisconnectedError(error.message, error));
                }
                else {
                    resolve();
                }
            });
        });
    });
}
class Connection extends eventemitter3_1.EventEmitter {
    constructor(url, options = {}) {
        super();
        this.ws = null;
        this.reconnectTimeoutID = null;
        this.heartbeatIntervalID = null;
        this.retryConnectionBackoff = new ExponentialBackoff_1.default({
            min: 100,
            max: SECONDS_PER_MINUTE * 1000,
        });
        this.requestManager = new RequestManager_1.default();
        this.connectionManager = new ConnectionManager_1.default();
        this.trace = () => { };
        this.url = url;
        this.config = Object.assign({ timeout: TIMEOUT * 1000, connectionTimeout: CONNECTION_TIMEOUT * 1000 }, options);
        if (typeof options.trace === 'function') {
            this.trace = options.trace;
        }
        else if (options.trace) {
            this.trace = console.log;
        }
    }
    get state() {
        return this.ws ? this.ws.readyState : ws_1.default.CLOSED;
    }
    get shouldBeConnected() {
        return this.ws !== null;
    }
    isConnected() {
        return this.state === ws_1.default.OPEN;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isConnected()) {
                return Promise.resolve();
            }
            if (this.state === ws_1.default.CONNECTING) {
                return this.connectionManager.awaitConnection();
            }
            if (!this.url) {
                return Promise.reject(new errors_1.ConnectionError('Cannot connect because no server was specified'));
            }
            if (this.ws != null) {
                return Promise.reject(new errors_1.XrplError('Websocket connection never cleaned up.', {
                    state: this.state,
                }));
            }
            const connectionTimeoutID = setTimeout(() => {
                this.onConnectionFailed(new errors_1.ConnectionError(`Error: connect() timed out after ${this.config.connectionTimeout} ms. If your internet connection is working, the ` +
                    `rippled server may be blocked or inaccessible. You can also try setting the 'connectionTimeout' option in the Client constructor.`));
            }, this.config.connectionTimeout);
            this.ws = createWebSocket(this.url, this.config);
            if (this.ws == null) {
                throw new errors_1.XrplError('Connect: created null websocket');
            }
            this.ws.on('error', (error) => this.onConnectionFailed(error));
            this.ws.on('error', () => clearTimeout(connectionTimeoutID));
            this.ws.on('close', (reason) => this.onConnectionFailed(reason));
            this.ws.on('close', () => clearTimeout(connectionTimeoutID));
            this.ws.once('open', () => {
                void this.onceOpen(connectionTimeoutID);
            });
            return this.connectionManager.awaitConnection();
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            this.clearHeartbeatInterval();
            if (this.reconnectTimeoutID !== null) {
                clearTimeout(this.reconnectTimeoutID);
                this.reconnectTimeoutID = null;
            }
            if (this.state === ws_1.default.CLOSED) {
                return Promise.resolve(undefined);
            }
            if (this.ws == null) {
                return Promise.resolve(undefined);
            }
            return new Promise((resolve) => {
                if (this.ws == null) {
                    resolve(undefined);
                }
                if (this.ws != null) {
                    this.ws.once('close', (code) => resolve(code));
                }
                if (this.ws != null && this.state !== ws_1.default.CLOSING) {
                    this.ws.close(exports.INTENTIONAL_DISCONNECT_CODE);
                }
            });
        });
    }
    reconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            this.emit('reconnect');
            yield this.disconnect();
            yield this.connect();
        });
    }
    request(request, timeout) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.shouldBeConnected || this.ws == null) {
                throw new errors_1.NotConnectedError(JSON.stringify(request), request);
            }
            const [id, message, responsePromise] = this.requestManager.createRequest(request, timeout !== null && timeout !== void 0 ? timeout : this.config.timeout);
            this.trace('send', message);
            websocketSendAsync(this.ws, message).catch((error) => {
                this.requestManager.reject(id, error);
            });
            return responsePromise;
        });
    }
    getUrl() {
        var _a;
        return (_a = this.url) !== null && _a !== void 0 ? _a : '';
    }
    onMessage(message) {
        this.trace('receive', message);
        let data;
        try {
            data = JSON.parse(message);
        }
        catch (error) {
            if (error instanceof Error) {
                this.emit('error', 'badMessage', error.message, message);
            }
            return;
        }
        if (data.type == null && data.error) {
            this.emit('error', data.error, data.error_message, data);
            return;
        }
        if (data.type) {
            this.emit(data.type, data);
        }
        if (data.type === 'response') {
            try {
                this.requestManager.handleResponse(data);
            }
            catch (error) {
                if (error instanceof Error) {
                    this.emit('error', 'badMessage', error.message, message);
                }
                else {
                    this.emit('error', 'badMessage', error, error);
                }
            }
        }
    }
    onceOpen(connectionTimeoutID) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.ws == null) {
                throw new errors_1.XrplError('onceOpen: ws is null');
            }
            this.ws.removeAllListeners();
            clearTimeout(connectionTimeoutID);
            this.ws.on('message', (message) => this.onMessage(message));
            this.ws.on('error', (error) => this.emit('error', 'websocket', error.message, error));
            this.ws.once('close', (code, reason) => {
                if (this.ws == null) {
                    throw new errors_1.XrplError('onceClose: ws is null');
                }
                this.clearHeartbeatInterval();
                this.requestManager.rejectAll(new errors_1.DisconnectedError(`websocket was closed, ${reason ? (0, utils_1.hexToString)((0, utils_1.bytesToHex)(reason)) : ''}`));
                this.ws.removeAllListeners();
                this.ws = null;
                if (code === undefined) {
                    const internalErrorCode = 1011;
                    this.emit('disconnected', internalErrorCode);
                }
                else {
                    this.emit('disconnected', code);
                }
                if (code !== exports.INTENTIONAL_DISCONNECT_CODE && code !== undefined) {
                    this.intentionalDisconnect();
                }
            });
            try {
                this.retryConnectionBackoff.reset();
                this.startHeartbeatInterval();
                this.connectionManager.resolveAllAwaiting();
                this.emit('connected');
            }
            catch (error) {
                if (error instanceof Error) {
                    this.connectionManager.rejectAllAwaiting(error);
                    yield this.disconnect().catch(() => { });
                }
            }
        });
    }
    intentionalDisconnect() {
        const retryTimeout = this.retryConnectionBackoff.duration();
        this.trace('reconnect', `Retrying connection in ${retryTimeout}ms.`);
        this.emit('reconnecting', this.retryConnectionBackoff.attempts);
        this.reconnectTimeoutID = setTimeout(() => {
            this.reconnect().catch((error) => {
                this.emit('error', 'reconnect', error.message, error);
            });
        }, retryTimeout);
    }
    clearHeartbeatInterval() {
        if (this.heartbeatIntervalID) {
            clearInterval(this.heartbeatIntervalID);
        }
    }
    startHeartbeatInterval() {
        this.clearHeartbeatInterval();
        this.heartbeatIntervalID = setInterval(() => {
            void this.heartbeat();
        }, this.config.timeout);
    }
    heartbeat() {
        return __awaiter(this, void 0, void 0, function* () {
            this.request({ command: 'ping' }).catch(() => __awaiter(this, void 0, void 0, function* () {
                return this.reconnect().catch((error) => {
                    this.emit('error', 'reconnect', error.message, error);
                });
            }));
        });
    }
    onConnectionFailed(errorOrCode) {
        if (this.ws) {
            this.ws.removeAllListeners();
            this.ws.on('error', () => {
            });
            this.ws.close();
            this.ws = null;
        }
        if (typeof errorOrCode === 'number') {
            this.connectionManager.rejectAllAwaiting(new errors_1.NotConnectedError(`Connection failed with code ${errorOrCode}.`, {
                code: errorOrCode,
            }));
        }
        else if (errorOrCode === null || errorOrCode === void 0 ? void 0 : errorOrCode.message) {
            this.connectionManager.rejectAllAwaiting(new errors_1.NotConnectedError(errorOrCode.message, errorOrCode));
        }
        else {
            this.connectionManager.rejectAllAwaiting(new errors_1.NotConnectedError('Connection failed.'));
        }
    }
}
exports.Connection = Connection;
//# sourceMappingURL=connection.js.map