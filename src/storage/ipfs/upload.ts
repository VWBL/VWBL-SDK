import { Blob, File, NFTStorage } from "nft.storage";

import { getMimeType } from "../../util/fileHelper";
import { PlainMetadata } from "../../vwbl/metadata";
import { EncryptLogic } from "../../vwbl/types";

export class UploadToIPFS {
  private client: NFTStorage;
  constructor(ipfsNftStorageKey: string) {
    this.client = new NFTStorage({ token: ipfsNftStorageKey });
  }

  async uploadEncryptedFile(encryptedContent: string | ArrayBuffer): Promise<string> {
    const encryptedContentData = new Blob([encryptedContent]);

    let cid;
    try {
      cid = await this.client.storeBlob(encryptedContentData);
    } catch (err: any) {
      throw new Error(err);
    }

    return `https://nftstorage.link/ipfs/${cid}`;
  }

  async uploadThumbnail(thumbnailImage: File): Promise<string> {
    const thumbnailFileType = getMimeType(thumbnailImage);
    const thumbnailblob = new Blob([thumbnailImage], { type: thumbnailFileType });

    let cid;
    try {
      cid = await this.client.storeBlob(thumbnailblob);
    } catch (err: any) {
      throw new Error(err);
    }

    return `https://nftstorage.link/ipfs/${cid}`;
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
    const metaDataBlob = new Blob([metadataJSON]);

    let cid;
    try {
      cid = await this.client.storeBlob(metaDataBlob);
    } catch (err: any) {
      throw new Error(err);
    }

    return `https://nftstorage.link/ipfs/${cid}`;
  }
}
