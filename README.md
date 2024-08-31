# VWBL SDK

## official document

https://docs.vwbl-protocol.org

### install

##### Using NPM

`npm install vwbl-sdk vwbl-core`

※ _for XRPL_

`npm install vwbl-sdk-xrpl vwbl-core`

##### Using Yarn

`yarn add vwbl-sdk vwbl-core`

※ _for XRPL_

`yarn add vwbl-sdk-xrpl vwbl-core`

### Build

`npm run build:all`

### Arcihtecture Overview

| Package                           | Version                                                                                              | License                                                              | Description                       |
| --------------------------------- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | --------------------------------- |
| [vwbl-sdk](./packages/evm/)       | [![npm version](https://badge.fury.io/js/vwbl-sdk.svg)](https://badge.fury.io/js/vwbl-sdk)           | ![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg) | VWBL SDK for EVM compatible chain |
| [vwbl-core](./packages/core/)     | [![npm version](https://badge.fury.io/js/vwbl-core.svg)](https://badge.fury.io/js/vwbl-core)         | ![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg) | VWBL core tools for sub-package   |
| [vwbl-sdk-xrpl](./packages/xrpl/) | [![npm version](https://badge.fury.io/js/vwbl-sdk-xrpl.svg)](https://badge.fury.io/js/vwbl-sdk-xrpl) | ![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg) | VWBL SDK for XRPL                 |

## api document

### create instance

```typescript
new VWBL({
  web3,
  contractAddress: "0x...",
  manageKeyType: ManageKeyType.VWBL_NETWORK_SERVER,
  uploadContentType: UploadContentType.S3,
  uploadMetadataType: UploadMetadataType.S3,
  vwblNetworkUrl: "https://vwbl.network",
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

※ _for XRPL_

```typescript
new VWBLXRPL({
  xrplChainId: 1, // Mainnet:0 / Testnet:1 / Devnet:2
  vwblNetworkUrl: "https://vwbl.network",
  manageKeyType: ManageKeyType.VWBL_NETWORK_SERVER,
  uploadContentType: UploadContentType.S3,
  uploadMetadataType: UploadMetadataType.S3,
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

| name               | required                                                 | type                                       | description                                                                                                                                           |
| ------------------ | -------------------------------------------------------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| web3               | true                                                     | [Web3](https://www.npmjs.com/package/web3) | web3 instance                                                                                                                                         |
| contractAddress    | true                                                     | string                                     | VWBL nft's contract address                                                                                                                           |
| vwblNetworkUrl     | true                                                     | string                                     | VWBL network's url                                                                                                                                    |
| manageKeyType      | false                                                    | ManageKeyType                              | how to manage key, you can choose from <br> VWBL_NETWORK_SERVER <br> VWBL_NETWORK_CONSORTIUM(not implemented yet)<br> MY_SERVER(not implemented yet). |
| uploadContentType  | flase                                                    | UploadContentType                          | where to upload content, you can choose from <br> S3 <br> IPFS <br> CUSTOM                                                                            |
| uploadMetadataType | flase                                                    | UploadMetadataType                         | where to upload content, you can choose from <br> S3 <br> IPFS <br> CUSTOM                                                                            |
| awsConfig          | true if you choose to upload content or metadata to S3   | AWSConfig                                  | AWSConfig \*1                                                                                                                                         |
| ipfsConfig         | true if you choose to upload content or metadata to IPFS | IPFSConfig                                 | IPFSConfig \*2                                                                                                                                        |

AWSConfig(\*1)

| name          | required | type                                | description                                               |
| ------------- | -------- | ----------------------------------- | --------------------------------------------------------- |
| region        | true     | string                              | AWS region                                                |
| idPoolId      | true     | string                              | idPoolId which has granted S3-put-object                  |
| cloudFrontUrl | true     | string                              | cloudFront url connect to s3 which is uploaded content    |
| bucketName    | true     | {content: string, metadata: string} | bucketName of metadata and content, it's ok they are same |

IPFSConfig(\*2)

| name      | required | type   | description    |
| --------- | -------- | ------ | -------------- |
| apiKey    | true     | string | API key        |
| apiSecret | false    | string | API secret key |

|

## EVM (vwbl-sdk)

### sign to server

Signing is necessary before creating token or viewing contents.

```typescript
await vwbl.sign();
```

### create token

```typescript
await vwbl.managedCreateToken(
  name,
  description,
  fileContent,
  thumbnailContent,
  0 // royaltiesPercentage
);
```

Arguments

| name                        | required                             | type                | description                                                                                                                                  |
| --------------------------- | ------------------------------------ | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| name                        | true                                 | string              | [ERC721](https://eips.ethereum.org/EIPS/eip-721) metadata name                                                                               |
| description                 | true                                 | string              | [ERC721](https://eips.ethereum.org/EIPS/eip-721) metadata description                                                                        |
| plainFile                   | true                                 | File \| File[]      | The data that only NFT owner can view                                                                                                        |
| thumbnailImage              | true                                 | File                | [ERC721](https://eips.ethereum.org/EIPS/eip-721) metadata image                                                                              |
| royaltiesPercentage         | true                                 | number              | If the marketplace supports EIP2981, this percentage of the sale price will be paid to the NFT creator every time the NFT is sold or re-sold |
| encryptLogic                | false (default="base64")             | EncryptLogic        | "base64" or "binary". Selection criteria: "base64" -> sutable for small data. "binary" -> sutable for large data.                            |
| uploadEncryptedFileCallback | true if uploadContentType is CUSTOM  | UploadEncryptedFile | you can custom upload function                                                                                                               |
| uploadThumbnailCallback     | true if uploadContentType is CUSTOM  | UploadThumbnail     | you can custom upload function                                                                                                               |
| uploadMetadataCallback      | true if uploadMetadataType is CUSTOM | UploadMetadata      | you can custom upload function                                                                                                               |
| gasSettings                 | false                                | GasSettings         | you can custom gas settings                                                                                                                  |

### view contents ( get NFT metadata from given tokenId)

```typescript
const token = await vwbl.getTokenById(tokenId);
```

## XRPL (vwbl-sdk-xrpl)

### 1. generate mint tx

```typescript
const { mintTxJson } = await vwblXrpl.generateMintTokenTx(
  // user's wallet address
  walletAddress: string,
  // 0~5000 (0.00% ~ 50.00%), see detail: https://xrpl.org/docs/references/protocol/transactions/types/nftokenmint
  transferRoyalty: number,
  // transferable NFT or not
  isTransferable: boolean,
  // burnable NFT or not
  isBurnable: boolean
)
```

※ Then, you need to ask users to sign the transaction and get signed transaction hex

### 2. mint VWBL NFT and generate next tx object

```typescript
const { tokenId, emptyTxObject, paymentTxJson } =
  await vwblXrpl.mintAndGenerateTx(
    signedMintTx, // signed mint tx hex (signed by user)
    walletAddress // user's wallet address
  );
```

※ if VWBL NFT minting fee = 0, `paymentTxJson` is `undefined` and you can ignore
※ if VWBL NFT minting fee > 0, `emptyTxObject` is `undefined` and you can ignore

### (3. pay VWBL NFT minting fee) ※ NEED TO DO THIS if `paymentTxJson` was generated

```typescript
const { paymentTxHash, tokenId, emptyTxObject } = await vwblXrpl.payMintFee(
  walletAddress, // user's wallet address
  signedPaymentTx // signed `paymentTxJson` tx hex
);
```

### 4. create token & register key

```typescript
const { tokenId } = await vwblXrpl.createManagedToken(
  // NFTokenID
  tokenId,
  // signed `emptyTxObject` hex
  signedEmptyTx,
  // user's public key
  signerPublicKey,
  // NFT name
  name,
  // NFT description
  description,
  // NFT file
  plainFile,
  // NFT thumbnail image
  thumbnailImage,
  // encryption logic (default: base64)
  encryptLogic,
  // `paymentTxHash` if minting fee is necessary
  signedPaymentTxHash?,
  // custom upload file function
  uploadEncryptedFileCallback?,
  // custom upload thumbnail function
  uploadThumbnailCallback?,
  // custom upload metadata function
  uploadMetadataCallBack?
);
```

### view NFT contents

```typescript
const { emptyTxObject } = await vwblXrpl.generateTxForSigning(walletAddress);

// ... get user's signature for `emptyTxObject`

const {
  id,
  name,
  description,
  image,
  mimeType,
  encryptLogic,
  ownDataBase64,
  ownFiles,
  fileName,
} = await vwblXrpl.extractMetadata(tokenId, signedEmptyTx, signerPublicKey);
```
