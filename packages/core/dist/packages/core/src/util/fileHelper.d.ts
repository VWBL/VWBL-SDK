import { Base64DataUrl, FileOrPath } from "../vwbl";
export declare const toBase64FromFile: (file: File) => Promise<Base64DataUrl>;
export declare const getMimeType: (file: FileOrPath) => string;
export declare const toArrayBuffer: (blob: Blob) => Promise<ArrayBuffer>;
