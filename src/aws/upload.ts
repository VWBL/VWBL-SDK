import AWS from "aws-sdk";

import { createRandomKey } from "../util/cryptoHelper";
import { getMimeType, toArrayBuffer } from "../util/imageEditor";
import { PlainMetadata } from "../vwbl/metadata";
import { UploadFilesRetVal } from "../vwbl/types";
import { AWSConfig } from "./types";

export const uploadAll = async (
  plainData: File | Buffer,
  thumbnailImage: File | Buffer,
  encryptedContent: string,
  awsConfig?: AWSConfig
): Promise<UploadFilesRetVal> => {
  if (!awsConfig || !awsConfig.bucketName.content) {
    throw new Error("bucket is not specified.");
  }
  const type = await getMimeType(thumbnailImage);
  if (!type) {
    throw new Error("Failed to get mime")
  }
  const key = createRandomKey();
  const isPlainDataInstanceofFile = plainData instanceof File;
  const isThumbnailInstanceofFile = thumbnailImage instanceof File;
  const plainFileName = isPlainDataInstanceofFile ?`${plainData.name}-${key}` : key;
  const uploadEncrypted = new AWS.S3.ManagedUpload({
    params: {
      Bucket: awsConfig.bucketName.content,
      Key: `data/${plainFileName}.vwbl`,
      Body: encryptedContent,
      ContentType: "text/plain",
      ACL: "public-read",
    },
  });
  const encryptedData = await uploadEncrypted.promise();
  const encryptedDataUrl = `${awsConfig.cloudFrontUrl}/${encryptedData.Key}`;
  const thumbnailFileName = isThumbnailInstanceofFile ?`${thumbnailImage.name}-${key}` : key;
  const uploadThumbnail = new AWS.S3.ManagedUpload({
    params: {
      Bucket: awsConfig.bucketName.content,
      Key: `data/${thumbnailFileName}`,
      Body: thumbnailImage,
      ContentType: type,
      ACL: "public-read",
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
