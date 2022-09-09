import AWS from "aws-sdk";
import * as Stream from "stream";

import { getMimeType, toArrayBuffer } from "../../util/fileHelper";
import { PlainMetadata } from "../../vwbl/metadata";
import { EncryptLogic } from "../../vwbl/types";
import { AWSConfig } from "./types";

export const uploadEncryptedFile = async (
  fileName: string,
  encryptedContent: string | ArrayBuffer | Stream,
  uuid: string,
  awsConfig?: AWSConfig
): Promise<string> => {
  if (!awsConfig || !awsConfig.bucketName.content) {
    throw new Error("bucket is not specified.");
  }
  const uploadEncrypted = new AWS.S3.ManagedUpload({
    params: {
      Bucket: awsConfig.bucketName.content,
      Key: `data/${uuid}-${fileName}.vwbl`,
      Body: encryptedContent,
      ACL: "public-read",
    },
  });
  const encryptedData = await uploadEncrypted.promise();
  return `${awsConfig.cloudFrontUrl}/${encryptedData.Key}`;
};

export const uploadThumbnail = async (thumbnailImage: File, uuid: string, awsConfig?: AWSConfig): Promise<string> => {
  if (!awsConfig || !awsConfig.bucketName.content) {
    throw new Error("bucket is not specified.");
  }
  const type = getMimeType(thumbnailImage);
  const isRunningOnBrowser = typeof window !== "undefined";
  const uploadThumbnail = new AWS.S3.ManagedUpload({
    params: {
      Bucket: awsConfig.bucketName.content,
      Key: `data/${uuid}-${thumbnailImage.name}`,
      Body: isRunningOnBrowser ? thumbnailImage : await toArrayBuffer(thumbnailImage),
      ContentType: type,
      ACL: "public-read",
    },
  });
  const thumbnailData = await uploadThumbnail.promise();
  return `${awsConfig.cloudFrontUrl.replace(/\/$/, "")}/${thumbnailData.Key}`;
};

export const uploadMetadata = async (
  tokenId: number,
  name: string,
  description: string,
  previewImageUrl: string,
  encryptedDataUrls: string[],
  mimeType: string,
  encryptLogic: EncryptLogic,
  awsConfig?: AWSConfig
): Promise<void> => {
  if (!awsConfig || !awsConfig.bucketName.metadata) {
    throw new Error("bucket is not specified.");
  }
  const metadata: PlainMetadata = {
    name,
    description,
    image: previewImageUrl,
    encrypted_data: encryptedDataUrls,
    mime_type: mimeType,
    encrypt_logic: encryptLogic,
  };
  const upload = new AWS.S3.ManagedUpload({
    params: {
      Bucket: awsConfig.bucketName.metadata,
      Key: `metadata/${tokenId}`,
      Body: JSON.stringify(metadata),
      ContentType: "application/json",
      ACL: "public-read",
    },
  });
  await upload.promise();
};
