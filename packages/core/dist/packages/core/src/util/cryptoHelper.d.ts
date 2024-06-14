/// <reference types="node" />
import * as Stream from "stream";
import * as uuid from "uuid";
export declare const createRandomKey: (<T extends ArrayLike<number>>(options: uuid.V4Options | null | undefined, buffer: T, offset?: number | undefined) => T) & ((options?: uuid.V4Options | undefined) => string);
export declare const encryptString: (message: string, key: string) => string;
export declare const decryptString: (cipherText: string, key: string) => string;
export declare const encryptFileOnBrowser: (file: File, key: string) => Promise<Uint8Array>;
export declare const decryptFileOnBrowser: (encryptedFile: ArrayBuffer, key: string) => Promise<ArrayBuffer>;
export declare const encryptFileOnNode: (file: File, key: string) => Promise<Uint8Array>;
export declare const decryptFileOnNode: (encryptedFile: ArrayBuffer, key: string) => ArrayBuffer;
export declare const encryptStream: (stream: Stream, key: string) => Stream.Readable;
export declare const decryptStream: (stream: Stream, key: string) => Stream;
export declare const encryptFile: (file: File, key: string) => Promise<Uint8Array>;
export declare const decryptFile: ((encryptedFile: ArrayBuffer, key: string) => Promise<ArrayBuffer>) | ((encryptedFile: ArrayBuffer, key: string) => ArrayBuffer);
