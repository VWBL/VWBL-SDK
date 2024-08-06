import { ethers } from "ethers";

import vwbl1155 from "../../../contract/VWBLERC1155ERC2981.json";
import vwbl1155IPFS from "../../../contract/VWBLERC1155ERC2981ForMetadata.json";
import { getFeeSettingsBasedOnEnvironment } from "../../../util/transactionHelper";
import { GasSettings } from "../../types";

export class VWBLERC1155EthersContract {
  private ethersProvider: ethers.Provider;
  private ethersSigner: ethers.Signer;
  private contract: ethers.Contract;

  constructor(address: string, isIpfs: boolean, ethersProvider: ethers.Provider, ethersSigner: ethers.Signer) {
    this.ethersProvider = ethersProvider;
    this.ethersSigner = ethersSigner;
    this.contract = isIpfs
      ? new ethers.Contract(address, vwbl1155IPFS.abi, ethersSigner)
      : new ethers.Contract(address, vwbl1155.abi, ethersSigner);
  }

  async mintToken(
    decryptUrl: string,
    amount: number,
    feeNumerator: number,
    documentId: string,
    gasSettings?: GasSettings
  ) {
    const fee = await this.getFee();
    let txSettings: unknown;
    if (gasSettings?.gasPrice) {
      txSettings = {
        value: fee,
        gasPrice: gasSettings?.gasPrice,
      };
    } else {
      const { maxPriorityFeePerGas: _maxPriorityFeePerGas, maxFeePerGas: _maxFeePerGas } =
        getFeeSettingsBasedOnEnvironment(gasSettings?.maxPriorityFeePerGas, gasSettings?.maxFeePerGas);
      txSettings = {
        value: fee,
        maxPriorityFeePerGas: _maxPriorityFeePerGas,
        maxFeePerGas: _maxFeePerGas,
      };
    }
    console.log("transaction start");
    const tx = await this.contract.mint(decryptUrl, amount, feeNumerator, documentId, txSettings);
    const receipt = await this.ethersProvider.waitForTransaction(tx.hash);
    console.log("transaction end");

    let tokenId;
    if (receipt) {
      tokenId = parseToTokenId(receipt);
    } else {
      console.error("Receipt is null");
    }
    return tokenId;
  }

  async batchMintToken(
    decryptUrl: string,
    amount: number[],
    feeNumerator: number[],
    documentId: string[],
    gasSettings?: GasSettings
  ) {
    const fee = await this.getFee();
    let txSettings: unknown;
    if (gasSettings?.gasPrice) {
      txSettings = {
        value: fee,
        gasPrice: gasSettings?.gasPrice,
      };
    } else {
      const { maxPriorityFeePerGas: _maxPriorityFeePerGas, maxFeePerGas: _maxFeePerGas } =
        getFeeSettingsBasedOnEnvironment(gasSettings?.maxPriorityFeePerGas, gasSettings?.maxFeePerGas);
      txSettings = {
        value: fee,
        maxPriorityFeePerGas: _maxPriorityFeePerGas,
        maxFeePerGas: _maxFeePerGas,
      };
    }
    console.log("transaction start");
    const tx = await this.contract.mintBatch(decryptUrl, amount, feeNumerator, documentId, txSettings);
    const receipt = await this.ethersProvider.waitForTransaction(tx.hash);
    console.log("transaction end");
    let tokenIds;
    if (receipt) {
      tokenIds = parseToTokenIds(receipt);
    } else {
      console.error("Receipt is null");
    }
    return tokenIds;
  }

  async mintTokenForIPFS(
    metadataUrl: string,
    decryptUrl: string,
    amount: number,
    feeNumerator: number,
    documentId: string,
    gasSettings?: GasSettings
  ) {
    const fee = await this.getFee();
    let txSettings: unknown;
    if (gasSettings?.gasPrice) {
      txSettings = {
        value: fee,
        gasPrice: gasSettings?.gasPrice,
      };
    } else {
      const { maxPriorityFeePerGas: _maxPriorityFeePerGas, maxFeePerGas: _maxFeePerGas } =
        getFeeSettingsBasedOnEnvironment(gasSettings?.maxPriorityFeePerGas, gasSettings?.maxFeePerGas);
      txSettings = {
        value: fee,
        maxPriorityFeePerGas: _maxPriorityFeePerGas,
        maxFeePerGas: _maxFeePerGas,
      };
    }
    console.log("transaction start");
    const tx = await this.contract.mint(metadataUrl, decryptUrl, amount, feeNumerator, documentId, txSettings);
    const receipt = await this.ethersProvider.waitForTransaction(tx.hash);
    console.log("transaction end");
    let tokenIds;
    if (receipt) {
      tokenIds = parseToTokenIds(receipt);
    } else {
      console.error("Receipt is null");
    }
    return tokenIds;
  }

  async batchMintTokenForIPFS(
    metadataUrl: string,
    decryptUrl: string,
    amount: number[],
    feeNumerator: number[],
    documentId: string[],
    gasSettings?: GasSettings
  ) {
    const fee = await this.getFee();
    let txSettings: unknown;
    if (gasSettings?.gasPrice) {
      txSettings = {
        value: fee,
        gasPrice: gasSettings?.gasPrice,
      };
    } else {
      const { maxPriorityFeePerGas: _maxPriorityFeePerGas, maxFeePerGas: _maxFeePerGas } =
        getFeeSettingsBasedOnEnvironment(gasSettings?.maxPriorityFeePerGas, gasSettings?.maxFeePerGas);
      txSettings = {
        value: fee,
        maxPriorityFeePerGas: _maxPriorityFeePerGas,
        maxFeePerGas: _maxFeePerGas,
      };
    }
    console.log("transaction start");
    const tx = await this.contract.mintBatch(metadataUrl, decryptUrl, amount, feeNumerator, documentId, txSettings);
    const receipt = await this.ethersProvider.waitForTransaction(tx.hash);
    console.log("transaction end");
    let tokenIds;
    if (receipt) {
      tokenIds = parseToTokenIds(receipt);
    } else {
      console.error("Receipt is null");
    }
    return tokenIds;
  }

  async getOwnTokenIds() {
    const myAddress = await this.ethersSigner.getAddress();
    const balance = await this.contract.tokenCountOfOwner(myAddress);
    return await Promise.all(
      range(Number.parseInt(balance)).map(async (i) => {
        const ownTokenId = await this.contract.tokenOfOwnerByIndex(myAddress, i);
        return Number.parseInt(ownTokenId);
      })
    );
  }

  async getTokenByMinter(address: string) {
    return await this.contract.getTokenByMinter.staticCall(address);
  }

  async getMetadataUrl(tokenId: number) {
    return await this.contract.uri.staticCall(tokenId);
  }

  async getOwner(tokenId: number) {
    return await this.contract.ownerOf.staticCall(tokenId);
  }

  async getMinter(tokenId: number) {
    return await this.contract.getMinter.staticCall(tokenId);
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
    return await this.contract.getFee.staticCall();
  }

  async getTokenInfo(tokenId: number) {
    return await this.contract.tokenIdToTokenInfo.staticCall(tokenId);
  }
  async setApprovalForAll(operator: string, gasSettings?: GasSettings): Promise<void> {
    let txSettings: unknown;
    if (gasSettings?.gasPrice) {
      txSettings = {
        gasPrice: gasSettings?.gasPrice,
      };
    } else {
      const { maxPriorityFeePerGas: _maxPriorityFeePerGas, maxFeePerGas: _maxFeePerGas } =
        getFeeSettingsBasedOnEnvironment(gasSettings?.maxPriorityFeePerGas, gasSettings?.maxFeePerGas);
      txSettings = {
        maxPriorityFeePerGas: _maxPriorityFeePerGas,
        maxFeePerGas: _maxFeePerGas,
      };
    }
    const tx = await this.contract.setApprovalForAll(operator, true, txSettings);
    await this.ethersProvider.waitForTransaction(tx.hash);
  }

  async isApprovedForAll(owner: string, operator: string): Promise<boolean> {
    return await this.contract.isApprovedForAll.staticCall(owner, operator);
  }

  async safeTransfer(
    to: string,
    tokenId: number,
    amount: number,
    data: string,
    gasSettings?: GasSettings
  ): Promise<void> {
    const myAddress = await this.ethersSigner.getAddress();
    let txSettings: unknown;
    if (gasSettings?.gasPrice) {
      txSettings = {
        gasPrice: gasSettings?.gasPrice,
      };
    } else {
      const { maxPriorityFeePerGas: _maxPriorityFeePerGas, maxFeePerGas: _maxFeePerGas } =
        getFeeSettingsBasedOnEnvironment(gasSettings?.maxPriorityFeePerGas, gasSettings?.maxFeePerGas);
      txSettings = {
        maxPriorityFeePerGas: _maxPriorityFeePerGas,
        maxFeePerGas: _maxFeePerGas,
      };
    }
    const tx = await this.contract.safeTransferFrom(myAddress, to, tokenId, amount, data, txSettings);
    await this.ethersProvider.waitForTransaction(tx.hash);
  }

  async balanceOf(owner: string, tokenId: number) {
    return await this.contract.balanceOf.staticCall(owner, tokenId);
  }

  async balanceOfBatch(owners: string[], tokenIds: number[]) {
    return await this.contract.balanceOfBatch(owners, tokenIds);
  }

  async burn(owner: string, tokenId: number, amount: number, gasSettings?: GasSettings) {
    let txSettings: unknown;
    if (gasSettings?.gasPrice) {
      txSettings = {
        gasPrice: gasSettings?.gasPrice,
      };
    } else {
      const { maxPriorityFeePerGas: _maxPriorityFeePerGas, maxFeePerGas: _maxFeePerGas } =
        getFeeSettingsBasedOnEnvironment(gasSettings?.maxPriorityFeePerGas, gasSettings?.maxFeePerGas);
      txSettings = {
        maxPriorityFeePerGas: _maxPriorityFeePerGas,
        maxFeePerGas: _maxFeePerGas,
      };
    }
    const tx = await this.contract.burn(owner, tokenId, amount, txSettings);
    await this.ethersProvider.waitForTransaction(tx.hash);
  }

  async burnBatch(owner: string, tokenIds: number[], amount: number[], gasSettings?: GasSettings) {
    let txSettings: unknown;
    if (gasSettings?.gasPrice) {
      txSettings = {
        gasPrice: gasSettings?.gasPrice,
      };
    } else {
      const { maxPriorityFeePerGas: _maxPriorityFeePerGas, maxFeePerGas: _maxFeePerGas } =
        getFeeSettingsBasedOnEnvironment(gasSettings?.maxPriorityFeePerGas, gasSettings?.maxFeePerGas);
      txSettings = {
        maxPriorityFeePerGas: _maxPriorityFeePerGas,
        maxFeePerGas: _maxFeePerGas,
      };
    }
    const tx = await this.contract.burnBatch(owner, tokenIds, amount, txSettings);
    await this.ethersProvider.waitForTransaction(tx.hash);
  }
}

const range = (length: number) => {
  return Array.from(Array(length).keys());
};

const parseToTokenId = (receipt: ethers.TransactionReceipt): number => {
  const eventInterface = new ethers.Interface([
    "event erc1155DataRegistered(address contractAddress, uint256 tokenId)",
  ]);
  let tokenId = 0;
  receipt.logs.forEach((log: any) => {
    // check whether topic is erc1155DataRegistered(address contractAddress, uint256 tokenId)
    if (log.topics[0] === "0xf30a336bd6229f1e88c41eeaad2c5fa73b69e4ec90773a67af474031d64fe32f") {
      const description = eventInterface.parseLog({
        topics: log.topics,
        data: log.data,
      });
      tokenId = description?.args[1].toNumber();
    }
  });
  return tokenId;
};

const parseToTokenIds = (receipt: ethers.TransactionReceipt): number[] => {
  const eventInterface = new ethers.Interface([
    "event erc1155DataRegistered(address contractAddress, uint256 tokenId)",
  ]);
  const tokenIds: number[] = [];
  receipt.logs.forEach((log: any) => {
    // check whether topic is erc1155DataRegistered(address contractAddress, uint256 tokenId)
    if (log.topics[0] === "0xf30a336bd6229f1e88c41eeaad2c5fa73b69e4ec90773a67af474031d64fe32f") {
      const description = eventInterface.parseLog({
        topics: log.topics,
        data: log.data,
      });
      tokenIds.push(description?.args[1].toNumber());
    }
  });
  return tokenIds;
};
