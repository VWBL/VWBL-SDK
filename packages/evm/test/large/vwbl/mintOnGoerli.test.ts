import { expect } from "chai";
import * as dotenv from "dotenv";
import { Web3 } from "web3";
import { ethers } from "ethers";
import {
  ManageKeyType,
  UploadContentType,
  UploadMetadataType,
  uploadEncryptedFileToIPFS,
  uploadThumbnailToIPFS,
  uploadMetadataToIPFS,
} from "vwbl-core";
// eslint-disable-next-line @typescript-eslint/no-var-requires
import { VWBL } from "../../../src/vwbl";
import HDWalletProvider from "@truffle/hdwallet-provider";
import * as FileAPI from "file-api";
const File = FileAPI.File;
dotenv.config();

const providerUrl = process.env.GOERLI_PROVIDER_URL;
const nftContractAddr = process.env.GOERLI_NFT_CONTRACT as string;
const networkUrl = "https://dev.vwbl.network/";
// preparation for web3.js
const hdWalletProvider = new HDWalletProvider({
  privateKeys: [process.env.PRIVATE_KEY as string],
  providerOrUrl: providerUrl
})
const web3 = new Web3(hdWalletProvider as any);
// preparation for ethers.js
const privateKey = process.env.PRIVATE_KEY as string;
const ethProvider = new ethers.providers.JsonRpcProvider(providerUrl);
const ethSigner = new ethers.Wallet(privateKey, ethProvider);
const maxPriorityFee_gwei = '1.5';
const maxFee_gwei = '47.329387804';

describe("VWBL with web3.js", () => {
  const vwbl = new VWBL({
    ipfsConfig: undefined,
    awsConfig: undefined,
    contractAddress: nftContractAddr,
    manageKeyType: ManageKeyType.VWBL_NETWORK_SERVER,
    uploadContentType: UploadContentType.IPFS,
    uploadMetadataType: UploadMetadataType.IPFS,
    vwblNetworkUrl: networkUrl,
    web3,
  });

  const testSubscriber = {
    kickStep: () => {},
  };

  it.skip("mint token with maxPriorityFee and maxFee", async () => {
    await vwbl.sign();

    const maxPriorityFee_wei = Number(web3.utils.toWei(maxPriorityFee_gwei, 'gwei'));
    const maxFee_wei = Number(web3.utils.toWei(maxFee_gwei, 'gwei'));

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
      uploadEncryptedFileToIPFS,
      uploadThumbnailToIPFS,
      uploadMetadataToIPFS,
      testSubscriber,
      {maxPriorityFeePerGas: maxPriorityFee_wei,
        maxFeePerGas: maxFee_wei}
    );
    console.log(tokenId, typeof tokenId);
    expect(typeof tokenId).equal("string"); //WARNING:The return value type for 'tokenId' is a string.
  });

  it("mint token with gasPrice", async () => {
    await vwbl.sign();

    const gasPrice = Number(await web3.eth.getGasPrice());

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
      uploadEncryptedFileToIPFS,
      uploadThumbnailToIPFS,
      uploadMetadataToIPFS,
      testSubscriber,
      {gasPrice}
    );
    console.log(tokenId, typeof tokenId);
    expect(typeof tokenId).equal("string"); //WARNING:The return value type for 'tokenId' is a string.
  });

  it.skip("mint token without gas settings", async () => {
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
      uploadEncryptedFileToIPFS,
      uploadThumbnailToIPFS,
      uploadMetadataToIPFS,
    );
    console.log(tokenId, typeof tokenId);
    expect(typeof tokenId).equal("string"); //WARNING:The return value type for 'tokenId' is a string.
  });
});

describe("VWBL with ethers.js", () => {
  const vwbl = new VWBL({
    ipfsConfig: undefined,
    awsConfig: undefined,
    contractAddress: nftContractAddr,
    manageKeyType: ManageKeyType.VWBL_NETWORK_SERVER,
    uploadContentType: UploadContentType.IPFS,
    uploadMetadataType: UploadMetadataType.IPFS,
    vwblNetworkUrl: networkUrl,
    ethersProvider: ethProvider,
    ethersSigner: ethSigner,
  });

  const testSubscriber = {
    kickStep: () => {},
  };

  it.skip("mint token with maxPriorityFee and maxFee", async () => {
    await vwbl.sign();

    const maxPriorityFee_wei = Number(web3.utils.toWei(maxPriorityFee_gwei, 'gwei'));
    const maxFee_wei = Number(web3.utils.toWei(maxFee_gwei, 'gwei'));

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
      uploadEncryptedFileToIPFS,
      uploadThumbnailToIPFS,
      uploadMetadataToIPFS,
      testSubscriber,
      {maxPriorityFeePerGas: maxPriorityFee_wei,
        maxFeePerGas: maxFee_wei}
    );
    console.log(tokenId, typeof tokenId);
    expect(typeof tokenId).equal("number");
  });

  it("mint token with gasPrice", async () => {
    await vwbl.sign();

    const gasPrice = Number(await web3.eth.getGasPrice());

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
      uploadEncryptedFileToIPFS,
      uploadThumbnailToIPFS,
      uploadMetadataToIPFS,
      testSubscriber,
      {gasPrice}
    );
    console.log(tokenId, typeof tokenId);
    expect(typeof tokenId).equal("number");
  });

  it.skip("mint token without gas settings", async () => {
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
      uploadEncryptedFileToIPFS,
      uploadThumbnailToIPFS,
      uploadMetadataToIPFS,
    );
    console.log(tokenId, typeof tokenId);
    expect(typeof tokenId).equal("number");
  });
});
