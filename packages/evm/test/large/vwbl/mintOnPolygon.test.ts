import { expect } from "chai";
import * as dotenv from "dotenv";
import { Web3 } from "web3";
import { ethers } from "ethers";
import {
  ManageKeyType,
  UploadContentType,
  UploadMetadataType,
} from "vwbl-core";
import { VWBL } from "../../../src/vwbl";
import HDWalletProvider from "@truffle/hdwallet-provider";
import * as FileAPI from "file-api";
const File = FileAPI.File;
dotenv.config();

type GasInfo = {
  safeLow: { maxPriorityFee: number, maxFee: number },
  standard: { maxPriorityFee: number, maxFee: number },
  fast: { maxPriorityFee: number, maxFee: number },
  estimatedBaseFee: number,
  blockTime: number,
  blockNumber: number
}

const providerUrl = process.env.POLYGON_PROVIDER_URL;
const nftContractAddr = "0xdE8Ac10E93698F6805E2B69599854408d1386417"; //polygon
const networkUrl = "https://vwbl.network";
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

  it("mint token with gas settings", async () => {
    await vwbl.sign();

    const gasInfo = await fetchGasInfo();
    if(!gasInfo){
      throw Error('failed to fetch gas information about polygon')
    }
    console.log(gasInfo.standard);
    const maxPriorityFee_wei = Number(web3.utils.toWei(String(gasInfo.standard.maxPriorityFee.toFixed(9)), 'gwei'));
    const maxFee_wei = Number(web3.utils.toWei(String(gasInfo.standard.maxFee.toFixed(9)), 'gwei'));

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
      undefined,
      undefined,
      undefined,
      testSubscriber,
      { maxPriorityFeePerGas: maxPriorityFee_wei, maxFeePerGas: maxFee_wei }
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

  it("mint token with gas settings", async () => {
    await vwbl.sign();

    const gasInfo = await fetchGasInfo();
    if(!gasInfo){
      throw Error('failed to fetch gas information about polygon')
    }
    console.log(gasInfo.standard);
    const maxPriorityFee_wei = Number(web3.utils.toWei(String(gasInfo.standard.maxPriorityFee.toFixed(9)), 'gwei'));
    const maxFee_wei = Number(web3.utils.toWei(String(gasInfo.standard.maxFee.toFixed(9)), 'gwei'));

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
      undefined,
      undefined,
      undefined,
      testSubscriber,
      { maxPriorityFeePerGas: maxPriorityFee_wei, maxFeePerGas: maxFee_wei }
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
    );
    console.log(tokenId, typeof tokenId);
    expect(typeof tokenId).equal("number");
  });
});

async function fetchGasInfo():Promise<GasInfo | undefined>{
  try{
    const response = await fetch('https://gasstation-mainnet.matic.network/v2')
    const gasInfo = await response.json();
    console.log(gasInfo);

    return gasInfo;
  }catch(error){
    console.log(error);
    throw Error('failed to execute fetchGasInfo()')
  }
}
