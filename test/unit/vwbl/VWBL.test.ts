import { expect } from "chai";
import * as dotenv from "dotenv";
import sinon from "sinon";
import { Web3 } from "web3";
import { ethers } from "ethers";
import {
  ManageKeyType,
  UploadContentType,
  UploadMetadataType,
  VWBL,
  VWBLApi,
  VWBLERC1155,
  VWBLERC1155Contract,
  VWBLERC1155EthersContract,
  VWBLNFT,
  VWBLNFTEthers,
} from "../../../src/vwbl";
import FileAPI from "file-api";
const File = FileAPI.File;
dotenv.config();

const vwblApiStub = {
  setKey: sinon.stub(VWBLApi.prototype, "setKey"),
};

const providerUrl = "https://rpc-mumbai.maticvigil.com/";

// preparation for web3.js
const web3 = new Web3(providerUrl as string);
sinon.stub(web3.eth, "getAccounts").returns(Promise.resolve(["test address"]));
sinon.stub(web3.eth.personal, "sign").returns(Promise.resolve("test sign"));

// preparation for ethers.js
const privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'; //Hardhat Network Account(https://hardhat.org/hardhat-network/docs/overview). No problem to disclose.
const ethProvider = new ethers.providers.JsonRpcProvider(providerUrl);
const ethSigner = new ethers.Wallet(privateKey, ethProvider);
sinon.stub(ethSigner, "signMessage").returns(Promise.resolve("test sign"));

describe("VWBL with web3.js", () => {
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

  before(async () => {
    await vwbl.sign();
  });

  it("mint token without gas settings", async () => {
    vwblProtocolStub.mintToken.returns(Promise.resolve(1));
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
    expect(vwblProtocolStub.mintToken.getCall(0).args[3]).equal(undefined);
    expect(vwblApiStub.setKey.callCount).equal(1);
    expect(uploadEncryptedFileStub.callCount).equal(1);
    expect(uploadFileStub.callCount).equal(1);
    expect(uploadMetadataStub.callCount).equal(1);
    expect(tokenId).equal(1);
  });

  it("mint token with maxPriorityFee and maxFee", async () => {
    vwblProtocolStub.mintToken.returns(Promise.resolve(2));
    const testSubscriber = {
      kickStep: () => {}
    }
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
      testFunctions.uploadMetadata,
      testSubscriber,
      {maxPriorityFeePerGas: 40000000000, maxFeePerGas: 41000000000}
    );

    expect(vwblProtocolStub.mintToken.callCount).equal(2);
    expect(vwblProtocolStub.mintToken.getCall(1).args[3]).deep.equal({maxPriorityFeePerGas: 40000000000, maxFeePerGas: 41000000000});
    expect(vwblApiStub.setKey.callCount).equal(2);
    expect(uploadEncryptedFileStub.callCount).equal(2);
    expect(uploadFileStub.callCount).equal(2);
    expect(uploadMetadataStub.callCount).equal(2);
    expect(tokenId).equal(2);
  });

  it("mint token with gasPrice", async () => {
    vwblProtocolStub.mintToken.returns(Promise.resolve(3));
    const testSubscriber = {
      kickStep: () => {}
    }
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
      testFunctions.uploadMetadata,
      testSubscriber,
      {gasPrice: 1000}
    );

    expect(vwblProtocolStub.mintToken.callCount).equal(3);
    expect(vwblProtocolStub.mintToken.getCall(2).args[3]).deep.equal({gasPrice: 1000});
    expect(vwblApiStub.setKey.callCount).equal(3);
    expect(uploadEncryptedFileStub.callCount).equal(3);
    expect(uploadFileStub.callCount).equal(3);
    expect(uploadMetadataStub.callCount).equal(3);
    expect(tokenId).equal(3);
  });
});

describe("VWBLERC1155 with web3.js", () => {
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

  before(async () => {
    await vwbl.sign();
  });

  it("mint erc1155 token without gas settings", async () => {
    vwblProtocolStub.mintToken.returns(Promise.resolve(1));

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
    expect(vwblProtocolStub.mintToken.getCall(0).args[4]).equal(undefined);
    expect(vwblApiStub.setKey.callCount).equal(4);
    expect(uploadEncryptedFileStub.callCount).equal(1);
    expect(uploadFileStub.callCount).equal(1);
    expect(uploadMetadataStub.callCount).equal(1);
    expect(tokenId).equal(1);
  });

  it("mint erc1155 token with maxPriorityFee and maxFee", async () => {
    vwblProtocolStub.mintToken.returns(Promise.resolve(2));
    const testSubscriber = {
      kickStep: () => {}
    }
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
      testFunctions.uploadMetadata,
      testSubscriber,
      {maxPriorityFeePerGas: 40000000000, maxFeePerGas: 41000000000}
    );

    expect(vwblProtocolStub.mintToken.callCount).equal(2);
    expect(vwblProtocolStub.mintToken.getCall(1).args[4]).deep.equal({maxPriorityFeePerGas: 40000000000, maxFeePerGas: 41000000000});
    expect(vwblApiStub.setKey.callCount).equal(5);
    expect(uploadEncryptedFileStub.callCount).equal(2);
    expect(uploadFileStub.callCount).equal(2);
    expect(uploadMetadataStub.callCount).equal(2);
    expect(tokenId).equal(2);
  });

  it("mint erc1155 token with gasPrice", async () => {
    vwblProtocolStub.mintToken.returns(Promise.resolve(3));
    const testSubscriber = {
      kickStep: () => {}
    }
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
      testFunctions.uploadMetadata,
      testSubscriber,
      {gasPrice: 1000}
    );

    expect(vwblProtocolStub.mintToken.callCount).equal(3);
    expect(vwblProtocolStub.mintToken.getCall(2).args[4]).deep.equal({gasPrice: 1000});
    expect(vwblApiStub.setKey.callCount).equal(6);
    expect(uploadEncryptedFileStub.callCount).equal(3);
    expect(uploadFileStub.callCount).equal(3);
    expect(uploadMetadataStub.callCount).equal(3);
    expect(tokenId).equal(3);
  });
});

describe("VWBL with ethers.js", () => {
  const vwblProtocolStub = {
    mintToken: sinon.stub(VWBLNFTEthers.prototype, "mintToken"),
  };

  const vwbl = new VWBL({
    ipfsNftStorageKey: "set nftstorage api key",
    awsConfig: undefined,
    contractAddress: "0x2c7e967093d7fe0eeb5440bf49e5D148417B0412",
    manageKeyType: ManageKeyType.VWBL_NETWORK_SERVER,
    uploadContentType: UploadContentType.CUSTOM,
    uploadMetadataType: UploadMetadataType.CUSTOM,
    vwblNetworkUrl: "http://example.com",
    ethersProvider: ethProvider,
    ethersSigner: ethSigner,
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
  const uploadEncryptedFileStub = sinon
    .stub(testFunctions, "uploadEncryptedFile")
    .returns(Promise.resolve("https://example.com"));
  const uploadFileStub = sinon.stub(testFunctions, "uploadThumbnail").returns(Promise.resolve("https://example.com"));
  const uploadMetadataStub = sinon.stub(testFunctions, "uploadMetadata");

  before(async () => {
    await vwbl.sign();
  });

  it("mint token without gas settings", async () => {
    vwblProtocolStub.mintToken.returns(Promise.resolve(1));
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
    expect(vwblProtocolStub.mintToken.getCall(0).args[3]).equal(undefined);
    expect(vwblApiStub.setKey.callCount).equal(7);
    expect(uploadEncryptedFileStub.callCount).equal(1);
    expect(uploadFileStub.callCount).equal(1);
    expect(uploadMetadataStub.callCount).equal(1);
    expect(tokenId).equal(1);
  });

  it("mint token with maxPriorityFee and maxFee", async () => {
    vwblProtocolStub.mintToken.returns(Promise.resolve(2));
    const testSubscriber = {
      kickStep: () => {}
    }
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
      testFunctions.uploadMetadata,
      testSubscriber,
      {maxPriorityFeePerGas: 40000000000, maxFeePerGas: 41000000000}
    );

    expect(vwblProtocolStub.mintToken.callCount).equal(2);
    expect(vwblProtocolStub.mintToken.getCall(1).args[3]).deep.equal({maxPriorityFeePerGas: 40000000000, maxFeePerGas: 41000000000});
    expect(vwblApiStub.setKey.callCount).equal(8);
    expect(uploadEncryptedFileStub.callCount).equal(2);
    expect(uploadFileStub.callCount).equal(2);
    expect(uploadMetadataStub.callCount).equal(2);
    expect(tokenId).equal(2);
  });

  it("mint token with gasPrice", async () => {
    vwblProtocolStub.mintToken.returns(Promise.resolve(3));
    const testSubscriber = {
      kickStep: () => {}
    }
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
      testFunctions.uploadMetadata,
      testSubscriber,
      {gasPrice:1000}
    );

    expect(vwblProtocolStub.mintToken.callCount).equal(3);
    expect(vwblProtocolStub.mintToken.getCall(2).args[3]).deep.equal({gasPrice: 1000});
    expect(vwblApiStub.setKey.callCount).equal(9);
    expect(uploadEncryptedFileStub.callCount).equal(3);
    expect(uploadFileStub.callCount).equal(3);
    expect(uploadMetadataStub.callCount).equal(3);
    expect(tokenId).equal(3);
  });
});

describe("VWBLERC1155 with ethers.js", () => {
  const vwblProtocolStub = {
    mintToken: sinon.stub( VWBLERC1155EthersContract.prototype, "mintToken"),
  };

  const vwbl = new VWBLERC1155({
    ipfsNftStorageKey: "set nftstorage api key",
    awsConfig: undefined,
    contractAddress: "0x2c7e967093d7fe0eeb5440bf49e5D148417B0412",
    manageKeyType: ManageKeyType.VWBL_NETWORK_SERVER,
    uploadContentType: UploadContentType.CUSTOM,
    uploadMetadataType: UploadMetadataType.CUSTOM,
    vwblNetworkUrl: "http://example.com",
    ethersProvider: ethProvider,
    ethersSigner: ethSigner,
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
  const uploadEncryptedFileStub = sinon
  .stub(testFunctions, "uploadEncryptedFile")
  .returns(Promise.resolve("https://example.com"));
  const uploadFileStub = sinon.stub(testFunctions, "uploadThumbnail").returns(Promise.resolve("https://example.com"));
  const uploadMetadataStub = sinon.stub(testFunctions, "uploadMetadata");

  before(async () => {
    await vwbl.sign();
  });

  it("mint erc1155 token without gas settings", async () => {
    vwblProtocolStub.mintToken.returns(Promise.resolve(1));

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
    expect(vwblProtocolStub.mintToken.getCall(0).args[4]).equal(undefined);
    expect(vwblApiStub.setKey.callCount).equal(10);
    expect(uploadEncryptedFileStub.callCount).equal(1);
    expect(uploadFileStub.callCount).equal(1);
    expect(uploadMetadataStub.callCount).equal(1);
    expect(tokenId).equal(1);
  });

  it("mint erc1155 token with maxPriorityFee and maxFee", async () => {
    vwblProtocolStub.mintToken.returns(Promise.resolve(2));
    const testSubscriber = {
      kickStep: () => {}
    }
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
      testFunctions.uploadMetadata,
      testSubscriber,
      {maxPriorityFeePerGas: 40000000000, maxFeePerGas: 41000000000}
    );

    expect(vwblProtocolStub.mintToken.callCount).equal(2);
    expect(vwblProtocolStub.mintToken.getCall(1).args[4]).deep.equal({maxPriorityFeePerGas: 40000000000, maxFeePerGas: 41000000000});
    expect(vwblApiStub.setKey.callCount).equal(11);
    expect(uploadEncryptedFileStub.callCount).equal(2);
    expect(uploadFileStub.callCount).equal(2);
    expect(uploadMetadataStub.callCount).equal(2);
    expect(tokenId).equal(2);
  });

  it("mint erc1155 token with gasPrice", async () => {
    vwblProtocolStub.mintToken.returns(Promise.resolve(3));
    const testSubscriber = {
      kickStep: () => {}
    }
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
      testFunctions.uploadMetadata,
      testSubscriber,
      {gasPrice: 1000}
    );

    expect(vwblProtocolStub.mintToken.callCount).equal(3);
    expect(vwblProtocolStub.mintToken.getCall(2).args[4]).deep.equal({gasPrice: 1000});
    expect(vwblApiStub.setKey.callCount).equal(12);
    expect(uploadEncryptedFileStub.callCount).equal(3);
    expect(uploadFileStub.callCount).equal(3);
    expect(uploadMetadataStub.callCount).equal(3);
    expect(tokenId).equal(3);
  });
});
