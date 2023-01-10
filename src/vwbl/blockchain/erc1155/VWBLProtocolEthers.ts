import { ethers } from "ethers";

import vwbl1155 from "../../../contract/VWBLERC1155.json";
import vwbl1155IPFS from "../../../contract/VWBLERC1155SupportIPFS.json";

export class VWBLERC1155EthersContract {
  private ethersProvider: ethers.providers.BaseProvider;
  private ethersSigner: ethers.providers.JsonRpcSigner | ethers.Wallet;
  private contract: ethers.Contract;

  constructor(
    address: string,
    isIpfs: boolean,
    ethersProvider: ethers.providers.BaseProvider,
    ethersSigner: ethers.providers.JsonRpcSigner | ethers.Wallet
  ) {
    this.ethersProvider = ethersProvider;
    this.ethersSigner = ethersSigner;
    this.contract = isIpfs
      ? new ethers.Contract(address, vwbl1155IPFS.abi, ethersSigner)
      : new ethers.Contract(address, vwbl1155.abi, ethersSigner);
  }

  async mintToken(decryptUrl: string, amount: number, royaltiesPercentage: number, documentId: string) {
    const fee = await this.getFee();
    console.log("transaction start");
    const tx = await this.contract.mint(decryptUrl, amount, royaltiesPercentage, documentId, { value: fee });
    const receipt = await this.ethersProvider.waitForTransaction(tx.hash);
    console.log("transaction end");
    const tokenId = parseToTokenId(receipt);
    return tokenId;
  }

  async batchMintToken(decryptUrl: string, amount: number[], royaltiesPercentage: number[], documentId: string[]) {
    const fee = await this.getFee();
    console.log("transaction start");
    const tx = await this.contract.mintBatch(decryptUrl, amount, royaltiesPercentage, documentId, { value: fee });
    const receipt = await this.ethersProvider.waitForTransaction(tx.hash);
    console.log("transaction end");
    const tokenIds = parseToTokenIds(receipt);
    return tokenIds;
  }

  async mintTokenForIPFS(
    metadataUrl: string,
    decryptUrl: string,
    amount: number,
    royaltiesPercentage: number,
    documentId: string
  ) {
    const fee = await this.getFee();
    console.log("transaction start");
    const tx = await this.contract.mint(metadataUrl, decryptUrl, amount, royaltiesPercentage, documentId, {
      value: fee,
    });
    const receipt = await this.ethersProvider.waitForTransaction(tx.hash);
    console.log("transaction end");
    const tokenId = parseToTokenId(receipt);
    return tokenId;
  }

  async batchMintTokenForIPFS(
    metadataUrl: string,
    decryptUrl: string,
    amount: number[],
    royaltiesPercentage: number[],
    documentId: string[]
  ) {
    const fee = await this.getFee();
    console.log("transaction start");
    const tx = await this.contract.mintBatch(metadataUrl, decryptUrl, amount, royaltiesPercentage, documentId, {
      value: fee,
    });
    const receipt = await this.ethersProvider.waitForTransaction(tx.hash);
    console.log("transaction end");
    const tokenIds = parseToTokenIds(receipt);
    return tokenIds;
  }

  async getOwnTokenIds() {
    const myAddress = await this.ethersSigner.getAddress();
    const balance = await this.contract.callStatic.tokenCountOfOwner(myAddress);
    return await Promise.all(
      range(Number.parseInt(balance)).map(async (i) => {
        const ownTokenId = await this.contract.callStatic.tokenOfOwnerByIndex(myAddress, i);
        return Number.parseInt(ownTokenId);
      })
    );
  }

  async getTokenByMinter(address: string) {
    return await this.contract.callStatic.getTokenByMinter(address);
  }

  async getMetadataUrl(tokenId: number) {
    return await this.contract.callStatic.uri(tokenId);
  }

  async getOwner(tokenId: number) {
    return await this.contract.callStatic.ownerOf(tokenId);
  }

  async getMinter(tokenId: number) {
    return await this.contract.callStatic.getMinter(tokenId);
  }

  async isOwnerOf(tokenId: number) {
    const myAddress = await this.ethersSigner.getAddress();
    const owner = await this.getOwner(tokenId);
    return myAddress === owner;
  }

  async isMinterOf(tokenId: number) {
    const myAddress = await this.ethersSigner.getAddress();
    const minter = await this.getMinter(tokenId);
    return myAddress === minter;
  }

  async getFee() {
    return await this.contract.callStatic.getFee();
  }

  async getTokenInfo(tokenId: number) {
    return await this.contract.callStatic.tokenIdToTokenInfo(tokenId);
  }

  async setApprovalForAll(operator: string): Promise<void> {
    const tx = await this.contract.setApprovalForAll(operator, true);
    await this.ethersProvider.waitForTransaction(tx.hash);
  }

  async isApprovedForAll(owner: string, operator: string): Promise<boolean> {
    return await this.contract.callStatic.isApprovedForAll(owner, operator);
  }

  async safeTransfer(to: string, tokenId: number, amount: number, data: string): Promise<void> {
    const myAddress = await this.ethersSigner.getAddress();
    const tx = await this.contract.safeTransferFrom(myAddress, to, tokenId, amount, data);
    await this.ethersProvider.waitForTransaction(tx.hash);
  }

  async balanceOf(owner: string, tokenId: number) {
    return await this.contract.callStatic.balanceOf(owner, tokenId);
  }

  async balanceOfBatch(owners: string[], tokenIds: number[]) {
    return await this.contract.callStatic.balanceOfBatch(owners, tokenIds);
  }

  async burn(owner: string, tokenId: number, amount: number) {
    const tx = await this.contract.burn(owner, tokenId, amount);
    await this.ethersProvider.waitForTransaction(tx.hash);
  }

  async burnBatch(owner: string, tokenIds: number[], amount: number[]) {
    const tx = await this.contract.burnBatch(owner, tokenIds, amount);
    await this.ethersProvider.waitForTransaction(tx.hash);
  }
}

const range = (length: number) => {
  return Array.from(Array(length).keys());
};

const parseToTokenId = (receipt: ethers.providers.TransactionReceipt): number => {
  const eventInterface = new ethers.utils.Interface([
    "event erc1155DataRegistered(address contractAddress, uint256 tokenId)",
  ]);
  let tokenId = 0;
  receipt.logs.forEach((log) => {
    // check whether topic is erc1155DataRegistered(address contractAddress, uint256 tokenId)
    if (log.topics[0] === "0xf30a336bd6229f1e88c41eeaad2c5fa73b69e4ec90773a67af474031d64fe32f") {
      const description = eventInterface.parseLog({ topics: log.topics, data: log.data });
      tokenId = description.args[1].toNumber();
    }
  });
  return tokenId;
};

const parseToTokenIds = (receipt: ethers.providers.TransactionReceipt): number[] => {
  const eventInterface = new ethers.utils.Interface([
    "event erc1155DataRegistered(address contractAddress, uint256 tokenId)",
  ]);
  const tokenIds: number[] = [];
  receipt.logs.forEach((log) => {
    // check whether topic is erc1155DataRegistered(address contractAddress, uint256 tokenId)
    if (log.topics[0] === "0xf30a336bd6229f1e88c41eeaad2c5fa73b69e4ec90773a67af474031d64fe32f") {
      const description = eventInterface.parseLog({ topics: log.topics, data: log.data });
      tokenIds.push(description.args[1].toNumber());
    }
  });
  return tokenIds;
};
