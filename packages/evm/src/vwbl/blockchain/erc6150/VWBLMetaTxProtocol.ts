import { ethers } from "ethers";

import vwblERC6150 from "../../../contract/VWBLERC6150ERC2981.json";
import vwblERC6150Ipfs from "../../../contract/VWBLERC6150ERC2981ForMetadata.json";
import { GrantViewPermissionTxParam, MintForIPFSTxParam, MintTxParam } from "../../types";
import { VWBLNFTMetaTx } from "../erc721/VWBLMetaTxProtocol";
import { parseToTokenId } from "../erc721/VWBLProtocolEthers";

export class VWBLERC6150MetaTxEthers extends VWBLNFTMetaTx {
  private erc6150Address: string;

  constructor(
    walletProvider: ethers.providers.Web3Provider | ethers.Wallet,
    address: string,
    forwarderAddress: string,
    metaTxEndpoint: string
  ) {
    super(walletProvider, address, forwarderAddress, metaTxEndpoint);
    this.erc6150Address = address;
  }

  override async mintToken(mintParam: MintTxParam): Promise<number> {
    const myAddress = await this.ethersSigner.getAddress();
    const vwblMetaTxContract = new ethers.Contract(this.erc6150Address, vwblERC6150.abi, this.ethersSigner);
    const { data } = await vwblMetaTxContract.populateTransaction.mint(
      mintParam.decryptUrl,
      mintParam.parentId,
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
      signatureType
    );
    console.log("transaction end");
    const tokenId = parseToTokenId(receipt);
    return tokenId;
  }

  override async mintTokenForIPFS(mintForIPFSParam: MintForIPFSTxParam): Promise<number> {
    const myAddress = await this.ethersSigner.getAddress();
    const vwblMetaTxContract = new ethers.Contract(this.erc6150Address, vwblERC6150Ipfs.abi, this.ethersSigner);
    const { data } = await vwblMetaTxContract.populateTransaction.mint(
      mintForIPFSParam.metadataUrl,
      mintForIPFSParam.parentId,
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
      signatureType
    );
    console.log("transaction end");
    const tokenId = parseToTokenId(receipt);
    return tokenId;
  }

  override async grantViewPermission(grantParam: GrantViewPermissionTxParam): Promise<void> {
    const myAddress = await this.ethersSigner.getAddress();
    const vwblMetaTxContract = new ethers.Contract(this.erc6150Address, vwblERC6150Ipfs.abi, this.ethersSigner);
    const { data } = await vwblMetaTxContract.populateTransaction.grantViewPermission(
      grantParam.tokenId,
      grantParam.grantee,
      grantParam.toDir
    );
    const chainId = await this.ethersSigner.getChainId();
    const { txParam, sig, domainSeparator, signatureType } = await this.constructMetaTx(myAddress, data!, chainId);
    console.log("transaction start");
    await this.sendTransaction(
      txParam,
      sig,
      myAddress,
      domainSeparator,
      signatureType
    );
    console.log("transaction end");
  }

  async revokeDirPermission(tokenId: number, revoker: string): Promise<void> {
    const myAddress = await this.ethersSigner.getAddress();
    const vwblMetaTxContract = new ethers.Contract(this.erc6150Address, vwblERC6150Ipfs.abi, this.ethersSigner);
    const { data } = await vwblMetaTxContract.populateTransaction.revokeDirPermission(tokenId, revoker);
    const chainId = await this.ethersSigner.getChainId();
    const { txParam, sig, domainSeparator, signatureType } = await this.constructMetaTx(myAddress, data!, chainId);
    console.log("transaction start");
    await this.sendTransaction(txParam, sig, myAddress, domainSeparator, signatureType);
    console.log("transaction end");
  }
}
