import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import { AbiItem } from "web3-utils";

import vwbl from "../../../contract/VWBL.json";
import vwblIPFS from "../../../contract/VWBLSupportIPFS.json";
import { getFeeSettingsBasedOnEnvironment } from "../../../util/transactionHelper";

export class VWBLNFT {
  private contract: Contract;
  private web3: Web3;

  constructor(web3: Web3, address: string, isIpfs: boolean) {
    this.web3 = web3;
    this.contract = isIpfs
      ? new web3.eth.Contract(vwblIPFS.abi as AbiItem[], address)
      : new web3.eth.Contract(vwbl.abi as AbiItem[], address);
  }

  async mintToken(
    decryptUrl: string,
    royaltiesPercentage: number,
    documentId: string,
    maxPriorityFeePerGas?: number,
    maxFeePerGas?: number
  ) {
    const myAddress = (await this.web3.eth.getAccounts())[0];
    const fee = await this.getFee();
    const { maxPriorityFeePerGas: _maxPriorityFeePerGas, maxFeePerGas: _maxFeePerGas } =
      getFeeSettingsBasedOnEnvironment(maxPriorityFeePerGas, maxFeePerGas);
    console.log("transaction start");
    const receipt = await this.contract.methods
      .mint(decryptUrl, royaltiesPercentage, documentId)
      .send({ from: myAddress, value: fee, maxPriorityFeePerGas: _maxPriorityFeePerGas, maxFeePerGas: _maxFeePerGas });
    console.log("transaction end");
    const tokenId: number = receipt.events.Transfer.returnValues.tokenId;
    return tokenId;
  }

  async mintTokenForIPFS(
    metadataUrl: string,
    decryptUrl: string,
    royaltiesPercentage: number,
    documentId: string,
    maxPriorityFeePerGas?: number,
    maxFeePerGas?: number
  ) {
    const myAddress = (await this.web3.eth.getAccounts())[0];
    const fee = await this.getFee();
    const { maxPriorityFeePerGas: _maxPriorityFeePerGas, maxFeePerGas: _maxFeePerGas } =
      getFeeSettingsBasedOnEnvironment(maxPriorityFeePerGas, maxFeePerGas);
    console.log("transaction start");
    const receipt = await this.contract.methods
      .mint(metadataUrl, decryptUrl, royaltiesPercentage, documentId)
      .send({ from: myAddress, value: fee, maxPriorityFeePerGas: _maxPriorityFeePerGas, maxFeePerGas: _maxFeePerGas });
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

  async getTokenByMinter(address: string) {
    return await this.contract.methods.getTokenByMinter(address).call();
  }

  async getMetadataUrl(tokenId: number) {
    return await this.contract.methods.tokenURI(tokenId).call();
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

  async approve(
    operator: string,
    tokenId: number,
    maxPriorityFeePerGas?: number,
    maxFeePerGas?: number
  ): Promise<void> {
    const myAddress = (await this.web3.eth.getAccounts())[0];
    const { maxPriorityFeePerGas: _maxPriorityFeePerGas, maxFeePerGas: _maxFeePerGas } =
      getFeeSettingsBasedOnEnvironment(maxPriorityFeePerGas, maxFeePerGas);
    await this.contract.methods
      .approve(operator, tokenId)
      .send({ from: myAddress, maxPriorityFeePerGas: _maxPriorityFeePerGas, maxFeePerGas: _maxFeePerGas });
  }

  async getApproved(tokenId: number): Promise<string> {
    return await this.contract.methods.getApproved(tokenId).call();
  }

  async setApprovalForAll(operator: string, maxPriorityFeePerGas?: number, maxFeePerGas?: number): Promise<void> {
    const myAddress = (await this.web3.eth.getAccounts())[0];
    const { maxPriorityFeePerGas: _maxPriorityFeePerGas, maxFeePerGas: _maxFeePerGas } =
      getFeeSettingsBasedOnEnvironment(maxPriorityFeePerGas, maxFeePerGas);
    await this.contract.methods
      .setApprovalForAll(operator, true)
      .send({ from: myAddress, maxPriorityFeePerGas: _maxPriorityFeePerGas, maxFeePerGas: _maxFeePerGas });
  }

  async isApprovedForAll(owner: string, operator: string): Promise<boolean> {
    return await this.contract.methods.isApprovedForAll(owner, operator).call();
  }

  async safeTransfer(to: string, tokenId: number, maxPriorityFeePerGas?: number, maxFeePerGas?: number): Promise<void> {
    const myAddress = (await this.web3.eth.getAccounts())[0];
    const { maxPriorityFeePerGas: _maxPriorityFeePerGas, maxFeePerGas: _maxFeePerGas } =
      getFeeSettingsBasedOnEnvironment(maxPriorityFeePerGas, maxFeePerGas);
    await this.contract.methods
      .safeTransferFrom(myAddress, to, tokenId)
      .send({ from: myAddress, maxPriorityFeePerGas: _maxPriorityFeePerGas, maxFeePerGas: _maxFeePerGas });
  }
}

const range = (length: number) => {
  return Array.from(Array(length).keys());
};
