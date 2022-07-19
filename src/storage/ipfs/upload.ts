import axios, { AxiosRequestConfig } from "axios";
import FormDataNodeJs from "form-data";

import { toArrayBuffer } from "../../util/imageEditor";
import { PlainMetadata } from "../../vwbl/metadata";
import { EncryptLogic } from "../../vwbl/types";
import { IPFSInfuraConfig } from "./types";

const isRunningOnBrowser = typeof window !== "undefined";

export class UploadToIPFS {
  private auth: string;
  constructor(infuraConfig: IPFSInfuraConfig) {
    this.auth = "Basic " + Buffer.from(infuraConfig.projectId + ":" + infuraConfig.projectSecret).toString("base64");
  }

  async uploadEncryptedFile(encryptedContent: string | ArrayBuffer, isPin: boolean): Promise<string> {
    const url = `https://ipfs.infura.io:5001/api/v0/add?pin=${isPin}`;

    const encryptedContentData = typeof encryptedContent === "string" ? encryptedContent : new Blob([encryptedContent]);
    let encryptedContentForm = isRunningOnBrowser ? new FormData() : new FormDataNodeJs();
    encryptedContentForm.append("file", encryptedContentData);

    const ipfsAddConfig: AxiosRequestConfig = {
      method: "post",
      url: url,
      headers: {
        "Authorization": this.auth,
        "Content-Type": "multipart/form-data",
      },
      data: encryptedContentForm,
    };
    let ipfsAddRes;
    try {
      ipfsAddRes = await axios(ipfsAddConfig);
    } catch (err: any) {
      throw new Error(err);
    }

    const encryptedDataUrl = "https://infura-ipfs.io/ipfs/" + ipfsAddRes.data.Hash;
    return encryptedDataUrl;
  }

  async uploadThumbnail(thumbnailImage: File, isPin: boolean): Promise<string> {
    const url = isPin
      ? "https://ipfs.infura.io:5001/api/v0/add?pin=true"
      : "https://ipfs.infura.io:5001/api/v0/add?pin=false";

    let thumbnailForm;
    if (isRunningOnBrowser) {
      thumbnailForm = new FormData();
      thumbnailForm.append("file", thumbnailImage);
    } else {
      thumbnailForm = new FormDataNodeJs();
      thumbnailForm.append("file", await toArrayBuffer(thumbnailImage));
    }

    const ipfsAddConfig: AxiosRequestConfig = {
      method: "post",
      url: url,
      headers: {
        "Authorization": this.auth,
        "Content-Type": "multipart/form-data",
      },
      data: thumbnailForm,
    };
    let ipfsAddRes;
    try {
      ipfsAddRes = await axios(ipfsAddConfig);
    } catch (err: any) {
      throw new Error(err);
    }

    const thumbnailImageUrl = "https://infura-ipfs.io/ipfs/" + ipfsAddRes.data.Hash;
    return thumbnailImageUrl;
  }

  async uploadMetadata(
    name: string,
    description: string,
    previewImageUrl: string,
    encryptedDataUrls: string[],
    mimeType: string,
    encryptLogic: EncryptLogic,
    isPin: boolean
  ): Promise<string> {
    const url = isPin
      ? "https://ipfs.infura.io:5001/api/v0/add?pin=true"
      : "https://ipfs.infura.io:5001/api/v0/add?pin=false";

    const metadata: PlainMetadata = {
      name,
      description,
      image: previewImageUrl,
      encrypted_data: encryptedDataUrls,
      mime_type: mimeType,
      encrypt_logic: encryptLogic,
    };

    let metadataForm = isRunningOnBrowser ? new FormData() : new FormDataNodeJs();
    metadataForm.append("file", JSON.stringify(metadata));

    const ipfsAddConfig: AxiosRequestConfig = {
      method: "post",
      url: url,
      headers: {
        "Authorization": this.auth,
        "Content-Type": "multipart/form-data",
      },
      data: metadataForm,
    };
    let ipfsAddRes;
    try {
      ipfsAddRes = await axios(ipfsAddConfig);
    } catch (err: any) {
      throw new Error(err);
    }

    const metadataUrl = "https://infura-ipfs.io/ipfs/" + ipfsAddRes.data.Hash;
    return metadataUrl;
  }
}
