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
exports.toArrayBuffer = exports.getMimeType = exports.toBase64FromFile = void 0;
const mime_types_1 = __importDefault(require("mime-types"));
const path_1 = __importDefault(require("path"));
const envUtil_1 = require("./envUtil");
const toBase64FromFile = (file) => __awaiter(void 0, void 0, void 0, function* () {
    if ((0, envUtil_1.isRunningOnBrowser)()) {
        return new Promise((resolve, reject) => {
            const reader = new window.FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const result = reader.result;
                if (!result || typeof result !== "string") {
                    reject("cannot convert to base64 string");
                }
                else {
                    resolve(result);
                }
            };
        });
    }
    else {
        return new Promise((resolve, reject) => {
            try {
                const arrayBuffer = file.arrayBuffer();
                arrayBuffer
                    .then((buffer) => {
                    const base64 = Buffer.from(buffer).toString("base64");
                    const mimetype = (0, exports.getMimeType)(file.name);
                    const dataUrl = `data:${mimetype};base64,${base64}`;
                    resolve(dataUrl);
                })
                    .catch(reject);
            }
            catch (error) {
                reject(error);
            }
        });
    }
});
exports.toBase64FromFile = toBase64FromFile;
const getMimeType = (file) => {
    if (typeof file === "string") {
        const fileExtension = path_1.default.extname(file);
        return mime_types_1.default.lookup(fileExtension) || "";
    }
    else {
        return file.type || "";
    }
};
exports.getMimeType = getMimeType;
const toArrayBuffer = (blob) => __awaiter(void 0, void 0, void 0, function* () {
    if ((0, envUtil_1.isRunningOnBrowser)()) {
        return new Promise((resolve, reject) => {
            const reader = new window.FileReader();
            reader.readAsArrayBuffer(blob);
            reader.onload = () => {
                const result = reader.result;
                if (!result || !(result instanceof Uint8Array)) {
                    reject("cannot convert to ArrayBuffer");
                }
                else {
                    resolve(result);
                }
            };
            reader.onerror = (error) => reject(error);
        });
    }
    return yield blob.arrayBuffer();
});
exports.toArrayBuffer = toArrayBuffer;
//# sourceMappingURL=fileHelper.js.map