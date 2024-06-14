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
exports.uploadMetadataToIPFS = exports.uploadThumbnailToIPFS = exports.uploadEncryptedFileToIPFS = exports.testPinataAuthentication = void 0;
const axios_1 = __importDefault(require("axios"));
const buffer_1 = require("buffer");
const form_data_1 = __importDefault(require("form-data"));
const fs_1 = __importDefault(require("fs"));
const util_1 = require("../../util");
const pinataEndpoint = "https://api.pinata.cloud/pinning/pinFileToIPFS";
const createHeaders = (ipfsConfig) => {
    const headers = {
        pinata_api_key: ipfsConfig.apiKey,
        pinata_secret_api_key: ipfsConfig.apiSecret,
    };
    headers["Content-Type"] = "multipart/form-data";
    return headers;
};
const createHeadersOnNode = (ipfsConfig, formData) => {
    // eslint-disable-line
    const headers = {
        // eslint-disable-line
        pinata_api_key: ipfsConfig.apiKey,
        pinata_secret_api_key: ipfsConfig.apiSecret,
    };
    Object.assign(headers, formData.getHeaders());
    return headers;
};
const createConfig = (headers, // eslint-disable-line
progressType) => {
    return {
        headers: headers,
        onUploadProgress: (0, util_1.isRunningOnBrowser)()
            ? (progressEvent) => {
                // eslint-disable-line
                const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                console.log(`${progressType} Progress: ${progress}%`);
            }
            : undefined,
    };
};
const uploadFile = (formData, config) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.post(pinataEndpoint, formData, config);
        return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
    }
    catch (err) {
        // eslint-disable-line
        throw new Error(`Pinata upload failed: ${err.message}`);
    }
});
// Pinata Authentication Test Functions
const testPinataAuthentication = (ipfsConfig) => __awaiter(void 0, void 0, void 0, function* () {
    const headers = createHeaders(ipfsConfig);
    const config = {
        headers: headers,
    };
    try {
        const response = yield axios_1.default.get("https://api.pinata.cloud/data/testAuthentication", config);
        console.log("Pinata authentication succeeded:", response.data);
    }
    catch (err) {
        // eslint-disable-line
        console.error("Pinata authentication failed:", headers);
        throw new Error(`Pinata authentication failed: ${err.message}`);
    }
});
exports.testPinataAuthentication = testPinataAuthentication;
// Upload function for encrypted files
const uploadEncryptedFileToIPFS = (encryptedContent, ipfsConfig) => __awaiter(void 0, void 0, void 0, function* () {
    if (!ipfsConfig || !ipfsConfig.apiKey || !ipfsConfig.apiSecret) {
        throw new Error("Pinata API key or secret is not specified.");
    }
    let formData;
    let headers; // eslint-disable-line
    if (typeof encryptedContent === "string" || encryptedContent instanceof Uint8Array) {
        if ((0, util_1.isRunningOnNode)()) {
            formData = new form_data_1.default();
            const blob = buffer_1.Buffer.from(encryptedContent);
            formData.append("file", blob, "encrypted-file");
            headers = createHeadersOnNode(ipfsConfig, formData);
        }
        else {
            formData = new window.FormData();
            const blob = new Blob([encryptedContent], {
                type: "application/octet-stream",
            });
            formData.append("file", blob, "encrypted-file");
            headers = createHeaders(ipfsConfig);
        }
    }
    else {
        formData = new form_data_1.default();
        formData.append("file", encryptedContent, { filename: "encrypted-file" });
        headers = createHeadersOnNode(ipfsConfig, formData);
    }
    const config = createConfig(headers, "uploadMetadataToIPFS");
    const encryptedDataUrl = yield uploadFile(formData, config);
    return encryptedDataUrl;
});
exports.uploadEncryptedFileToIPFS = uploadEncryptedFileToIPFS;
// upload function for thumbnailImage
const uploadThumbnailToIPFS = (thumbnailImage, ipfsConfig) => __awaiter(void 0, void 0, void 0, function* () {
    if (!ipfsConfig || !ipfsConfig.apiKey || !ipfsConfig.apiSecret) {
        throw new Error("Pinata API key or secret is not specified.");
    }
    const formData = new form_data_1.default();
    let headers; // eslint-disable-line
    if ((0, util_1.isRunningOnNode)()) {
        if (typeof thumbnailImage === "string") {
            const stream = fs_1.default.createReadStream(thumbnailImage);
            formData.append("file", stream);
        }
        else if (thumbnailImage instanceof buffer_1.Buffer) {
            formData.append("file", thumbnailImage, "thumbnail");
        }
        else {
            throw new Error("Invalid type for thumbnailImage in Node.js environment");
        }
        headers = createHeadersOnNode(ipfsConfig, formData);
    }
    else {
        if (thumbnailImage instanceof File || thumbnailImage instanceof Blob) {
            formData.append("file", thumbnailImage);
        }
        else if (typeof thumbnailImage === "string") {
            const response = yield fetch(thumbnailImage);
            const blob = yield response.blob();
            formData.append("file", new File([blob], "thumbnail", { type: blob.type }));
        }
        else {
            throw new Error("Invalid type for thumbnailImage in browser environment");
        }
        headers = createHeaders(ipfsConfig);
    }
    const config = createConfig(headers, "uploadThumbnailToIPFS");
    const thumbnailImageUrl = yield uploadFile(formData, config);
    return thumbnailImageUrl;
});
exports.uploadThumbnailToIPFS = uploadThumbnailToIPFS;
// upload function for metadata
const uploadMetadataToIPFS = (name, description, previewImageUrl, encryptedDataUrls, mimeType, encryptLogic, ipfsConfig) => __awaiter(void 0, void 0, void 0, function* () {
    if (!ipfsConfig || !ipfsConfig.apiKey || !ipfsConfig.apiSecret) {
        throw new Error("Pinata API key or secret is not specified.");
    }
    const metadata = {
        name,
        description,
        image: previewImageUrl,
        encrypted_data: encryptedDataUrls,
        mime_type: mimeType,
        encrypt_logic: encryptLogic,
    };
    const metadataJSON = JSON.stringify(metadata);
    const formData = new form_data_1.default();
    let headers; // eslint-disable-line
    if ((0, util_1.isRunningOnNode)()) {
        formData.append("file", buffer_1.Buffer.from(metadataJSON), {
            filename: "metadata.json",
            contentType: "application/json",
        });
        headers = createHeadersOnNode(ipfsConfig, formData);
    }
    else {
        const blob = new Blob([metadataJSON], { type: "application/json" });
        formData.append("file", blob, "metadata.json");
        headers = createHeaders(ipfsConfig);
    }
    const config = createConfig(headers, "uploadMetadataToIPFS");
    const metadataUrl = yield uploadFile(formData, config);
    return metadataUrl;
});
exports.uploadMetadataToIPFS = uploadMetadataToIPFS;
//# sourceMappingURL=upload.js.map