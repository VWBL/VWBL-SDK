"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadDirectoryToS3 = exports.uploadMetadata = exports.uploadThumbnail = exports.uploadEncryptedFile = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const credential_providers_1 = require("@aws-sdk/credential-providers");
const lib_storage_1 = require("@aws-sdk/lib-storage");
const fs = __importStar(require("fs"));
const util_1 = require("../../util");
const uploadEncryptedFile = (fileName, encryptedContent, uuid, awsConfig) => __awaiter(void 0, void 0, void 0, function* () {
    if (!awsConfig || !awsConfig.bucketName.content) {
        throw new Error("bucket is not specified.");
    }
    if (!awsConfig.idPoolId && !awsConfig.profile) {
        throw new Error("aws credential environment variable is not specified.");
    }
    const credentials = awsConfig.idPoolId
        ? (0, credential_providers_1.fromCognitoIdentityPool)({
            clientConfig: { region: awsConfig.region },
            identityPoolId: awsConfig.idPoolId,
        })
        : (0, credential_providers_1.fromIni)({ profile: awsConfig.profile });
    const s3Client = new client_s3_1.S3Client({ credentials });
    const key = `data/${uuid}-${fileName}.vwbl`;
    const upload = new lib_storage_1.Upload({
        client: s3Client,
        params: {
            Bucket: awsConfig.bucketName.content,
            Key: key,
            Body: encryptedContent,
            ACL: "public-read",
        },
    });
    yield upload.done();
    return `${awsConfig.cloudFrontUrl.replace(/\/$/, "")}/${key}`;
});
exports.uploadEncryptedFile = uploadEncryptedFile;
const uploadThumbnail = (thumbnailImage, uuid, awsConfig) => __awaiter(void 0, void 0, void 0, function* () {
    if (!awsConfig || !awsConfig.bucketName.content) {
        throw new Error("bucket is not specified.");
    }
    if (!awsConfig.idPoolId && !awsConfig.profile) {
        throw new Error("aws credential environment variable is not specified.");
    }
    const credentials = awsConfig.idPoolId
        ? (0, credential_providers_1.fromCognitoIdentityPool)({
            clientConfig: { region: awsConfig.region },
            identityPoolId: awsConfig.idPoolId,
        })
        : (0, credential_providers_1.fromIni)({ profile: awsConfig.profile });
    const s3Client = new client_s3_1.S3Client({ credentials });
    const fileName = thumbnailImage instanceof File ? thumbnailImage.name : thumbnailImage.split("/").slice(-1)[0]; //ファイル名の取得だけのためにpathを使いたくなかった
    const key = `data/${uuid}-${fileName}`;
    const type = (0, util_1.getMimeType)(thumbnailImage);
    const uploadCommand = new client_s3_1.PutObjectCommand({
        Bucket: awsConfig.bucketName.content,
        Key: key,
        Body: thumbnailImage instanceof File ? thumbnailImage : yield fs.promises.readFile(thumbnailImage),
        ContentType: type,
        ACL: "public-read",
    });
    yield s3Client.send(uploadCommand);
    return `${awsConfig.cloudFrontUrl.replace(/\/$/, "")}/${key}`;
});
exports.uploadThumbnail = uploadThumbnail;
const uploadMetadata = (tokenId, name, description, previewImageUrl, encryptedDataUrls, mimeType, encryptLogic, awsConfig) => __awaiter(void 0, void 0, void 0, function* () {
    if (!awsConfig || !awsConfig.bucketName.content) {
        throw new Error("bucket is not specified.");
    }
    if (!awsConfig.idPoolId && !awsConfig.profile) {
        throw new Error("aws credential environment variable is not specified.");
    }
    const credentials = awsConfig.idPoolId
        ? (0, credential_providers_1.fromCognitoIdentityPool)({
            clientConfig: { region: awsConfig.region },
            identityPoolId: awsConfig.idPoolId,
        })
        : (0, credential_providers_1.fromIni)({ profile: awsConfig.profile });
    const s3Client = new client_s3_1.S3Client({ credentials });
    const metadata = {
        name,
        description,
        image: previewImageUrl,
        encrypted_data: encryptedDataUrls,
        mime_type: mimeType,
        encrypt_logic: encryptLogic,
    };
    const key = `metadata/${tokenId}`;
    const uploadCommand = new client_s3_1.PutObjectCommand({
        Bucket: awsConfig.bucketName.metadata,
        Key: key,
        Body: JSON.stringify(metadata),
        ContentType: "application/json",
        ACL: "public-read",
    });
    yield s3Client.send(uploadCommand);
    return `${awsConfig.cloudFrontUrl.replace(/\/$/, "")}/${key}`;
});
exports.uploadMetadata = uploadMetadata;
const uploadDirectoryToS3 = (directoryPath, awsConfig) => {
    if (!awsConfig || !awsConfig.bucketName.content) {
        throw new Error("bucket is not specified.");
    }
    if (!awsConfig.idPoolId && !awsConfig.profile) {
        throw new Error("aws credential environment variable is not specified.");
    }
    const credentials = awsConfig.idPoolId
        ? (0, credential_providers_1.fromCognitoIdentityPool)({
            clientConfig: { region: awsConfig.region },
            identityPoolId: awsConfig.idPoolId,
        })
        : (0, credential_providers_1.fromIni)({ profile: awsConfig.profile });
    const s3Client = new client_s3_1.S3Client({ credentials });
    fs.readdir(directoryPath, (err, files) => {
        if (err)
            throw err;
        files.forEach((file) => {
            const filePath = `${directoryPath}/${file}`;
            fs.readFile(filePath, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
                if (err)
                    throw err;
                const upload = new lib_storage_1.Upload({
                    client: s3Client,
                    params: {
                        Bucket: awsConfig.bucketName.content,
                        Key: `${directoryPath}/${file}`,
                        Body: data,
                        ACL: "public-read",
                    },
                });
                yield upload.done();
            }));
        });
    });
};
exports.uploadDirectoryToS3 = uploadDirectoryToS3;
//# sourceMappingURL=upload.js.map