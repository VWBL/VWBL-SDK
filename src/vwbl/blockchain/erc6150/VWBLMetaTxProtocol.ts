import { ethers } from "ethers";

import vwblERC6150 from "../../../contract/VWBLERC6150ERC2981.json";
import vwblERC6150Ipfs from "../../../contract/VWBLERC6150ERC2981ForMetadata.json";
import { getChainId } from "../../../util/getChainIdHelper";
import { GrantViewPermissionMetaTxParam, MintForIPFSMetaTxParam, MintMetaTxParam } from "../../types";
import { VWBLNFTMetaTx } from "../erc721/VWBLMetaTxProtocol";
import { parseToTokenId } from "../erc721/VWBLProtocolEthers";

export class VWBLERC6150MetaTxEthers extends VWBLNFTMetaTx {
  private erc6150Address: string;

  constructor(
    biconomyAPIKey: string,
    walletProvider: ethers.BrowserProvider | ethers.Wallet,
    address: string,
    forwarderAddress: string
  ) {
    super(biconomyAPIKey, walletProvider, address, forwarderAddress);
    this.erc6150Address = address;
  }

  override async mintToken(mintParam: MintMetaTxParam): Promise<number> {
    const myAddress = await this.ethersSigner.getAddress();
    const vwblMetaTxContract = new ethers.Contract(this.erc6150Address, vwblERC6150.abi, this.ethersSigner);
    const { data } = await vwblMetaTxContract.mint.populateTransaction(
      mintParam.decryptUrl,
      mintParam.parentId,
      mintParam.feeNumerator,
      mintParam.documentId
    );
    const chainId = await getChainId(this.ethersSigner.provider!);
    const { txParam, sig, domainSeparator, signatureType } = await this.constructMetaTx(myAddress, data, chainId);
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

  override async mintTokenForIPFS(mintForIPFSParam: MintForIPFSMetaTxParam): Promise<number> {
    const myAddress = await this.ethersSigner.getAddress();
    const vwblMetaTxContract = new ethers.Contract(this.erc6150Address, vwblERC6150Ipfs.abi, this.ethersSigner);
    const { data } = await vwblMetaTxContract.mint.populateTransaction(
      mintForIPFSParam.metadataUrl,
      mintForIPFSParam.parentId,
      mintForIPFSParam.decryptUrl,
      mintForIPFSParam.feeNumerator,
      mintForIPFSParam.documentId
    );
    const chainId = await getChainId(this.ethersSigner.provider!);

    const { txParam, sig, domainSeparator, signatureType } = await this.constructMetaTx(myAddress, data, chainId);
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

  override async grantViewPermission(grantParam: GrantViewPermissionMetaTxParam): Promise<void> {
    const myAddress = await this.ethersSigner.getAddress();
    const vwblMetaTxContract = new ethers.Contract(this.erc6150Address, vwblERC6150Ipfs.abi, this.ethersSigner);
    const { data } = await vwblMetaTxContract.grantViewPermission.populateTransaction(
      grantParam.tokenId,
      grantParam.grantee,
      grantParam.toDir
    );
    const chainId = await getChainId(this.ethersSigner.provider!);

    const { txParam, sig, domainSeparator, signatureType } = await this.constructMetaTx(myAddress, data, chainId);
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

  async revokeDirPermission(tokenId: number, revoker: string, revokeViewPermisionApiId: string): Promise<void> {
    const myAddress = await this.ethersSigner.getAddress();
    const vwblMetaTxContract = new ethers.Contract(this.erc6150Address, vwblERC6150Ipfs.abi, this.ethersSigner);
    const { data } = await vwblMetaTxContract.revokeDirPermission.populateTransaction(tokenId, revoker);
    const chainId = await getChainId(this.ethersSigner.provider!);

    const { txParam, sig, domainSeparator, signatureType } = await this.constructMetaTx(myAddress, data, chainId);
    console.log("transaction start");
    await this.sendTransaction(txParam, sig, myAddress, domainSeparator, revokeViewPermisionApiId, signatureType);
    console.log("transaction end");
  }
}
