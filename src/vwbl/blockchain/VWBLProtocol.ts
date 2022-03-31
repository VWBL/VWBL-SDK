import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import { AbiItem } from "web3-utils";

import vwbl from "../../contract/vwbl.json";

export class VWBLNFT {
  private contract: Contract;
  private web3: Web3;

  constructor(web3: Web3, address: string) {
    this.web3 = web3;
    this.contract = new web3.eth.Contract(vwbl.abi as AbiItem[], address);
  }
  async mintToken(decryptUrl: string, royaltiesPercentage: number, documentId: string) {
    const myAddress = (await this.web3.eth.getAccounts())[0];
    const fee = await this.getFee();
    console.log("transaction start");
    // TODO: callBackを受け取って、トランザクションの終了をユーザに通知できるようにする
    const receipt = await this.contract.methods
      .mint(decryptUrl, royaltiesPercentage, this.web3.utils.asciiToHex(documentId))
      .send({ from: myAddress, value: fee });
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
}

const range = (length: number) => {
  return Array.from(Array(length).keys());
};
