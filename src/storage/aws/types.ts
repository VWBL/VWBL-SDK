export type AWSConfig = {
  region: string;
  idPoolId: string;
  bucketName: {
    content?: string;
    metadata?: string;
  };
  cloudFrontUrl: string;
};
