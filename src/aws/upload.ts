import AWS from "aws-sdk";
import { createRandomKey } from "../util/cryptoHelper";
import { FileContent, UploadFilesRetVal } from "../common/types/File";
import { AWSConfig } from "./types";

export const uploadAll = async (plainData: FileContent, thumbnailImage: FileContent, encryptedContent: string, awsConfig: AWSConfig ) : Promise<UploadFilesRetVal> =>  {
  if(!awsConfig.bucketName.image){
    throw new Error("bucket is not specified.")
  }
  const key = createRandomKey();
  const uploadEncrypted = new AWS.S3.ManagedUpload({
    params: {
      Bucket: awsConfig.bucketName.image,
      Key: `data/${key}-${plainData.name}.vwbl`,
      Body: encryptedContent,
      ContentType: "text/plain",
    },
  });
  const encryptedData = await uploadEncrypted.promise();
  const encryptedDataUrl = `${awsConfig.cloudFrontUrl}/${encryptedData.Key}`;
  const uploadThumbnail = new AWS.S3.ManagedUpload({
    params: {
      Bucket: awsConfig.bucketName.image,
      Key: `data/${key}-${plainData.name}`,
      Body: encryptedContent,
      ContentType: "image",
    }
  })
  const thumbnailData = await uploadThumbnail.promise();
  const thumbnailImageUrl = `${awsConfig.cloudFrontUrl}/${thumbnailData.Key}`;
  return {encryptedDataUrl, thumbnailImageUrl}
}
