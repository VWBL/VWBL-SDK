import axios from "axios";
import { ethers } from "ethers";

import forwarder from "../../../contract/Forwarder.json";
import vwblMetaTx from "../../../contract/VWBLMetaTx.json";
import vwblMetaTxIpfs from "../../../contract/VWBLMetaTxSupportIPFS.json";
import {
  buildForwardTxRequest,
  getDataToSignForEIP712,
  getDataToSignForPersonalSign,
  getDomainSeparator,
  TxParam,
} from "../../../util/biconomyHelper";
import { GrantViewPermissionMetaTxParam, MintForIPFSMetaTxParam, MintMetaTxParam } from "../../types";

export class VWBLNFTMetaTx {
  private walletProvider: ethers.providers.Web3Provider | ethers.Wallet;
  protected ethersSigner: ethers.Signer;
  private nftAddress: string;
  private forwarderAddress: string;
  private biconomyAPIKey: string;

  constructor(
    biconomyAPIKey: string,
    walletProvider: ethers.providers.Web3Provider | ethers.Wallet,
    nftAddress: string,
    forwarderAddress: string
  ) {
    this.biconomyAPIKey = biconomyAPIKey;
    this.walletProvider = walletProvider;
    this.ethersSigner = isWeb3Provider(walletProvider as IWeb3Provider)
      ? (walletProvider as IWeb3Provider).getSigner()
      : (walletProvider as ethers.Wallet);
    this.nftAddress = nftAddress;
    this.forwarderAddress = forwarderAddress;
  }

  async mintToken(mintParam: MintMetaTxParam): Promise<number> {
    const myAddress = await this.ethersSigner.getAddress();
    const vwblMetaTxContract = new ethers.Contract(this.nftAddress, vwblMetaTx.abi, this.ethersSigner);
    const { data } = await vwblMetaTxContract.populateTransaction.mint(
      mintParam.decryptUrl,
      mintParam.feeNumerator,
      mintParam.documentId
    );
    const chainId = await this.ethersSigner.getChainId();
    const { txParam, sig, domainSeparator, signatureType } = await this.constructMetaTx(myAddress, data!, chainId);
    console.log("transaction start");
    const receipt = await this.sendTransaction(
      txParam,
      sig,
      myAddress,
      domainSeparator,
      mintParam.mintApiId,
      signatureType
    );
    console.log("transaction end");
    const tokenId = parseToTokenId(receipt);
    return tokenId;
  }

  async mintTokenForIPFS(mintForIPFSParam: MintForIPFSMetaTxParam): Promise<number> {
    const myAddress = await this.ethersSigner.getAddress();
    const vwblMetaTxContract = new ethers.Contract(this.nftAddress, vwblMetaTxIpfs.abi, this.ethersSigner);
    const { data } = await vwblMetaTxContract.populateTransaction.mint(
      mintForIPFSParam.metadataUrl,
      mintForIPFSParam.decryptUrl,
      mintForIPFSParam.feeNumerator,
      mintForIPFSParam.documentId
    );
    const chainId = await this.ethersSigner.getChainId();
    const { txParam, sig, domainSeparator, signatureType } = await this.constructMetaTx(myAddress, data!, chainId);
    console.log("transaction start");
    const receipt = await this.sendTransaction(
      txParam,
      sig,
      myAddress,
      domainSeparator,
      mintForIPFSParam.mintApiId,
      signatureType
    );
    console.log("transaction end");
    const tokenId = parseToTokenId(receipt);
    return tokenId;
  }

  async getOwnTokenIds() {
    const myAddress = await this.ethersSigner.getAddress();
    const vwblMetaTxContract = new ethers.Contract(this.nftAddress, vwblMetaTxIpfs.abi, this.ethersSigner);
    const balance = await vwblMetaTxContract.callStatic.balanceOf(myAddress);
    return await Promise.all(
      range(Number.parseInt(balance)).map(async (i) => {
        const ownTokenId = await vwblMetaTxContract.callStatic.tokenOfOwnerByIndex(myAddress, i);
        return Number.parseInt(ownTokenId);
      })
    );
  }

  async getTokenByMinter(address: string) {
    const vwblMetaTxContract = new ethers.Contract(this.nftAddress, vwblMetaTxIpfs.abi, this.ethersSigner);
    return await vwblMetaTxContract.callStatic.getTokenByMinter(address);
  }

  async getMetadataUrl(tokenId: number) {
    const vwblMetaTxContract = new ethers.Contract(this.nftAddress, vwblMetaTxIpfs.abi, this.ethersSigner);
    return await vwblMetaTxContract.callStatic.tokenURI(tokenId);
  }

  async getOwner(tokenId: number) {
    const vwblMetaTxContract = new ethers.Contract(this.nftAddress, vwblMetaTxIpfs.abi, this.ethersSigner);
    return await vwblMetaTxContract.callStatic.ownerOf(tokenId);
  }

  async getMinter(tokenId: number) {
    const vwblMetaTxContract = new ethers.Contract(this.nftAddress, vwblMetaTxIpfs.abi, this.ethersSigner);
    return await vwblMetaTxContract.callStatic.getMinter(tokenId);
  }

  async checkViewPermission(tokenId: number, user: string) {
    const vwblMetaTxContract = new ethers.Contract(this.nftAddress, vwblMetaTxIpfs.abi, this.ethersSigner);
    return await vwblMetaTxContract.callStatic.checkViewPermission(tokenId, user);
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
    const vwblMetaTxContract = new ethers.Contract(this.nftAddress, vwblMetaTxIpfs.abi, this.ethersSigner);
    return await vwblMetaTxContract.callStatic.getFee();
  }

  async getTokenInfo(tokenId: number) {
    const vwblMetaTxContract = new ethers.Contract(this.nftAddress, vwblMetaTxIpfs.abi, this.ethersSigner);
    return await vwblMetaTxContract.callStatic.tokenIdToTokenInfo(tokenId);
  }

  async approve(operator: string, tokenId: number, approveApiId: string): Promise<void> {
    const myAddress = await this.ethersSigner.getAddress();
    const vwblMetaTxContract = new ethers.Contract(this.nftAddress, vwblMetaTxIpfs.abi, this.ethersSigner);
    const { data } = await vwblMetaTxContract.populateTransaction.approve(operator, tokenId);
    const chainId = await this.ethersSigner.getChainId();
    const { txParam, sig, domainSeparator, signatureType } = await this.constructMetaTx(myAddress, data!, chainId);
    console.log("transaction start");
    await this.sendTransaction(txParam, sig, myAddress, domainSeparator, approveApiId, signatureType);
    console.log("transaction end");
  }

  async getApproved(tokenId: number): Promise<string> {
    const vwblMetaTxContract = new ethers.Contract(this.nftAddress, vwblMetaTxIpfs.abi, this.ethersSigner);
    return await vwblMetaTxContract.callStatic.getApproved(tokenId);
  }

  async setApprovalForAll(operator: string, setApprovalForAllApiId: string): Promise<void> {
    const myAddress = await this.ethersSigner.getAddress();
    const vwblMetaTxContract = new ethers.Contract(this.nftAddress, vwblMetaTxIpfs.abi, this.ethersSigner);
    const { data } = await vwblMetaTxContract.populateTransaction.setApprovalForAll(operator);
    const chainId = await this.ethersSigner.getChainId();
    const { txParam, sig, domainSeparator, signatureType } = await this.constructMetaTx(myAddress, data!, chainId);
    console.log("transaction start");
    await this.sendTransaction(txParam, sig, myAddress, domainSeparator, setApprovalForAllApiId, signatureType);
    console.log("transaction end");
  }

  async isApprovedForAll(owner: string, operator: string): Promise<boolean> {
    const vwblMetaTxContract = new ethers.Contract(this.nftAddress, vwblMetaTxIpfs.abi, this.ethersSigner);
    return await vwblMetaTxContract.callStatic.isApprovedForAll(owner, operator);
  }

  async safeTransfer(to: string, tokenId: number, safeTransferFromApiId: string): Promise<void> {
    const myAddress = await this.ethersSigner.getAddress();
    const vwblMetaTxContract = new ethers.Contract(this.nftAddress, vwblMetaTxIpfs.abi, this.ethersSigner);
    const { data } = await vwblMetaTxContract.populateTransaction.safeTransferFrom(myAddress, to, tokenId);
    const chainId = await this.ethersSigner.getChainId();
    const { txParam, sig, domainSeparator, signatureType } = await this.constructMetaTx(myAddress, data!, chainId);
    console.log("transaction start");
    await this.sendTransaction(txParam, sig, myAddress, domainSeparator, safeTransferFromApiId, signatureType);
    console.log("transaction end");
  }

  async grantViewPermission(grantParam: GrantViewPermissionMetaTxParam): Promise<void> {
    const myAddress = await this.ethersSigner.getAddress();
    const vwblMetaTxContract = new ethers.Contract(this.nftAddress, vwblMetaTxIpfs.abi, this.ethersSigner);
    const { data } = await vwblMetaTxContract.populateTransaction.grantViewPermission(
      grantParam.tokenId,
      grantParam.grantee
    );
    const chainId = await this.ethersSigner.getChainId();
    const { txParam, sig, domainSeparator, signatureType } = await this.constructMetaTx(myAddress, data!, chainId);
    console.log("transaction start");
    await this.sendTransaction(
      txParam,
      sig,
      myAddress,
      domainSeparator,
      grantParam.grantViewPermissionApiId,
      signatureType
    );
    console.log("transaction end");
  }

  async revokeViewPermission(tokenId: number, revoker: string, revokeViewPermissionApiId: string): Promise<void> {
    const myAddress = await this.ethersSigner.getAddress();
    const vwblMetaTxContract = new ethers.Contract(this.nftAddress, vwblMetaTxIpfs.abi, this.ethersSigner);
    const { data } = await vwblMetaTxContract.populateTransaction.revokeViewPermission(tokenId, revoker);
    const chainId = await this.ethersSigner.getChainId();
    const { txParam, sig, domainSeparator, signatureType } = await this.constructMetaTx(myAddress, data!, chainId);
    console.log("transaction start");
    await this.sendTransaction(txParam, sig, myAddress, domainSeparator, revokeViewPermissionApiId, signatureType);
    console.log("transaction end");
  }

  protected async constructMetaTx(myAddress: string, data: string, chainId: number) {
    console.log("estimate gas start");
    const gasLimit = await this.walletProvider.estimateGas({
      to: this.nftAddress,
      from: myAddress,
      data,
    });
    console.log("estimate gas end");
    const forwarderContract = new ethers.Contract(this.forwarderAddress, forwarder.abi, this.ethersSigner);
    const batchNonce = await forwarderContract.getNonce(myAddress, 0);
    const txParam: TxParam = buildForwardTxRequest(
      myAddress,
      this.nftAddress,
      Number(gasLimit.toNumber().toString()),
      batchNonce,
      data
    );

    if (isWeb3Provider(this.walletProvider as IWeb3Provider)) {
      const domainSeparator = getDomainSeparator(this.forwarderAddress, chainId);
      const dataToSign = getDataToSignForEIP712(txParam, this.forwarderAddress, chainId);
      const sig = await (this.walletProvider as ethers.providers.Web3Provider).send("eth_signTypedData_v3", [
        myAddress,
        dataToSign,
      ]);
      const signatureType = "EIP712_SIGN";
      return { txParam, sig, domainSeparator, signatureType };
    } else {
      const hashToSign = getDataToSignForPersonalSign(txParam);
      const sig = await (this.walletProvider as ethers.Wallet).signMessage(hashToSign);
      const signatureType = "PERSONAL_SIGN";
      return { txParam, sig, signatureType };
    }
  }
  protected async sendTransaction(
    request: TxParam,
    sig: any,
    myAddress: string,
    domainSeparator: string | undefined,
    methodApiId: string,
    signatureType: string
  ): Promise<ethers.providers.TransactionReceipt> {
    try {
      const headers = {
        "x-api-key": this.biconomyAPIKey,
        "Content-Type": "application/json;charset=utf-8",
      };

      const body = {
        to: this.nftAddress,
        apiId: methodApiId,
        params: typeof domainSeparator === "undefined" ? [request, sig] : [request, domainSeparator, sig],
        from: myAddress,
        signatureType: signatureType,
      };

      const response = await axios.post(`https://api.biconomy.io/api/v2/meta-tx/native`, body, { headers: headers });
      if (response.data.error || response.status !== 200) {
        console.error("API Error:", response.data.message || "Unknown error");
        throw new Error(`post meta tx error: ${response.data.message || "Unknown error"}`);
      }

      if (!response.data.txHash) {
        throw new Error("No transaction hash returned from API");
      }

      const receipt = isWeb3Provider(this.walletProvider as IWeb3Provider)
        ? await (this.walletProvider as ethers.providers.Web3Provider).waitForTransaction(response.data.txHash)
        : await (this.walletProvider as ethers.Wallet).provider.waitForTransaction(response.data.txHash);
      console.log("Transaction confirmed, hash:", response.data.txHash);
      return receipt;
    } catch (error) {
      console.error("Error during transaction send:", error);
      throw new Error(`post meta tx error: ${error?.toString()}`);
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
      const description = eventInterface.parseLog({
        topics: log.topics,
        data: log.data,
      });
      tokenId = description.args[1].toNumber();
    }
  });
  return tokenId;
};

interface IWeb3Provider {
  getSigner(): ethers.providers.JsonRpcSigner;
}

const isWeb3Provider = (walletProvider: IWeb3Provider): walletProvider is IWeb3Provider => {
  return walletProvider.getSigner !== undefined;
};
