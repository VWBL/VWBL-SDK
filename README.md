# VWBL SDK

## build

`yarn build`

## install

`yarn add ../VWBL-SDK`
<!-- 
npmリポジトリに公開したら以下に変更
`yarn add vwbl-sdk`
 -->

## api document
### create instance
```typescript
new VWBL({
  web3,
  contractAddress: "0x...",
  manageKeyType: ManageKeyType.VWBL_NETWORK_SERVER,
  uploadImageType: UploadImageType.S3,
  uploadMetadataType: UploadMetadataType.S3,
  vwblNetworkUrl: "https://example.com",
  awsConfig: {
    region: "ap-northeast-1",
    idPoolId: "ap-northeast-1:...",
    cloudFrontUrl: "https://xxx.cloudfront.net",
    bucketName: {
      metadata: "vwbl-metadata",
      content: "vwbl-content",
    },
  },
});
```

Constructor Options

| name | required |  type | description |
| --- | --- | --- | --- |
| web3 | true | [Web3](https://www.npmjs.com/package/web3) | web3 instance |
| contractAddress | true | string |VWBL nft's contract address|
| manageKeyType | true | ManageKeyType | how to manage key, you can choose from <br> VWBL_NETWORK_SERVER <br> VWBL_NETWORK_CONSORTIUM(not implemented yet)<br> MY_SERVER(not implemented yet). |
| uploadContentType | true | UploadContentType | where to upload content, you can choose from <br> S3 <br> IPFS(not implemented yet) <br> CUSTOM|
| vwblNetworkUrl | true | string | VWBL network's url |
| awsConfig | true if you choose upload content or metadata to S3 | AWSConfig | AWSConfig *1 |

AWSConfig

| name | required | type | description |
| --- | --- | --- | --- |
| region | true | string | AWS region |
| idPoolId | true | string | idPoolId which has granted S3-put-object |
| cloudFrontUrl | true | string | cloudFront url connect to s3 which is uploaded content |
| bucketName | true | {content: string, metadata: string} | bucketName of metadata and content, it's ok they are same |

### sign to server
sign is necessary before create token or view contents.
```typescript
if (!vwbl.hasSign()) {
  await vwbl.sign();
}
```

### create token
```typescript
await vwbl.createToken(
  name,
  description,
  fileContent,
  FileType.IMAGE,
  thumbnailContent
);
```

Arguments

| name | required | type | description |
| --- | --- | --- | --- |
| name | true | string | [ERC721](https://eips.ethereum.org/EIPS/eip-721) metadata name |
| description | true | string | [ERC721](https://eips.ethereum.org/EIPS/eip-721) metadata description |
| fileContent | true | [FileContent](https://www.npmjs.com/package/use-file-picker#filecontent) | upload file |
| fileType | true | FileType | IMAGE or OTHER (MOVIE, MUSIC etc. are support later)|
| thumbnailContent | true | [FileContent](https://www.npmjs.com/package/use-file-picker#filecontent) | [ERC721](https://eips.ethereum.org/EIPS/eip-721) metadata image |
| uploadFileCallback | true if uploadContentType is CUSTOM | UploadFile | you can custom upload function |
| uploadMetadataCallback| true if uploadMetadataType is CUSTOM | UploadMetadata | you can custom upload function |

### view contents
list
```typescript
const tokens = await vwbl.getOwnTokens();
```
Detail
```typescript
const token = await vwbl.getTokenById(id)
```
