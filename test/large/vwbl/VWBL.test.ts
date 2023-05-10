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
import HDWalletProvider from "@truffle/hdwallet-provider";
import {provider} from "web3-core";

dotenv.config();

type GasInfo = {
  safeLow: { maxPriorityFee: number, maxFee: number },
  standard: { maxPriorityFee: number, maxFee: number },
  fast: { maxPriorityFee: number, maxFee: number },
  estimatedBaseFee: number,
  blockTime: number,
  blockNumber: number
}

const hdWalletProvider = new HDWalletProvider({
  privateKeys: [process.env.PRIVATE_KEY as string],
  providerOrUrl: "https://rpc-mumbai.maticvigil.com/"
})

const web3 = new Web3(hdWalletProvider as provider);

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
      testSubscriber,
      maxPriorityFee_wei,
      maxFee_wei
    );
    console.log(tokenId, typeof tokenId);
    expect(typeof tokenId).equal("string"); //WARNING:The return value type for 'tokenId' is a string.
  });

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
    );
    console.log(tokenId, typeof tokenId);
    expect(typeof tokenId).equal("string"); //WARNING:The return value type for 'tokenId' is a string.
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