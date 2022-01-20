import AWS from "aws-sdk";
import { createRandomKey } from "../util/cryptoHelper";
import { FileContent, FileType, UploadFilesRetVal } from "../common/types/File";
import { AWSConfig } from "./types";
import { PlainMetadata } from "../vwbl/metadata/type";
import { toBafferFromBase64 } from "../util/imageEditor";

export const uploadAll = async (plainData: FileContent, thumbnailImage: FileContent, encryptedContent: string, awsConfig?: AWSConfig): Promise<UploadFilesRetVal> => {
  if (! awsConfig || !awsConfig.bucketName.content) {
    throw new Error("bucket is not specified.")
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
  const type = thumbnailImage.content.split(';')[0].split('/')[1];
  const uploadThumbnail = new AWS.S3.ManagedUpload({
    params: {
      Bucket: awsConfig.bucketName.content,
      Key: `data/${key}-${thumbnailImage.name}`,
      Body: await toBafferFromBase64(thumbnailImage.content),
      ContentType: `image/${type}`,
    }
  });
  const thumbnailData = await uploadThumbnail.promise();
  const thumbnailImageUrl = `${awsConfig.cloudFrontUrl}/${thumbnailData.Key}`;
  return {encryptedDataUrl, thumbnailImageUrl}
};

export const uploadMetadata = async (tokenId: number, name: string, description: string, previewImageUrl: string, encryptedDataUrl: string, fileType: FileType, awsConfig?: AWSConfig): Promise<void> => {
  if (!awsConfig || !awsConfig.bucketName.metadata) {
    throw new Error("bucket is not specified.")
  }
  const metadata: PlainMetadata = {
    name,
    description,
    image: previewImageUrl,
    encrypted_data: encryptedDataUrl,
    file_type: fileType,
  };
  const upload = new AWS.S3.ManagedUpload({
    params: {
      Bucket: awsConfig.bucketName.metadata,
      Key: `metadata/${tokenId}`,
      Body: JSON.stringify(metadata),
      ContentType: "application/json"
    }
  });
  await upload.promise();
};
