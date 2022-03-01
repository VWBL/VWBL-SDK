import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import { AbiItem } from "web3-utils";

import nftAbi from "../../contract/vwbl.abi.json";

export class VWBLNFT {
  private contract: Contract;
  private web3: Web3;

  constructor(web3: Web3, address: string) {
    this.web3 = web3;
    this.contract = new web3.eth.Contract(nftAbi as AbiItem[], address);
  }
  mintToken = async (decryptUrl: string) => {
    const myAddress = (await this.web3.eth.getAccounts())[0];
    console.log("transaction start");
    // TODO: callBackを受け取って、トランザクションの終了をユーザに通知できるようにする
    const receipt = await this.contract.methods.mint(decryptUrl).send({ from: myAddress });
    console.log("transaction end");
    const tokenId: number = receipt.events.Transfer.returnValues.tokenId;
    return tokenId;
  };

  getOwnTokenIds = async () => {
    const myAddress = (await this.web3.eth.getAccounts())[0];
    const balance = await this.contract.methods.balanceOf(myAddress).call();
    return await Promise.all(
      range(Number.parseInt(balance)).map(async (i) => {
        const ownTokenId = await this.contract.methods.tokenOfOwnerByIndex(myAddress, i).call();
        return Number.parseInt(ownTokenId);
      })
    );
  };
  getMetadataUrl = async (tokenId: number) => {
    return await this.contract.methods.tokenURI(tokenId).call();
  };

  isOwnerOf = async (tokenId: number) => {
    const myAddress = (await this.web3.eth.getAccounts())[0];
    const owner = await this.contract.methods.ownerOf(tokenId).call();
    return myAddress === owner;
  };
}

const range = (length: number) => {
  return Array.from(Array(length).keys());
};
