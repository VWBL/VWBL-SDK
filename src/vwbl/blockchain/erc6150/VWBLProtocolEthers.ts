import { ethers } from "ethers";

import vwblERC6150 from "../../../contract/VWBLERC6150ERC2981.json";
import vwblERC6150IPFS from "../../../contract/VWBLERC6150ERC2981ForMetadata.json";
import { getFeeSettingsBasedOnEnvironment } from "../../../util/transactionHelper";
import { GasSettings, GrantViewPermissionTxParam, MintForIPFSTxParam, MintTxParam } from "../../types";
import { parseToTokenId, VWBLNFTEthers } from "../erc721/VWBLProtocolEthers";

export class VWBLERC6150Ethers extends VWBLNFTEthers {
  private erc6150Contract: ethers.Contract;

  constructor(
    address: string,
    isIpfs: boolean,
    ethersProvider: ethers.providers.BaseProvider,
    ethersSigner: ethers.Signer
  ) {
    super(address, isIpfs, ethersProvider, ethersSigner);
    this.erc6150Contract = isIpfs
      ? new ethers.Contract(address, vwblERC6150IPFS.abi, ethersSigner)
      : new ethers.Contract(address, vwblERC6150.abi, ethersSigner);
  }

  override async mintToken(mintParam: MintTxParam): Promise<number> {
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
    const tx = await this.erc6150Contract.mint(
      mintParam.decryptUrl,
      mintParam.parentId,
      mintParam.feeNumerator,
      mintParam.documentId,
      txSettings
    );
    const receipt = await this.ethersProvider.waitForTransaction(tx.hash);
    console.log("transaction end");
    const tokenId = parseToTokenId(receipt);
    return tokenId;
  }

  override async mintTokenForIPFS(mintForIPFSParam: MintForIPFSTxParam): Promise<number> {
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
    const tx = await this.erc6150Contract.mint(
      mintForIPFSParam.metadataUrl,
      mintForIPFSParam.parentId,
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

  override async grantViewPermission(grantParam: GrantViewPermissionTxParam): Promise<void> {
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
    const tx = await this.erc6150Contract
      .grantViewPermission(grantParam.tokenId, grantParam.grantee, grantParam.toDir)
      .send(txSettings);
    await this.ethersProvider.waitForTransaction(tx.hash);
  }

  async revokeDirPermission(tokenId: number, revoker: string, gasSettings: GasSettings): Promise<void> {
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
    const tx = await this.erc6150Contract.revokeDirPermission(tokenId, revoker).send(txSettings);
    await this.ethersProvider.waitForTransaction(tx.hash);
  }
}
