import { ethers } from "ethers";

import vwbl from "../../../contract/VWBLERC721ERC2981.json";
import vwblIPFS from "../../../contract/VWBLERC721ERC2981ForMetadata.json";
import { getFeeSettingsBasedOnEnvironment } from "../../../util/transactionHelper";
import { GasSettings, GrantViewPermissionTxParam, MintForIPFSTxParam, MintTxParam } from "../../types";

export class VWBLNFTEthers {
  protected ethersProvider: ethers.providers.BaseProvider;
  private ethersSigner: ethers.Signer;
  private contract: ethers.Contract;

  constructor(
    address: string,
    isIpfs: boolean,
    ethersProvider: ethers.providers.BaseProvider,
    ethersSigner: ethers.Signer
  ) {
    this.ethersProvider = ethersProvider;
    this.ethersSigner = ethersSigner;
    this.contract = isIpfs
      ? new ethers.Contract(address, vwblIPFS.abi, ethersSigner)
      : new ethers.Contract(address, vwbl.abi, ethersSigner);
  }

  async mintToken(mintParam: MintTxParam) {
    const fee = await this.getFee();
    let txSettings: unknown;
    if (mintParam.gasSettings?.gasPrice) {
      txSettings = {
        value: fee,
        gasPrice: mintParam.gasSettings?.gasPrice,
      };
    } else {
      const { maxPriorityFeePerGas: _maxPriorityFeePerGas, maxFeePerGas: _maxFeePerGas } =
        getFeeSettingsBasedOnEnvironment(
          mintParam.gasSettings?.maxPriorityFeePerGas,
          mintParam.gasSettings?.maxFeePerGas
        );
      txSettings = {
        value: fee,
        maxPriorityFeePerGas: _maxPriorityFeePerGas,
        maxFeePerGas: _maxFeePerGas,
      };
    }
    console.log("transaction start");
    const tx = await this.contract.mint(mintParam.decryptUrl, mintParam.feeNumerator, mintParam.documentId, txSettings);
    const receipt = await this.ethersProvider.waitForTransaction(tx.hash);
    console.log("transaction end");
    const tokenId = parseToTokenId(receipt);
    return tokenId;
  }

  async mintTokenForIPFS(mintForIPFSParam: MintForIPFSTxParam) {
    const fee = await this.getFee();
    let txSettings: unknown;
    if (mintForIPFSParam.gasSettings?.gasPrice) {
      txSettings = {
        value: fee,
        gasPrice: mintForIPFSParam.gasSettings?.gasPrice,
      };
    } else {
      const { maxPriorityFeePerGas: _maxPriorityFeePerGas, maxFeePerGas: _maxFeePerGas } =
        getFeeSettingsBasedOnEnvironment(
          mintForIPFSParam.gasSettings?.maxPriorityFeePerGas,
          mintForIPFSParam.gasSettings?.maxFeePerGas
        );
      txSettings = {
        value: fee,
        maxPriorityFeePerGas: _maxPriorityFeePerGas,
        maxFeePerGas: _maxFeePerGas,
      };
    }
    console.log("transaction start");
    const tx = await this.contract.mint(
      mintForIPFSParam.metadataUrl,
      mintForIPFSParam.decryptUrl,
      mintForIPFSParam.feeNumerator,
      mintForIPFSParam.documentId,
      txSettings
    );
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

  async checkViewPermission(tokenId: number, user: string) {
    return await this.contract.callStatic.checkViewPermission(tokenId, user);
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

  async isGranteeOf(tokenId: number) {
    const myAddress = await this.ethersSigner.getAddress();
    return await this.checkViewPermission(tokenId, myAddress);
  }

  async getFee() {
    return await this.contract.callStatic.getFee();
  }

  async getTokenInfo(tokenId: number) {
    return await this.contract.callStatic.tokenIdToTokenInfo(tokenId);
  }

  async approve(operator: string, tokenId: number, gasSettings?: GasSettings): Promise<void> {
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
    const tx = await this.contract.approve(operator, tokenId, txSettings);
    await this.ethersProvider.waitForTransaction(tx.hash);
  }

  async getApproved(tokenId: number): Promise<string> {
    return await this.contract.callStatic.getApproved(tokenId);
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
    return await this.contract.callStatic.isApprovedForAll(owner, operator);
  }

  async safeTransfer(to: string, tokenId: number, gasSettings?: GasSettings): Promise<void> {
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
    const tx = await this.contract.safeTransferFrom(myAddress, to, tokenId, txSettings);
    await this.ethersProvider.waitForTransaction(tx.hash);
  }

  async grantViewPermission(grantParam: GrantViewPermissionTxParam): Promise<void> {
    let txSettings: unknown;
    if (grantParam.gasSettings?.gasPrice) {
      txSettings = {
        gasPrice: grantParam.gasSettings?.gasPrice,
      };
    } else {
      const { maxPriorityFeePerGas: _maxPriorityFeePerGas, maxFeePerGas: _maxFeePerGas } =
        getFeeSettingsBasedOnEnvironment(
          grantParam.gasSettings?.maxPriorityFeePerGas,
          grantParam.gasSettings?.maxFeePerGas
        );
      txSettings = {
        maxPriorityFeePerGas: _maxPriorityFeePerGas,
        maxFeePerGas: _maxFeePerGas,
      };
    }
    const tx = await this.contract.grantViewPermission(grantParam.tokenId, grantParam.grantee, txSettings);
    await this.ethersProvider.waitForTransaction(tx.hash);
  }

  async revokeViewPermission(tokenId: number, revoker: string, gasSettings?: GasSettings): Promise<void> {
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
    const tx = await this.contract.revokeViewPermission(tokenId, revoker, txSettings);
    await this.ethersProvider.waitForTransaction(tx.hash);
  }
}

const range = (length: number) => {
  return Array.from(Array(length).keys());
};

export const parseToTokenId = (receipt: ethers.providers.TransactionReceipt): number => {
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
