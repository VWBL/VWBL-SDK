import { ethers } from "ethers";

import vwbl from "../../../contract/VWBL.json";
import vwblIPFS from "../../../contract/VWBLSupportIPFS.json";
import { getFeeSettingsBasedOnEnvironment } from "../../../util/transactionHelper";
import { GasSettings } from "../../types";

export class VWBLNFTEthers {
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
      ? new ethers.Contract(address, vwblIPFS.abi, ethersSigner)
      : new ethers.Contract(address, vwbl.abi, ethersSigner);
  }

  async mintToken(decryptUrl: string, royaltiesPercentage: number, documentId: string, gasSettings?: GasSettings) {
    const fee = await this.getFee();
    console.log("transaction start");
    if (gasSettings?.gasPrice) {
      const gas = await this.contract.estimateGas.mint(decryptUrl, royaltiesPercentage, documentId);
      const tx = await this.contract.mint(decryptUrl, royaltiesPercentage, documentId, {
        value: fee,
        gas,
        gasPrice: gasSettings?.gasPrice,
      });
      const receipt = await this.ethersProvider.waitForTransaction(tx.hash);
      console.log("transaction end");
      const tokenId = parseToTokenId(receipt);
      return tokenId;
    }
    const { maxPriorityFeePerGas: _maxPriorityFeePerGas, maxFeePerGas: _maxFeePerGas } =
      getFeeSettingsBasedOnEnvironment(gasSettings?.maxPriorityFeePerGas, gasSettings?.maxFeePerGas);
    const tx = await this.contract.mint(decryptUrl, royaltiesPercentage, documentId, {
      value: fee,
      maxPriorityFeePerGas: _maxPriorityFeePerGas,
      maxFeePerGas: _maxFeePerGas,
    });
    const receipt = await this.ethersProvider.waitForTransaction(tx.hash);
    console.log("transaction end");
    const tokenId = parseToTokenId(receipt);
    return tokenId;
  }

  async mintTokenForIPFS(
    metadataUrl: string,
    decryptUrl: string,
    royaltiesPercentage: number,
    documentId: string,
    gasSettings?: GasSettings
  ) {
    const fee = await this.getFee();
    console.log("transaction start");
    if (gasSettings?.gasPrice) {
      const gas = await this.contract.estimateGas.mint(metadataUrl, decryptUrl, royaltiesPercentage, documentId);
      const tx = await this.contract.mint(metadataUrl, decryptUrl, royaltiesPercentage, documentId, {
        value: fee,
        gas,
        gasPrice: gasSettings?.gasPrice,
      });
      const receipt = await this.ethersProvider.waitForTransaction(tx.hash);
      console.log("transaction end");
      const tokenId = parseToTokenId(receipt);
      return tokenId;
    }
    const { maxPriorityFeePerGas: _maxPriorityFeePerGas, maxFeePerGas: _maxFeePerGas } =
      getFeeSettingsBasedOnEnvironment(gasSettings?.maxPriorityFeePerGas, gasSettings?.maxFeePerGas);
    const tx = await this.contract.mint(metadataUrl, decryptUrl, royaltiesPercentage, documentId, {
      value: fee,
      maxPriorityFeePerGas: _maxPriorityFeePerGas,
      maxFeePerGas: _maxFeePerGas,
    });
    const receipt = await this.ethersProvider.waitForTransaction(tx.hash);
    console.log("transaction end");
    const tokenId = parseToTokenId(receipt);
    return tokenId;
  }

  async getOwnTokenIds() {
    const myAddress = await this.ethersSigner.getAddress();
    const balance = await this.contract.callStatic.balanceOf(myAddress);
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
    return await this.contract.callStatic.tokenURI(tokenId);
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

  async approve(operator: string, tokenId: number, gasSettings?: GasSettings): Promise<void> {
    if (gasSettings?.gasPrice) {
      const gas = await this.contract.estimateGas.approve(operator, tokenId);
      const tx = await this.contract.approve(operator, tokenId, {
        gas,
        gasPrice: gasSettings?.gasPrice,
      });
    }
    const { maxPriorityFeePerGas: _maxPriorityFeePerGas, maxFeePerGas: _maxFeePerGas } =
      getFeeSettingsBasedOnEnvironment(gasSettings?.maxPriorityFeePerGas, gasSettings?.maxFeePerGas);
    const tx = await this.contract.approve(operator, tokenId, {
      maxPriorityFeePerGas: _maxPriorityFeePerGas,
      maxFeePerGas: _maxFeePerGas,
    });
    await this.ethersProvider.waitForTransaction(tx.hash);
  }

  async getApproved(tokenId: number): Promise<string> {
    return await this.contract.callStatic.getApproved(tokenId);
  }

  async setApprovalForAll(operator: string, gasSettings?: GasSettings): Promise<void> {
    if (gasSettings?.gasPrice) {
      const gas = await this.contract.estimateGas.setApprovalForAll(operator, true);
      const tx = await this.contract.setApprovalForAll(operator, true, {
        gas,
        gasPrice: gasSettings?.gasPrice,
      });
    }
    const { maxPriorityFeePerGas: _maxPriorityFeePerGas, maxFeePerGas: _maxFeePerGas } =
      getFeeSettingsBasedOnEnvironment(gasSettings?.maxPriorityFeePerGas, gasSettings?.maxFeePerGas);
    const tx = await this.contract.setApprovalForAll(operator, true, {
      maxPriorityFeePerGas: _maxPriorityFeePerGas,
      maxFeePerGas: _maxFeePerGas,
    });
    await this.ethersProvider.waitForTransaction(tx.hash);
  }

  async isApprovedForAll(owner: string, operator: string): Promise<boolean> {
    return await this.contract.callStatic.isApprovedForAll(owner, operator);
  }

  async safeTransfer(to: string, tokenId: number, gasSettings?: GasSettings): Promise<void> {
    const myAddress = await this.ethersSigner.getAddress();
    if (gasSettings?.gasPrice) {
      const gas = await this.contract.estimateGas.safeTransferFrom(myAddress, to, tokenId);
      const tx = await this.contract.safeTransferFrom(myAddress, to, tokenId, {
        gas,
        gasPrice: gasSettings?.gasPrice,
      });
    }
    const { maxPriorityFeePerGas: _maxPriorityFeePerGas, maxFeePerGas: _maxFeePerGas } =
      getFeeSettingsBasedOnEnvironment(gasSettings?.maxPriorityFeePerGas, gasSettings?.maxFeePerGas);
    const tx = await this.contract.safeTransferFrom(myAddress, to, tokenId, {
      maxPriorityFeePerGas: _maxPriorityFeePerGas,
      maxFeePerGas: _maxFeePerGas,
    });
    await this.ethersProvider.waitForTransaction(tx.hash);
  }
}

const range = (length: number) => {
  return Array.from(Array(length).keys());
};

const parseToTokenId = (receipt: ethers.providers.TransactionReceipt): number => {
  const eventInterface = new ethers.utils.Interface([
    "event nftDataRegistered(address contractAddress, uint256 tokenId)",
  ]);
  let tokenId = 0;
  receipt.logs.forEach((log) => {
    // check whether topic is nftDataRegistered(address contractAddress, uint256 tokenId)
    if (log.topics[0] === "0x957e0e652e4d598197f2c5b25940237e404f3899238efb6f64df2377e9aaf36c") {
      const description = eventInterface.parseLog({ topics: log.topics, data: log.data });
      tokenId = description.args[1].toNumber();
    }
  });
  return tokenId;
};
