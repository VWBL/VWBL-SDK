import * as fs from "fs";

import { uploadEncryptedFile, uploadMetadata, uploadThumbnail } from "../../storage/aws/upload";
import { createRandomKey, encryptFile, encryptStream, encryptString } from "../../util/cryptoHelper";
import { getMimeType, toBase64FromBlob } from "../../util/fileHelper";
import { ConstructorProps, VWBLBase } from "../base";
import { VWBLERC1155NFT } from "../blockchain";
import {
  EncryptLogic,
  UploadContentType,
  UploadEncryptedFile,
  UploadMetadata,
  UploadMetadataType,
  UploadThumbnail,
} from "../types";

export class VWBLERC1155 extends VWBLBase<VWBLERC1155NFT> {
  constructor(props: ConstructorProps) {
    super(props);

    const { web3, contractAddress, uploadMetadataType } = props;
    this.nft = new VWBLERC1155NFT(web3, contractAddress, uploadMetadataType === UploadMetadataType.IPFS);
  }

  /**
   * Create VWBLERC1155 NFT
   *
   * @remarks
   * The following happens: Minting NFT, Uploading encrypted data, Uploading metadata, Setting key to VWBL Network
   * By default, metadata will be uploaded to Amazon S3.
   * You need to pass `uploadFileCallback` and `uploadMetadataCallBack` if you upload metadata to a storage other than Amazon S3.
   *
   * @param name - The NFT name
   * @param description - The NFT description
   * * @param amount - The amount of erc1155 tokens to be minted
   * @param plainFile - The data that only NFT owner can view
   * @param thumbnailImage - The NFT image
   * @param royaltiesPercentage - This percentage of the sale price will be paid to the NFT creator every time the NFT is sold or re-sold
   * @param encryptLogic - Select ether "base64" or "binary". Selection criteria: "base64" -> sutable for small data. "binary" -> sutable for large data.
   * @param uploadEncryptedFileCallback - Optional: the function for uploading encrypted data
   * @param uploadThumbnailCallback - Optional: the function for uploading thumbnail
   * @param uploadMetadataCallBack - Optional: the function for uploading metadata
   * @returns
   */
  managedCreateToken = async (
    name: string,
    description: string,
    amount: number,
    plainFile: File | File[],
    thumbnailImage: File,
    royaltiesPercentage: number,
    encryptLogic: EncryptLogic = "base64",
    uploadEncryptedFileCallback?: UploadEncryptedFile,
    uploadThumbnailCallback?: UploadThumbnail,
    uploadMetadataCallBack?: UploadMetadata
  ) => {
    if (!this.signature) {
      throw "please sign first";
    }
    const { uploadContentType, uploadMetadataType, awsConfig, vwblNetworkUrl } = this.opts;
    // 1. mint token
    const documentId = this.opts.web3.utils.randomHex(32);
    const tokenId = await this.nft.mintToken(vwblNetworkUrl, amount, royaltiesPercentage, documentId);
    // 2. create key in frontend
    const key = createRandomKey();
    // 3. encrypt data
    console.log("encrypt data");
    const plainFileArray = [plainFile].flat();
    const uuid = createRandomKey();
    const uploadEncryptedFunction =
      uploadContentType === UploadContentType.S3 ? uploadEncryptedFile : uploadEncryptedFileCallback;
    const uploadThumbnailFunction =
      uploadContentType === UploadContentType.S3 ? uploadThumbnail : uploadThumbnailCallback;
    if (!uploadEncryptedFunction || !uploadThumbnailFunction) {
      throw new Error("please specify upload file type or give callback");
    }
    // 4. upload data
    console.log("upload data");
    const isRunningOnBrowser = typeof window !== "undefined";
    const encryptedDataUrls = await Promise.all(
      plainFileArray.map(async (file) => {
        const encryptedContent =
          encryptLogic === "base64"
            ? encryptString(await toBase64FromBlob(file), key)
            : isRunningOnBrowser
            ? await encryptFile(file, key)
            : encryptStream(fs.createReadStream((file as any).path), key);
        return await uploadEncryptedFunction(file.name, encryptedContent, uuid, awsConfig);
      })
    );
    const thumbnailImageUrl = await uploadThumbnailFunction(thumbnailImage, uuid, awsConfig);
    // 5. upload metadata
    console.log("upload meta data");
    const uploadMetadataFunction =
      uploadMetadataType === UploadMetadataType.S3 ? uploadMetadata : uploadMetadataCallBack;
    if (!uploadMetadataFunction) {
      throw new Error("please specify upload metadata type or give callback");
    }
    const mimeType = getMimeType(plainFileArray[0]);
    await uploadMetadataFunction(
      tokenId,
      name,
      description,
      thumbnailImageUrl,
      encryptedDataUrls,
      mimeType,
      encryptLogic,
      awsConfig
    );
    // 6. set key to vwbl-network
    console.log("set key");
    const chainId = await this.opts.web3.eth.getChainId();
    await this.api.setKey(documentId, chainId, key, this.signature);
    return tokenId;
  };

  /**
   * Create VWBLERC1155 NFT which metadata on IPFS.
   *
   * @remarks
   * The following happens: Minting NFT, Uploading encrypted data, Uploading metadata, Setting key to VWBL Network
   * metadata will be uploaded to IPFS.
   * You need to pass `uploadFileCallback` and `uploadMetadataCallBack` if you upload metadata to a storage other than Amazon S3.
   *
   * @param name - The NFT name
   * @param description - The NFT description
   * @param amount - The amount of erc1155 tokens to be minted
   * @param plainFile - The data that only NFT owner can view
   * @param thumbnailImage - The NFT image
   * @param royaltiesPercentage - This percentage of the sale price will be paid to the NFT creator every time the NFT is sold or re-sold
   * @param encryptLogic - Select ether "base64" or "binary". Selection criteria: "base64" -> sutable for small data. "binary" -> sutable for large data.
   * @returns
   */
  managedCreateTokenForIPFS = async (
    name: string,
    description: string,
    amount: number,
    plainFile: File | File[],
    thumbnailImage: File,
    royaltiesPercentage: number,
    encryptLogic: EncryptLogic = "base64"
  ) => {
    if (!this.signature) {
      throw "please sign first";
    }
    const { vwblNetworkUrl } = this.opts;
    // 1. create key in frontend
    const key = createRandomKey();
    // 2. encrypt data
    console.log("encrypt data");
    const plainFileArray = [plainFile].flat();
    // 3. upload data
    console.log("upload data");
    const encryptedDataUrls = await Promise.all(
      plainFileArray.map(async (file) => {
        const encryptedContent =
          encryptLogic === "base64" ? encryptString(await toBase64FromBlob(file), key) : await encryptFile(file, key);
        console.log(typeof encryptedContent);
        return await this.uploadToIpfs?.uploadEncryptedFile(encryptedContent);
      })
    );
    const thumbnailImageUrl = await this.uploadToIpfs?.uploadThumbnail(thumbnailImage);
    // 4. upload metadata
    console.log("upload meta data");
    const mimeType = getMimeType(plainFileArray[0]);
    const metadataUrl = await this.uploadToIpfs?.uploadMetadata(
      name,
      description,
      thumbnailImageUrl as string,
      encryptedDataUrls as string[],
      mimeType,
      encryptLogic
    );
    // 5. mint token
    const documentId = this.opts.web3.utils.randomHex(32);
    const tokenId = await this.nft.mintTokenForIPFS(
      metadataUrl as string,
      vwblNetworkUrl,
      amount,
      royaltiesPercentage,
      documentId
    );
    // 6. set key to vwbl-network
    console.log("set key");
    const chainId = await this.opts.web3.eth.getChainId();
    await this.api.setKey(documentId, chainId, key, this.signature);
    return tokenId;
  };

  /**
   * Mint new ERC1155 NFT
   *
   * @param amount - The amount of erc1155 tokens to be minted
   * @param royaltiesPercentage - This percentage of the sale price will be paid to the NFT creator every time the NFT is sold or re-sold
   * @returns The ID of minted NFT
   */
  mintToken = async (amount: number, royaltiesPercentage: number): Promise<number> => {
    const { vwblNetworkUrl } = this.opts;
    const documentId = this.opts.web3.utils.randomHex(32);
    return await this.nft.mintToken(vwblNetworkUrl, amount, royaltiesPercentage, documentId);
  };

  /**
   * Transfer NFT
   *
   * @param to - The address that NFT will be transferred
   * @param tokenId - The ID of NFT
   * @param amount - The amount of erc1155 tokens to be transferred
   */
  safeTransfer = async (to: string, tokenId: number, amount: number): Promise<void> => {
    await this.nft.safeTransfer(to, tokenId, amount);
  };

  /**
   * Burn NFT
   *
   * @param owner - The address of nft owner
   * @param tokenId - The ID of NFT
   * @param amount - The amount of erc1155 tokens to be burnt
   */
  burn = async (owner: string, tokenId: number, amount: number): Promise<void> => {
    await this.nft.burn(owner, tokenId, amount);
  };
}
