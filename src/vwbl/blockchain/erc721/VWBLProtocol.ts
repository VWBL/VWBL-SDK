import { Web3 } from "web3";

import vwbl from "../../../contract/VWBLERC721ERC2981.json";
import vwblIPFS from "../../../contract/VWBLERC721ERC2981ForMetadata.json";
import { getFeeSettingsBasedOnEnvironment } from "../../../util/transactionHelper";
import { GasSettings } from "../../types";

export class VWBLNFT {
  private contract: any;
  private web3: Web3;

  constructor(web3: Web3, address: string, isIpfs: boolean) {
    this.web3 = web3;
    this.contract = isIpfs ? new web3.eth.Contract(vwblIPFS.abi, address) : new web3.eth.Contract(vwbl.abi, address);
  }

  async mintToken(decryptUrl: string, feeNumerator: number, documentId: string, gasSettings?: GasSettings) {
    const myAddress = (await this.web3.eth.getAccounts())[0];
    const fee = await this.getFee();
    let txSettings: unknown;
    if (gasSettings?.gasPrice) {
      const gas = await this.contract.methods
        .mint(decryptUrl, feeNumerator, documentId)
        .estimateGas({ from: myAddress, value: fee });
      txSettings = {
        from: myAddress,
        value: fee,
        gasPrice: gasSettings?.gasPrice,
        gas,
      };
    } else {
      const { maxPriorityFeePerGas: _maxPriorityFeePerGas, maxFeePerGas: _maxFeePerGas } =
        getFeeSettingsBasedOnEnvironment(gasSettings?.maxPriorityFeePerGas, gasSettings?.maxFeePerGas);
      txSettings = {
        from: myAddress,
        value: fee,
        maxPriorityFeePerGas: _maxPriorityFeePerGas,
        maxFeePerGas: _maxFeePerGas,
      };
    }
    console.log("transaction start");
    const receipt = await this.contract.methods.mint(decryptUrl, feeNumerator, documentId).send(txSettings);
    console.log("transaction end");
    const tokenId: number = receipt.events.Transfer.returnValues.tokenId;
    return tokenId;
  }

  async mintTokenForIPFS(
    metadataUrl: string,
    decryptUrl: string,
    feeNumerator: number,
    documentId: string,
    gasSettings?: GasSettings
  ) {
    const myAddress = (await this.web3.eth.getAccounts())[0];
    const fee = await this.getFee();
    let txSettings: unknown;
    if (gasSettings?.gasPrice) {
      const gas = await this.contract.methods
        .mint(metadataUrl, decryptUrl, feeNumerator, documentId)
        .estimateGas({ from: myAddress, value: fee });
      txSettings = {
        from: myAddress,
        value: fee,
        gasPrice: gasSettings?.gasPrice,
        gas,
      };
    } else {
      const { maxPriorityFeePerGas: _maxPriorityFeePerGas, maxFeePerGas: _maxFeePerGas } =
        getFeeSettingsBasedOnEnvironment(gasSettings?.maxPriorityFeePerGas, gasSettings?.maxFeePerGas);
      txSettings = {
        from: myAddress,
        value: fee,
        maxPriorityFeePerGas: _maxPriorityFeePerGas,
        maxFeePerGas: _maxFeePerGas,
      };
    }
    console.log("transaction start");
    const receipt = await this.contract.methods
      .mint(metadataUrl, decryptUrl, feeNumerator, documentId)
      .send(txSettings);
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

  async approve(operator: string, tokenId: number, gasSettings?: GasSettings): Promise<void> {
    const myAddress = (await this.web3.eth.getAccounts())[0];
    let txSettings: unknown;
    if (gasSettings?.gasPrice) {
      const gas = await this.contract.methods.approve(operator, tokenId).estimateGas({ from: myAddress });
      txSettings = {
        from: myAddress,
        gasPrice: gasSettings?.gasPrice,
        gas,
      };
    } else {
      const { maxPriorityFeePerGas: _maxPriorityFeePerGas, maxFeePerGas: _maxFeePerGas } =
        getFeeSettingsBasedOnEnvironment(gasSettings?.maxPriorityFeePerGas, gasSettings?.maxFeePerGas);
      txSettings = {
        from: myAddress,
        maxPriorityFeePerGas: _maxPriorityFeePerGas,
        maxFeePerGas: _maxFeePerGas,
      };
    }
    await this.contract.methods.approve(operator, tokenId).send(txSettings);
  }

  async getApproved(tokenId: number): Promise<string> {
    return await this.contract.methods.getApproved(tokenId).call();
  }

  async setApprovalForAll(operator: string, gasSettings?: GasSettings): Promise<void> {
    const myAddress = (await this.web3.eth.getAccounts())[0];
    let txSettings: unknown;
    if (gasSettings?.gasPrice) {
      const gas = await this.contract.methods.setApprovalForAll(operator, true).estimateGas({ from: myAddress });
      txSettings = {
        from: myAddress,
        gasPrice: gasSettings?.gasPrice,
        gas,
      };
    } else {
      const { maxPriorityFeePerGas: _maxPriorityFeePerGas, maxFeePerGas: _maxFeePerGas } =
        getFeeSettingsBasedOnEnvironment(gasSettings?.maxPriorityFeePerGas, gasSettings?.maxFeePerGas);
      txSettings = {
        from: myAddress,
        maxPriorityFeePerGas: _maxPriorityFeePerGas,
        maxFeePerGas: _maxFeePerGas,
      };
    }
    await this.contract.methods.setApprovalForAll(operator, true).send(txSettings);
  }

  async isApprovedForAll(owner: string, operator: string): Promise<boolean> {
    return await this.contract.methods.isApprovedForAll(owner, operator).call();
  }

  async safeTransfer(to: string, tokenId: number, gasSettings?: GasSettings): Promise<void> {
    const myAddress = (await this.web3.eth.getAccounts())[0];
    let txSettings: unknown;
    if (gasSettings?.gasPrice) {
      const gas = await this.contract.methods.safeTransferFrom(myAddress, to, tokenId).estimateGas({ from: myAddress });
      txSettings = {
        from: myAddress,
        gasPrice: gasSettings?.gasPrice,
        gas,
      };
    } else {
      const { maxPriorityFeePerGas: _maxPriorityFeePerGas, maxFeePerGas: _maxFeePerGas } =
        getFeeSettingsBasedOnEnvironment(gasSettings?.maxPriorityFeePerGas, gasSettings?.maxFeePerGas);
      txSettings = {
        from: myAddress,
        maxPriorityFeePerGas: _maxPriorityFeePerGas,
        maxFeePerGas: _maxFeePerGas,
      };
    }
    await this.contract.methods.safeTransferFrom(myAddress, to, tokenId).send(txSettings);
  }
}

const range = (length: number) => {
  return Array.from(Array(length).keys());
};
