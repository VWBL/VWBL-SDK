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

const providerUrl = "https://rpc-mumbai.maticvigil.com/";

const web3 = new Web3(providerUrl as string);

describe("VWBL", () => {
  const vwbl = new VWBL({
    ipfsNftStorageKey: process.env.NFT_STORAGE_KEY,
    awsConfig: undefined,
    contractAddress: "0x5af2D607242f604C8f5e04e8B648741EE59ac847",
    manageKeyType: ManageKeyType.VWBL_NETWORK_SERVER,
    uploadContentType: UploadContentType.IPFS,
    uploadMetadataType: UploadMetadataType.IPFS,
    vwblNetworkUrl: "https://dev.vwbl.network/",
    web3,
  });

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
  const testSubscriber = {
    kickStep: () => {},
  };

  it("mint token without gas settings", async () => {
    await vwbl.sign();

    const tokenId = await vwbl.managedCreateTokenForIPFS(
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
      testSubscriber
    );
    expect(typeof tokenId).equal("number");
  });

  //   it("mint token with gas settings", async () => {
  //     const testSubscriber = {
  //       kickStep: () => {}
  //     }
  //     const tokenId = await vwbl.managedCreateToken(
  //       "test token",
  //       "test",
  //       new File({
  //         name: "thumbnail image",
  //         type: "image/png",
  //         buffer: Buffer.alloc(100),
  //       }),
  //       new File({
  //         name: "plain data",
  //         type: "image/png",
  //         buffer: Buffer.alloc(100),
  //       }),
  //       10,
  //       "base64",
  //       testFunctions.uploadEncryptedFile,
  //       testFunctions.uploadThumbnail,
  //       testFunctions.uploadMetadata,
  //       testSubscriber,
  //       40000000000,
  //       41000000000,
  //     );

  //     expect(vwblProtocolStub.mintToken.callCount).equal(2);
  //     expect(vwblProtocolStub.mintToken.getCall(1).args[3]).equal(40000000000);
  //     expect(vwblProtocolStub.mintToken.getCall(1).args[4]).equal(41000000000);
  //     expect(vwblApiStub.setKey.callCount).equal(2);
  //     expect(uploadEncryptedFileStub.callCount).equal(2);
  //     expect(uploadFileStub.callCount).equal(2);
  //     expect(uploadMetadataStub.callCount).equal(2);
  //     expect(tokenId).equal(2);
  //   });
});
