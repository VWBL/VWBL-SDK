/// <reference types="node" />
import { EventEmitter } from 'eventemitter3';
interface WSWrapperOptions {
    perMessageDeflate: boolean;
    handshakeTimeout: number;
    protocolVersion: number;
    origin: string;
    maxPayload: number;
    followRedirects: boolean;
    maxRedirects: number;
}
/**
 * Provides `EventEmitter` interface for native browser `WebSocket`,
 * same, as `ws` package provides.
 */
export default class WSWrapper extends EventEmitter {
    static CONNECTING: number;
    static OPEN: number;
    static CLOSING: number;
    static CLOSED: number;
    private readonly ws;
    /**
     * Constructs a browser-safe websocket.
     *
     * @param url - URL to connect to.
     * @param _protocols - Not used.
     * @param _websocketOptions - Not used.
     */
    constructor(url: string, _protocols: string | string[] | WSWrapperOptions | undefined, _websocketOptions: WSWrapperOptions);
    /**
     * Get the ready state of the websocket.
     *
     * @returns The Websocket's ready state.
     */
    get readyState(): number;
    /**
     * Closes the websocket.
     *
     * @param code - Close code.
     * @param reason - Close reason.
     */
    close(code?: number, reason?: Buffer): void;
    /**
     * Sends a message over the Websocket connection.
     *
     * @param message - Message to send.
     */
    send(message: string): void;
}
export {};
//# sourceMappingURL=browser.d.ts.map