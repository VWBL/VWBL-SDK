import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { fromCognitoIdentityPool, fromIni } from "@aws-sdk/credential-providers";
import { Upload } from "@aws-sdk/lib-storage";
import * as fs from "fs";
import * as Stream from "stream";

import { getMimeType } from "../../util";
import { PlainMetadata } from "../../vwbl/metadata";
import { EncryptLogic, FileOrPath } from "../../vwbl/types";
import { AWSConfig } from "./types";

export const uploadEncryptedFile = async (
  fileName: string,
  encryptedContent: string | Uint8Array | Stream.Readable,
  uuid: string,
  awsConfig?: AWSConfig
): Promise<string> => {
  if (!awsConfig || !awsConfig.bucketName.content) {
    throw new Error("bucket is not specified.");
  }
  if (!awsConfig.idPoolId && !awsConfig.profile) {
    throw new Error("aws credential environment variable is not specified.");
  }

  const credentials = awsConfig.idPoolId
    ? fromCognitoIdentityPool({
        clientConfig: { region: awsConfig.region },
        identityPoolId: awsConfig.idPoolId,
      })
    : fromIni({ profile: awsConfig.profile });
  const s3Client = new S3Client({ credentials });

  const key = `data/${uuid}-${fileName}.vwbl`;
  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: awsConfig.bucketName.content,
      Key: key,
      Body: encryptedContent,
      ACL: "public-read",
    },
  });

  await upload.done();
  return `${awsConfig.cloudFrontUrl.replace(/\/$/, "")}/${key}`;
};

export const uploadThumbnail = async (
  thumbnailImage: FileOrPath,
  uuid: string,
  awsConfig?: AWSConfig
): Promise<string> => {
  if (!awsConfig || !awsConfig.bucketName.content) {
    throw new Error("bucket is not specified.");
  }
  if (!awsConfig.idPoolId && !awsConfig.profile) {
    throw new Error("aws credential environment variable is not specified.");
  }

  const credentials = awsConfig.idPoolId
    ? fromCognitoIdentityPool({
        clientConfig: { region: awsConfig.region },
        identityPoolId: awsConfig.idPoolId,
      })
    : fromIni({ profile: awsConfig.profile });
  const s3Client = new S3Client({ credentials });
  const fileName = thumbnailImage instanceof File ? thumbnailImage.name : thumbnailImage.split("/").slice(-1)[0]; //ファイル名の取得だけのためにpathを使いたくなかった

  const key = `data/${uuid}-${fileName}`;
  const type = getMimeType(thumbnailImage);
  const uploadCommand = new PutObjectCommand({
    Bucket: awsConfig.bucketName.content,
    Key: key,
    Body: thumbnailImage instanceof File ? thumbnailImage : await fs.promises.readFile(thumbnailImage),
    ContentType: type,
    ACL: "public-read",
  });

  await s3Client.send(uploadCommand);
  return `${awsConfig.cloudFrontUrl.replace(/\/$/, "")}/${key}`;
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
): Promise<string> => {
  if (!awsConfig || !awsConfig.bucketName.content) {
    throw new Error("bucket is not specified.");
  }
  if (!awsConfig.idPoolId && !awsConfig.profile) {
    throw new Error("aws credential environment variable is not specified.");
  }

  const credentials = awsConfig.idPoolId
    ? fromCognitoIdentityPool({
        clientConfig: { region: awsConfig.region },
        identityPoolId: awsConfig.idPoolId,
      })
    : fromIni({ profile: awsConfig.profile });
  const s3Client = new S3Client({ credentials });

  const metadata: PlainMetadata = {
    name,
    description,
    image: previewImageUrl,
    encrypted_data: encryptedDataUrls,
    mime_type: mimeType,
    encrypt_logic: encryptLogic,
  };
  const key = `metadata/${tokenId}`;
  const uploadCommand = new PutObjectCommand({
    Bucket: awsConfig.bucketName.metadata,
    Key: key,
    Body: JSON.stringify(metadata),
    ContentType: "application/json",
    ACL: "public-read",
  });
  await s3Client.send(uploadCommand);

  return `${awsConfig.cloudFrontUrl.replace(/\/$/, "")}/${key}`;
};

export const uploadDirectoryToS3 = (directoryPath: string, awsConfig?: AWSConfig) => {
  if (!awsConfig || !awsConfig.bucketName.content) {
    throw new Error("bucket is not specified.");
  }
  if (!awsConfig.idPoolId && !awsConfig.profile) {
    throw new Error("aws credential environment variable is not specified.");
  }

  const credentials = awsConfig.idPoolId
    ? fromCognitoIdentityPool({
        clientConfig: { region: awsConfig.region },
        identityPoolId: awsConfig.idPoolId,
      })
    : fromIni({ profile: awsConfig.profile });
  const s3Client = new S3Client({ credentials });

  fs.readdir(directoryPath, (err, files) => {
    if (err) throw err;
    files.forEach((file) => {
      const filePath = `${directoryPath}/${file}`;
      fs.readFile(filePath, async (err, data) => {
        if (err) throw err;

        const upload = new Upload({
          client: s3Client,
          params: {
            Bucket: awsConfig.bucketName.content,
            Key: `${directoryPath}/${file}`,
            Body: data,
            ACL: "public-read",
          },
        });
        await upload.done();
      });
    });
  });
};
