import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import { AbiItem } from "web3-utils";
import { GasSettings } from '../types';

import vwbl from "../../contract/VWBL.json";

export class VWBLNFT {
  private contract: Contract;
  private web3: Web3;

  constructor(web3: Web3, address: string) {
    this.web3 = web3;
    this.contract = new web3.eth.Contract(vwbl.abi as AbiItem[], address);
  }
  async mintToken(decryptUrl: string, royaltiesPercentage: number, documentId: string, gasSettings?: GasSettings) {
    const myAddress = (await this.web3.eth.getAccounts())[0];
    const fee = await this.getFee();
    console.log("transaction start");
    // TODO: callBackを受け取って、トランザクションの終了をユーザに通知できるようにする
    const receipt = await this.contract.methods
      .mint(decryptUrl, royaltiesPercentage, documentId)
      .send({ from: myAddress, value: fee, ...gasSettings });
    console.log("transaction end");
    const tokenId: number = receipt.events.Transfer.returnValues.tokenId;
    return tokenId;
  }

  async getOwnTokenIds() {
    const myAddress = (await this.web3.eth.getAccounts())[0];
    const balance = await this.contract.methods.balanceOf(myAddress).call();
    return await Promise.all(
      range(Number.parseInt(balance)).map(async (i) => {
        const ownTokenId = await this.contract.methods.tokenOfOwnerByIndex(myAddress, i).call();
        return Number.parseInt(ownTokenId);
      })
    );
  }

  async getTokenByMinter(address :string) {
    return await this.contract.methods.getTokenByMinter(address).call();
  }

  async getMetadataUrl(tokenId: number) {
    return await this.contract.methods.tokenURI(tokenId).call();
  }

  async getOwner(tokenId: number) {
    return await this.contract.methods.ownerOf(tokenId).call();
  }

  async isOwnerOf(tokenId: number) {
    const myAddress = (await this.web3.eth.getAccounts())[0];
    const owner = await this.getOwner(tokenId);
    return myAddress === owner;
  }

  async getFee() {
    return await this.contract.methods.getFee().call();
  }

  async getTokenInfo(tokenId: number) {
    return await this.contract.methods.tokenIdToTokenInfo(tokenId).call();
  }

  async approve(operator: string, tokenId: number, gasSettings?: GasSettings): Promise<void> {
    const myAddress = (await this.web3.eth.getAccounts())[0];
    await this.contract.methods.approve(operator, tokenId).send({ from: myAddress, ...gasSettings });
  }

  async getApproved(tokenId: number): Promise<string> {
    return await this.contract.methods.getApproved(tokenId).call();
  }

  async setApprovalForAll(operator: string, gasSettings?: GasSettings): Promise<void> {
    const myAddress = (await this.web3.eth.getAccounts())[0];
    await this.contract.methods.setApprovalForAll(operator, true).send({ from: myAddress, ...gasSettings });
  }

  async isApprovedForAll(owner: string, operator: string): Promise<boolean> {
    return await this.contract.methods.isApprovedForAll(owner, operator).call();
  }
}

const range = (length: number) => {
  return Array.from(Array(length).keys());
};
