export type AWSConfig= {
  region: string;
  idPoolId: string;
  bucketName: {
    image?: string;
    metadata?: string;
  },
  cloudFrontUrl: string
}
