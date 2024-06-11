"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable max-classes-per-file -- Needs to be a wrapper for ws */
const eventemitter3_1 = require("eventemitter3");
/**
 * Provides `EventEmitter` interface for native browser `WebSocket`,
 * same, as `ws` package provides.
 */
class WSWrapper extends eventemitter3_1.EventEmitter {
    /**
     * Constructs a browser-safe websocket.
     *
     * @param url - URL to connect to.
     * @param _protocols - Not used.
     * @param _websocketOptions - Not used.
     */
    constructor(url, _protocols, _websocketOptions) {
        super();
        this.ws = new WebSocket(url);
        this.ws.onclose = (closeEvent) => {
            let reason;
            if (closeEvent.reason) {
                const enc = new TextEncoder();
                reason = enc.encode(closeEvent.reason);
            }
            this.emit('close', closeEvent.code, reason);
        };
        this.ws.onopen = () => {
            this.emit('open');
        };
        this.ws.onerror = (error) => {
            this.emit('error', error);
        };
        this.ws.onmessage = (message) => {
            this.emit('message', message.data);
        };
    }
    /**
     * Get the ready state of the websocket.
     *
     * @returns The Websocket's ready state.
     */
    get readyState() {
        return this.ws.readyState;
    }
    /**
     * Closes the websocket.
     *
     * @param code - Close code.
     * @param reason - Close reason.
     */
    close(code, reason) {
        if (this.readyState === 1) {
            this.ws.close(code, reason);
        }
    }
    /**
     * Sends a message over the Websocket connection.
     *
     * @param message - Message to send.
     */
    send(message) {
        this.ws.send(message);
    }
}
WSWrapper.CONNECTING = 0;
WSWrapper.OPEN = 1;
WSWrapper.CLOSING = 2;
WSWrapper.CLOSED = 3;
exports.default = WSWrapper;
//# sourceMappingURL=browser.js.map