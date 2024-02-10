import { expect } from 'chai';
import * as dotenv from "dotenv";
import sinon from "sinon";
import ethers  from "ethers";
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
} from "../../src/vwbl";
import Web3 from "web3";
dotenv.config();
// const vwblApiStub = {
//   setKey: sinon.stub(VWBLApi.prototype, "setKey"),
// };

const providerUrl = "https://rpc-mumbai.maticvigil.com/";
//
// preparation for web3.js
const web3 = new Web3(providerUrl as string);
sinon.stub(web3.eth, "getAccounts").returns(Promise.resolve(["test address"]));
sinon.stub(web3.eth.personal, "sign").returns(Promise.resolve("test sign"));

// preparation for ethers.js
const privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'; //Hardhat Network Account(https://hardhat.org/hardhat-network/docs/overview). No problem to disclose.
// const ethProvider = new ethers.providers.JsonRpcProvider(providerUrl);
// const ethSigner = new ethers.Wallet(privateKey, ethProvider);

describe('Sample Tests', () => {
  // before(() => {sinon.stub(ethSigner, "signMessage").returns(Promise.resolve("test sign"));});
  it('should add two numbers', () => {
    const result = 1 + 2;
    expect(result).to.equal(3);
  });

  it('should return the correct result for zero', () => {
    const result = 0 + 0;
    expect(result).to.equal(0);
  });
});
