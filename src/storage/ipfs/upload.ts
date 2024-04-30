import lighthouse from "@lighthouse-web3/sdk";

import axios from "axios";
import { getMimeType } from "../../util";
import { PlainMetadata } from "../../vwbl/metadata";
import { EncryptLogic, FileOrPath } from "../../vwbl/types";

// export class UploadToIPFS {
//   private client: NFTStorage;
//   constructor(ipfsNftStorageKey: string) {
//     this.client = new NFTStorage({ token: ipfsNftStorageKey });
//   }

//   async uploadEncryptedFile(
//     encryptedContent: string | ArrayBuffer
//   ): Promise<string> {
//     const encryptedContentData = new Blob([encryptedContent]);

//     let cid;
//     try {
//       cid = await this.client.storeBlob(encryptedContentData);
//     } catch (err: any) {
//       throw new Error(err);
//     }

//     return `https://nftstorage.link/ipfs/${cid}`;
//   }

//   async uploadThumbnail(thumbnailImage: FileOrPath): Promise<string> {
//     const thumbnailFileType = getMimeType(thumbnailImage);
//     const thumbnailblob = new Blob([thumbnailImage], {
//       type: thumbnailFileType,
//     });

//     let cid;
//     try {
//       cid = await this.client.storeBlob(thumbnailblob);
//     } catch (err: any) {
//       throw new Error(err);
//     }

//     return `https://nftstorage.link/ipfs/${cid}`;
//   }

//   async uploadMetadata(
//     name: string,
//     description: string,
//     previewImageUrl: string,
//     encryptedDataUrls: string[],
//     mimeType: string,
//     encryptLogic: EncryptLogic
//   ): Promise<string> {
//     const metadata: PlainMetadata = {
//       name,
//       description,
//       image: previewImageUrl,
//       encrypted_data: encryptedDataUrls,
//       mime_type: mimeType,
//       encrypt_logic: encryptLogic,
//     };

//     const metadataJSON = JSON.stringify(metadata);
//     const metaDataBlob = new Blob([metadataJSON]);

//     let cid;
//     try {
//       cid = await this.client.storeBlob(metaDataBlob);
//     } catch (err: any) {
//       throw new Error(err);
//     }

//     return `https://nftstorage.link/ipfs/${cid}`;
//   }
// }

export class UploadToIPFS {
  private apiKey: string;
  constructor(apiKey: string) {
    console.log("API Key Length:", apiKey.length);
    this.apiKey = apiKey;
  }

  async uploadEncryptedFile(
    encryptedContent: string | ArrayBuffer
  ): Promise<string> {
    const encryptedContentData = new Blob([encryptedContent], {
      type: "application/octet-stream",
    });
    try {
      // const output = await lighthouse.upload(
      //   encryptedContentData,
      //   this.apiKey,
      //   false,
      //   undefined
      // );

      // 橋本さんコード
      const endpoint = "https://node.lighthouse.storage/api/v0/add";
      const token = "Bearer " + this.apiKey;
      const output = await axios.post(endpoint, encryptedContent, {
        withCredentials: true,
        maxContentLength: Infinity, //this is needed to prevent axios from erroring out with large directories
        maxBodyLength: Infinity,
        headers: {
          Encryption: "false",
          "Mime-Type": "application/octet-stream",
          Authorization: token,
        },
      });
      return `https://gateway.lighthouse.storage/ipfs/${output.data.Hash}`;
    } catch (err: any) {
      console.log("Response:", encryptedContent);
      throw new Error(err);
    }
  }

  async uploadThumbnail(thumbnailImage: FileOrPath): Promise<string> {
    if (!(thumbnailImage instanceof File)) {
      console.log(
        "uploadThumbnail Error: thumbnailImage is not a File object."
      );
      return "Error: thumbnailImage is not a File object.";
    }
    const thumbnailFileType = getMimeType(thumbnailImage);
    const thumbnailBlob = new Blob([thumbnailImage], {
      type: thumbnailFileType,
    });

    try {
      const output = await lighthouse.upload(
        thumbnailBlob,
        this.apiKey,
        false,
        undefined
      );
      return `https://gateway.lighthouse.storage/ipfs/${output.data.Hash}`;
    } catch (err: any) {
      console.log("uploadThumbnail", err);
      console.log("Response:", thumbnailImage);
      throw new Error(err);
    }
  }

  async uploadMetadata(
    name: string,
    description: string,
    previewImageUrl: string,
    encryptedDataUrls: string[],
    mimeType: string,
    encryptLogic: EncryptLogic
  ): Promise<string> {
    const metadata: PlainMetadata = {
      name,
      description,
      image: previewImageUrl,
      encrypted_data: encryptedDataUrls,
      mime_type: mimeType,
      encrypt_logic: encryptLogic,
    };

    const metadataJSON = JSON.stringify(metadata);
    const metadataBlob = new Blob([metadataJSON], { type: "application/json" });

    try {
      const output = await lighthouse.upload(
        metadataBlob,
        this.apiKey,
        false,
        undefined
      );
      return `https://gateway.lighthouse.storage/ipfs/${output.data.Hash}`;
    } catch (err: any) {
      console.log("Response:", name);

      console.log("uploadMetadata", err);
      throw new Error(err);
    }
  }
}
