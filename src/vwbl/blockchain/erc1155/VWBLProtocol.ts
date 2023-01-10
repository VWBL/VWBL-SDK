import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import { AbiItem } from "web3-utils";

import vwbl1155 from "../../../contract/VWBLERC1155.json";
import vwbl1155IPFS from "../../../contract/VWBLERC1155SupportIPFS.json";

export class VWBLERC1155Contract {
  private contract: Contract;
  private web3: Web3;

  constructor(web3: Web3, address: string, isIpfs: boolean) {
    this.web3 = web3;
    this.contract = isIpfs
      ? new web3.eth.Contract(vwbl1155IPFS.abi as AbiItem[], address)
      : new web3.eth.Contract(vwbl1155.abi as AbiItem[], address);
  }

  async mintToken(decryptUrl: string, amount: number, royaltiesPercentage: number, documentId: string) {
    const myAddress = (await this.web3.eth.getAccounts())[0];
    const fee = await this.getFee();
    console.log("transaction start");
    const receipt = await this.contract.methods.mint(decryptUrl, amount, royaltiesPercentage, documentId).send({
      from: myAddress,
      value: fee,
      maxPriorityFeePerGas: null,
      maxFeePerGas: null,
    });
    console.log("transaction end");
    const tokenId: number = receipt.events.TransferSingle.returnValues.id;
    return tokenId;
  }

  async batchMintToken(decryptUrl: string, amount: number[], royaltiesPercentage: number[], documentId: string[]) {
    const myAddress = (await this.web3.eth.getAccounts())[0];
    const fee = await this.getFee();
    console.log("transaction start");
    const receipt = await this.contract.methods.mintBatch(decryptUrl, amount, royaltiesPercentage, documentId).send({
      from: myAddress,
      value: fee,
      maxPriorityFeePerGas: null,
      maxFeePerGas: null,
    });
    console.log("transaction end");
    const tokenIds: number[] = receipt.events.TransferBatch.returnValues.ids;
    return tokenIds;
  }

  async mintTokenForIPFS(
    metadataUrl: string,
    decryptUrl: string,
    amount: number,
    royaltiesPercentage: number,
    documentId: string
  ) {
    const myAddress = (await this.web3.eth.getAccounts())[0];
    const fee = await this.getFee();
    console.log("transaction start");
    const receipt = await this.contract.methods
      .mint(metadataUrl, decryptUrl, amount, royaltiesPercentage, documentId)
      .send({
        from: myAddress,
        value: fee,
        maxPriorityFeePerGas: null,
        maxFeePerGas: null,
      });
    console.log("transaction end");
    const tokenId: number = receipt.events.TransferSingle.returnValues.id;
    return tokenId;
  }

  async batchMintTokenForIPFS(
    metadataUrl: string,
    decryptUrl: string,
    amount: number[],
    royaltiesPercentage: number[],
    documentId: string[]
  ) {
    const myAddress = (await this.web3.eth.getAccounts())[0];
    const fee = await this.getFee();
    console.log("transaction start");
    const receipt = await this.contract.methods
      .mintBatch(metadataUrl, decryptUrl, amount, royaltiesPercentage, documentId)
      .send({
        from: myAddress,
        value: fee,
        maxPriorityFeePerGas: null,
        maxFeePerGas: null,
      });
    console.log("transaction end");
    const tokenIds: number[] = receipt.events.TransferBatch.returnValues.ids;
    return tokenIds;
  }

  async getOwnTokenIds() {
    const myAddress = (await this.web3.eth.getAccounts())[0];
    const balance = await this.contract.methods.tokenCountOfOwner(myAddress).call();
    return await Promise.all(
      range(Number.parseInt(balance)).map(async (i) => {
        const ownTokenId = await this.contract.methods.tokenOfOwnerByIndex(myAddress, i).call();
        return Number.parseInt(ownTokenId);
      })
    );
  }

  async getTokenByMinter(address: string) {
    return await this.contract.methods.getTokenByMinter(address).call();
  }

  async getMetadataUrl(tokenId: number) {
    return await this.contract.methods.uri(tokenId).call();
  }

  async getOwner(tokenId: number) {
    return await this.contract.methods.ownerOf(tokenId).call();
  }

  async getMinter(tokenId: number) {
    return await this.contract.methods.getMinter(tokenId).call();
  }

  async isOwnerOf(tokenId: number) {
    const myAddress = (await this.web3.eth.getAccounts())[0];
    const owner = await this.getOwner(tokenId);
    return myAddress === owner;
  }

  async isMinterOf(tokenId: number) {
    const myAddress = (await this.web3.eth.getAccounts())[0];
    const minter = await this.getMinter(tokenId);
    return myAddress === minter;
  }

  async getFee() {
    return await this.contract.methods.getFee().call();
  }

  async getTokenInfo(tokenId: number) {
    return await this.contract.methods.tokenIdToTokenInfo(tokenId).call();
  }

  async setApprovalForAll(operator: string): Promise<void> {
    const myAddress = (await this.web3.eth.getAccounts())[0];
    await this.contract.methods.setApprovalForAll(operator, true).send({
      from: myAddress,
      maxPriorityFeePerGas: null,
      maxFeePerGas: null,
    });
  }

  async isApprovedForAll(owner: string, operator: string): Promise<boolean> {
    return await this.contract.methods.isApprovedForAll(owner, operator).call();
  }

  async safeTransfer(to: string, tokenId: number, amount: number, data: string): Promise<void> {
    const myAddress = (await this.web3.eth.getAccounts())[0];
    return await this.contract.methods.safeTransferFrom(myAddress, to, tokenId, amount, data).send({
      from: myAddress,
      maxPriorityFeePerGas: null,
      maxFeePerGas: null,
    });
  }

  async balanceOf(owner: string, tokenId: number) {
    return await this.contract.methods.balanceOf(owner, tokenId).call();
  }

  async balanceOfBatch(owners: string[], tokenIds: number[]) {
    return await this.contract.methods.balanceOfBatch(owners, tokenIds).call();
  }

  async burn(owner: string, tokenId: number, amount: number) {
    const myAddress = (await this.web3.eth.getAccounts())[0];
    return await this.contract.methods.burn(owner, tokenId, amount).send({
      from: myAddress,
      maxPriorityFeePerGas: null,
      maxFeePerGas: null,
    });
  }

  async burnBatch(owner: string, tokenIds: number[], amount: number[]) {
    const myAddress = (await this.web3.eth.getAccounts())[0];
    return await this.contract.methods.burnBatch(owner, tokenIds, amount).send({
      from: myAddress,
      maxPriorityFeePerGas: null,
      maxFeePerGas: null,
    });
  }
}

const range = (length: number) => {
  return Array.from(Array(length).keys());
};
