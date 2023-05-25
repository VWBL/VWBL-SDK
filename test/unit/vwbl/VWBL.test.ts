import { expect } from "chai";
import * as dotenv from "dotenv";
import sinon from "sinon";
import Web3 from "web3";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const FileAPI = require("file-api"),
File = FileAPI.File;

import {
  ManageKeyType,
  UploadContentType,
  UploadMetadataType,
  VWBL,
  VWBLApi,
  VWBLERC1155,
  VWBLERC1155Contract,
  VWBLNFT,
} from "../../../src/vwbl";

dotenv.config();

const vwblApiStub = {
  setKey: sinon.stub(VWBLApi.prototype, "setKey"),
};

const providerUrl = process.env.PROVIDER_URL;
const web3 = new Web3(providerUrl as string);

sinon.stub(web3.eth, "getAccounts").returns(Promise.resolve(["test address"]));
sinon.stub(web3.eth.personal, "sign").returns(Promise.resolve("test sign"));

describe("VWBL", () => {
  const vwblProtocolStub = {
    mintToken: sinon.stub(VWBLNFT.prototype, "mintToken"),
  };

  const vwbl = new VWBL({
    ipfsNftStorageKey: "set nftstorage api key",
    awsConfig: undefined,
    contractAddress: "0x2c7e967093d7fe0eeb5440bf49e5D148417B0412",
    manageKeyType: ManageKeyType.VWBL_NETWORK_SERVER,
    uploadContentType: UploadContentType.CUSTOM,
    uploadMetadataType: UploadMetadataType.CUSTOM,
    vwblNetworkUrl: "http://example.com",
    web3,
  });

  before(async () => {
    await vwbl.sign();
  });

  it("mint token", async () => {
    vwblProtocolStub.mintToken.returns(Promise.resolve(1));
    const testFunctions = {
      uploadEncryptedFile: () => {
        return Promise.resolve("https://example.com");
      },
      uploadThumbnail: () => {
        return Promise.resolve("https://example.com");
      },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      uploadMetadata: async () => {},
    };
    const uploadEncryptedFileStub = sinon
      .stub(testFunctions, "uploadEncryptedFile")
      .returns(Promise.resolve("https://example.com"));
    const uploadFileStub = sinon.stub(testFunctions, "uploadThumbnail").returns(Promise.resolve("https://example.com"));
    const uploadMetadataStub = sinon.stub(testFunctions, "uploadMetadata");
    const tokenId = await vwbl.managedCreateToken(
      "test token",
      "test",
      new File({
        name: "thumbnail image",
        type: "image/png",
        buffer: Buffer.alloc(100),
      }),
      new File({
        name: "plain data",
        type: "image/png",
        buffer: Buffer.alloc(100),
      }),
      10,
      "base64",
      testFunctions.uploadEncryptedFile,
      testFunctions.uploadThumbnail,
      testFunctions.uploadMetadata
    );

    expect(vwblProtocolStub.mintToken.callCount).equal(1);
    expect(vwblApiStub.setKey.callCount).equal(1);
    expect(uploadEncryptedFileStub.callCount).equal(1);
    expect(uploadFileStub.callCount).equal(1);
    expect(uploadMetadataStub.callCount).equal(1);
    expect(tokenId).equal(1);
  });
});

describe("VWBLERC1155", () => {
  const vwblProtocolStub = {
    mintToken: sinon.stub(VWBLERC1155Contract.prototype, "mintToken"),
  };

  const vwbl = new VWBLERC1155({
    ipfsNftStorageKey: "set nftstorage api key",
    awsConfig: undefined,
    contractAddress: "0x2c7e967093d7fe0eeb5440bf49e5D148417B0412",
    manageKeyType: ManageKeyType.VWBL_NETWORK_SERVER,
    uploadContentType: UploadContentType.CUSTOM,
    uploadMetadataType: UploadMetadataType.CUSTOM,
    vwblNetworkUrl: "http://example.com",
    web3,
  });

  before(async () => {
    await vwbl.sign();
  });

  it("mint erc1155 token", async () => {
    vwblProtocolStub.mintToken.returns(Promise.resolve(1));
    const testFunctions = {
      uploadEncryptedFile: () => {
        return Promise.resolve("https://example.com");
      },
      uploadThumbnail: () => {
        return Promise.resolve("https://example.com");
      },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      uploadMetadata: async () => {},
    };
    const uploadEncryptedFileStub = sinon
      .stub(testFunctions, "uploadEncryptedFile")
      .returns(Promise.resolve("https://example.com"));
    const uploadFileStub = sinon.stub(testFunctions, "uploadThumbnail").returns(Promise.resolve("https://example.com"));
    const uploadMetadataStub = sinon.stub(testFunctions, "uploadMetadata");
    const tokenId = await vwbl.managedCreateToken(
      "test token",
      "test",
      100,
      new File({
        name: "thumbnail image",
        type: "image/png",
        buffer: Buffer.alloc(100),
      }),
      new File({
        name: "plain data",
        type: "image/png",
        buffer: Buffer.alloc(100),
      }),
      10,
      "base64",
      testFunctions.uploadEncryptedFile,
      testFunctions.uploadThumbnail,
      testFunctions.uploadMetadata
    );

    expect(vwblProtocolStub.mintToken.callCount).equal(1);
    expect(vwblApiStub.setKey.callCount).equal(2);
    expect(uploadEncryptedFileStub.callCount).equal(1);
    expect(uploadFileStub.callCount).equal(1);
    expect(uploadMetadataStub.callCount).equal(1);
    expect(tokenId).equal(1);
  });
});
