export type AWSConfig = {
    region: string;
    idPoolId?: string;
    profile?: string;
    bucketName: {
        content?: string;
        metadata?: string;
    };
    cloudFrontUrl: string;
};
