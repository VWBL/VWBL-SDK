import AWS from "aws-sdk";

import { createRandomKey } from "../util/cryptoHelper";
import { getMimeType, toArrayBuffer } from "../util/imageEditor";
import { PlainMetadata } from "../vwbl/metadata";
import { UploadFilesRetVal } from "../vwbl/types";
import { AWSConfig } from "./types";

export const uploadAll = async (
  plainData: File,
  thumbnailImage: File,
  encryptedContent: string,
  awsConfig?: AWSConfig
): Promise<UploadFilesRetVal> => {
  if (!awsConfig || !awsConfig.bucketName.content) {
    throw new Error("bucket is not specified.");
  }
  const key = createRandomKey();
  const uploadEncrypted = new AWS.S3.ManagedUpload({
    params: {
      Bucket: awsConfig.bucketName.content,
      Key: `data/${key}-${plainData.name}.vwbl`,
      Body: encryptedContent,
      ContentType: "text/plain",
    },
  });
  const encryptedData = await uploadEncrypted.promise();
  const encryptedDataUrl = `${awsConfig.cloudFrontUrl}/${encryptedData.Key}`;
  const type = getMimeType(thumbnailImage);
  const isRunningOnBrowser = typeof window !== "undefined";
  const uploadThumbnail = new AWS.S3.ManagedUpload({
    params: {
      Bucket: awsConfig.bucketName.content,
      Key: `data/${key}-${thumbnailImage.name}`,
      Body: isRunningOnBrowser ? thumbnailImage : await toArrayBuffer(thumbnailImage),
      ContentType: type,
    },
  });
  const thumbnailData = await uploadThumbnail.promise();
  const thumbnailImageUrl = `${awsConfig.cloudFrontUrl.replace(/\/$/, "")}/${thumbnailData.Key}`;
  return { encryptedDataUrl, thumbnailImageUrl };
};

export const uploadMetadata = async (
  tokenId: number,
  name: string,
  description: string,
  previewImageUrl: string,
  encryptedDataUrl: string,
  mimeType: string,
  awsConfig?: AWSConfig
): Promise<void> => {
  if (!awsConfig || !awsConfig.bucketName.metadata) {
    throw new Error("bucket is not specified.");
  }
  const metadata: PlainMetadata = {
    name,
    description,
    image: previewImageUrl,
    encrypted_data: encryptedDataUrl,
    mime_type: mimeType,
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
