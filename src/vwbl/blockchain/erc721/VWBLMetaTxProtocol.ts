import axios from "axios";
import { ethers } from "ethers";

import forwarder from "../../../contract/Forwarder.json";
import vwblMetaTx from "../../../contract/VWBLMetaTx.json";
import vwblMetaTxIpfs from "../../../contract/VWBLMetaTxSupportIPFS.json";
import {
  buildForwardTxRequest,
  getDataToSignForEIP712,
  getDomainSeparator,
  TxParam,
} from "../../../util/biconomyHelper";

export class VWBLNFTMetaTx {
  private walletProvider: ethers.providers.Web3Provider;
  private nftAddress: string;
  private forwarderAddress: string;
  private biconomyAPIKey: string;

  constructor(
    biconomyAPIKey: string,
    walletProvider: ethers.providers.Web3Provider,
    nftAddress: string,
    forwarderAddress: string
  ) {
    this.biconomyAPIKey = biconomyAPIKey;
    this.walletProvider = walletProvider;
    this.nftAddress = nftAddress;
    this.forwarderAddress = forwarderAddress;
  }

  async mintToken(
    decryptUrl: string,
    royaltiesPercentage: number,
    documentId: string,
    mintApiId: string
  ): Promise<number> {
    const walletSigner = this.walletProvider.getSigner();
    const myAddress = await walletSigner.getAddress();
    const vwblMetaTxContract = new ethers.Contract(this.nftAddress, vwblMetaTx.abi, walletSigner);
    const { data } = await vwblMetaTxContract.populateTransaction.mint(decryptUrl, royaltiesPercentage, documentId);
    const chainId = await walletSigner.getChainId();
    const { txParam, sig, domainSeparator } = await this.constructMetaTx(myAddress, data!, chainId);
    console.log("transaction start");
    const receipt = await this.sendTransaction(txParam, sig, myAddress, domainSeparator, mintApiId, "EIP712_SIGN");
    console.log("transaction end");
    const tokenId = parseToTokenId(receipt);
    return tokenId;
  }

  async mintTokenForIPFS(
    metadataUrl: string,
    decryptUrl: string,
    royaltiesPercentage: number,
    documentId: string,
    mintApiId: string
  ): Promise<number> {
    const walletSigner = this.walletProvider.getSigner();
    const myAddress = await walletSigner.getAddress();
    const vwblMetaTxContract = new ethers.Contract(this.nftAddress, vwblMetaTxIpfs.abi, walletSigner);
    const { data } = await vwblMetaTxContract.populateTransaction.mint(
      metadataUrl,
      decryptUrl,
      royaltiesPercentage,
      documentId
    );
    const chainId = await walletSigner.getChainId();
    const { txParam, sig, domainSeparator } = await this.constructMetaTx(myAddress, data!, chainId);
    console.log("transaction start");
    const receipt = await this.sendTransaction(txParam, sig, myAddress, domainSeparator, mintApiId, "EIP712_SIGN");
    console.log("transaction end");
    const tokenId = parseToTokenId(receipt);
    return tokenId;
  }

  async getOwnTokenIds() {
    const walletSigner = this.walletProvider.getSigner();
    const myAddress = await walletSigner.getAddress();
    const vwblMetaTxContract = new ethers.Contract(this.nftAddress, vwblMetaTxIpfs.abi, walletSigner);
    const balance = await vwblMetaTxContract.callStatic.balanceOf(myAddress);
    return await Promise.all(
      range(Number.parseInt(balance)).map(async (i) => {
        const ownTokenId = await vwblMetaTxContract.callStatic.tokenOfOwnerByIndex(myAddress, i);
        return Number.parseInt(ownTokenId);
      })
    );
  }

  async getTokenByMinter(address: string) {
    const vwblMetaTxContract = new ethers.Contract(
      this.nftAddress,
      vwblMetaTxIpfs.abi,
      this.walletProvider.getSigner()
    );
    return await vwblMetaTxContract.callStatic.getTokenByMinter(address);
  }

  async getMetadataUrl(tokenId: number) {
    const vwblMetaTxContract = new ethers.Contract(
      this.nftAddress,
      vwblMetaTxIpfs.abi,
      this.walletProvider.getSigner()
    );
    return await vwblMetaTxContract.callStatic.tokenURI(tokenId);
  }

  async getOwner(tokenId: number) {
    const vwblMetaTxContract = new ethers.Contract(
      this.nftAddress,
      vwblMetaTxIpfs.abi,
      this.walletProvider.getSigner()
    );
    return await vwblMetaTxContract.callStatic.ownerOf(tokenId);
  }

  async getMinter(tokenId: number) {
    const vwblMetaTxContract = new ethers.Contract(
      this.nftAddress,
      vwblMetaTxIpfs.abi,
      this.walletProvider.getSigner()
    );
    return await vwblMetaTxContract.callStatic.getMinter(tokenId);
  }

  async isOwnerOf(tokenId: number) {
    const walletSigner = this.walletProvider.getSigner();
    const myAddress = await walletSigner.getAddress();
    const owner = await this.getOwner(tokenId);
    return myAddress === owner;
  }

  async isMinterOf(tokenId: number) {
    const walletSigner = this.walletProvider.getSigner();
    const myAddress = await walletSigner.getAddress();
    const minter = await this.getMinter(tokenId);
    return myAddress === minter;
  }

  async getFee() {
    const vwblMetaTxContract = new ethers.Contract(
      this.nftAddress,
      vwblMetaTxIpfs.abi,
      this.walletProvider.getSigner()
    );
    return await vwblMetaTxContract.callStatic.getFee();
  }

  async getTokenInfo(tokenId: number) {
    const vwblMetaTxContract = new ethers.Contract(
      this.nftAddress,
      vwblMetaTxIpfs.abi,
      this.walletProvider.getSigner()
    );
    return await vwblMetaTxContract.callStatic.tokenIdToTokenInfo(tokenId);
  }

  async approve(operator: string, tokenId: number, approveApiId: string): Promise<void> {
    const walletSigner = this.walletProvider.getSigner();
    const myAddress = await walletSigner.getAddress();
    const vwblMetaTxContract = new ethers.Contract(this.nftAddress, vwblMetaTxIpfs.abi, walletSigner);
    const { data } = await vwblMetaTxContract.populateTransaction.approve(operator, tokenId);
    const chainId = await walletSigner.getChainId();
    const { txParam, sig, domainSeparator } = await this.constructMetaTx(myAddress, data!, chainId);
    console.log("transaction start");
    await this.sendTransaction(txParam, sig, myAddress, domainSeparator, approveApiId, "EIP712_SIGN");
    console.log("transaction end");
  }

  async getApproved(tokenId: number): Promise<string> {
    const vwblMetaTxContract = new ethers.Contract(
      this.nftAddress,
      vwblMetaTxIpfs.abi,
      this.walletProvider.getSigner()
    );
    return await vwblMetaTxContract.callStatic.getApproved(tokenId);
  }

  async setApprovalForAll(operator: string, setApprovalForAllApiId: string): Promise<void> {
    const walletSigner = this.walletProvider.getSigner();
    const myAddress = await walletSigner.getAddress();
    const vwblMetaTxContract = new ethers.Contract(this.nftAddress, vwblMetaTxIpfs.abi, walletSigner);
    const { data } = await vwblMetaTxContract.populateTransaction.setApprovalForAll(operator);
    const chainId = await walletSigner.getChainId();
    const { txParam, sig, domainSeparator } = await this.constructMetaTx(myAddress, data!, chainId);
    console.log("transaction start");
    await this.sendTransaction(txParam, sig, myAddress, domainSeparator, setApprovalForAllApiId, "EIP712_SIGN");
    console.log("transaction end");
  }

  async isApprovedForAll(owner: string, operator: string): Promise<boolean> {
    const vwblMetaTxContract = new ethers.Contract(
      this.nftAddress,
      vwblMetaTxIpfs.abi,
      this.walletProvider.getSigner()
    );
    return await vwblMetaTxContract.callStatic.isApprovedForAll(owner, operator);
  }

  async safeTransfer(to: string, tokenId: number, safeTransferFromApiId: string): Promise<void> {
    const walletSigner = this.walletProvider.getSigner();
    const myAddress = await walletSigner.getAddress();
    const vwblMetaTxContract = new ethers.Contract(this.nftAddress, vwblMetaTxIpfs.abi, walletSigner);
    const { data } = await vwblMetaTxContract.populateTransaction.safeTransferFrom(myAddress, to, tokenId);
    const chainId = await walletSigner.getChainId();
    const { txParam, sig, domainSeparator } = await this.constructMetaTx(myAddress, data!, chainId);
    console.log("transaction start");
    await this.sendTransaction(txParam, sig, myAddress, domainSeparator, safeTransferFromApiId, "EIP712_SIGN");
    console.log("transaction end");
  }

  private async constructMetaTx(myAddress: string, data: string, chainId: number) {
    const gasLimit = await this.walletProvider.estimateGas({
      to: this.nftAddress,
      from: myAddress,
      data,
    });

    const forwarderContract = new ethers.Contract(
      this.forwarderAddress,
      forwarder.abi,
      this.walletProvider.getSigner()
    );
    const batchNonce = await forwarderContract.getNonce(myAddress, 0);
    const txParam: TxParam = buildForwardTxRequest(
      myAddress,
      this.nftAddress,
      Number(gasLimit.toNumber().toString()),
      batchNonce,
      data
    );
    const domainSeparator = getDomainSeparator(this.forwarderAddress, chainId);
    const dataToSign = getDataToSignForEIP712(txParam, this.forwarderAddress, chainId);
    const sig = await this.walletProvider.send("eth_signTypedData_v3", [myAddress, dataToSign]);

    return { txParam, sig, domainSeparator };
  }

  private async sendTransaction(
    request: TxParam,
    sig: any,
    myAddress: string,
    domainSeparator: string,
    methodApiId: string,
    signatureType: string
  ): Promise<ethers.providers.TransactionReceipt> {
    const params = [request, domainSeparator, sig];

    try {
      const headers = {
        "x-api-key": this.biconomyAPIKey,
        "content-Type": "application/json;charset=utf-8",
      };
      const { data } = await axios.post(
        `https://api.biconomy.io/api/v2/meta-tx/native`,
        {
          to: this.nftAddress,
          apiId: methodApiId,
          params: params,
          from: myAddress,
          signatureType: signatureType,
        },
        { headers: headers }
      );
      console.log("post meta tx resp", data);
      const receipt = await this.walletProvider.waitForTransaction(data.txHash);
      console.log("confirmed:", data.txHash);
      return receipt;
    } catch (error) {
      throw new Error("post meta tx error");
    }
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
