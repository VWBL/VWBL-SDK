import { Web3 } from "web3";

import vwblERC6150 from "../../../contract/VWBLERC6150ERC2981.json";
import vwblERC6150IPFS from "../../../contract/VWBLERC6150ERC2981ForMetadata.json";
import { getFeeSettingsBasedOnEnvironment } from "../../../util/transactionHelper";
import { GasSettings, GrantViewPermissionTxParam, MintForIPFSTxParam, MintTxParam } from "../../types";
import { VWBLNFT } from "../erc721/VWBLProtocol";

export class VWBLERC6150Web3 extends VWBLNFT {
  private erc6150Contract: any; // eslint-disable-line

  constructor(web3: Web3, address: string, isIpfs: boolean) {
    super(web3, address, isIpfs);
    this.erc6150Contract = isIpfs
      ? new web3.eth.Contract(vwblERC6150IPFS.abi, address)
      : new web3.eth.Contract(vwblERC6150.abi, address);
  }

  override async mintToken(mintParam: MintTxParam): Promise<number> {
    const myAddress = (await this.web3.eth.getAccounts())[0];
    const fee = await this.getFee();
    let txSettings: unknown;
    if (mintParam.gasSettings?.gasPrice) {
      const gas = await this.erc6150Contract.methods
        .mint(mintParam.decryptUrl, mintParam.parentId, mintParam.feeNumerator, mintParam.documentId)
        .estimateGas({ from: myAddress, value: fee });
      txSettings = {
        from: myAddress,
        value: fee,
        gasPrice: mintParam.gasSettings?.gasPrice,
        gas,
      };
    } else {
      const { maxPriorityFeePerGas: _maxPriorityFeePerGas, maxFeePerGas: _maxFeePerGas } =
        getFeeSettingsBasedOnEnvironment(
          mintParam.gasSettings?.maxPriorityFeePerGas,
          mintParam.gasSettings?.maxFeePerGas
        );
      txSettings = {
        from: myAddress,
        value: fee,
        maxPriorityFeePerGas: _maxPriorityFeePerGas,
        maxFeePerGas: _maxFeePerGas,
      };
    }
    console.log("transaction start");
    const receipt = await this.erc6150Contract.methods
      .mint(mintParam.decryptUrl, mintParam.parentId, mintParam.feeNumerator, mintParam.documentId)
      .send(txSettings);
    console.log("transaction end");
    const tokenId: number = receipt.events.Transfer.returnValues.tokenId;
    return tokenId;
  }

  override async mintTokenForIPFS(mintForIPFSParam: MintForIPFSTxParam): Promise<number> {
    const myAddress = (await this.web3.eth.getAccounts())[0];
    const fee = await this.getFee();
    let txSettings: unknown;
    if (mintForIPFSParam.gasSettings?.gasPrice) {
      const gas = await this.erc6150Contract.methods
        .mint(
          mintForIPFSParam.metadataUrl,
          mintForIPFSParam.decryptUrl,
          mintForIPFSParam.parentId,
          mintForIPFSParam.feeNumerator,
          mintForIPFSParam.documentId
        )
        .estimateGas({ from: myAddress, value: fee });
      txSettings = {
        from: myAddress,
        value: fee,
        gasPrice: mintForIPFSParam.gasSettings?.gasPrice,
        gas,
      };
    } else {
      const { maxPriorityFeePerGas: _maxPriorityFeePerGas, maxFeePerGas: _maxFeePerGas } =
        getFeeSettingsBasedOnEnvironment(
          mintForIPFSParam.gasSettings?.maxPriorityFeePerGas,
          mintForIPFSParam.gasSettings?.maxFeePerGas
        );
      txSettings = {
        from: myAddress,
        value: fee,
        maxPriorityFeePerGas: _maxPriorityFeePerGas,
        maxFeePerGas: _maxFeePerGas,
      };
    }
    console.log("transaction start");
    const receipt = await this.erc6150Contract.methods
      .mint(
        mintForIPFSParam.metadataUrl,
        mintForIPFSParam.decryptUrl,
        mintForIPFSParam.parentId,
        mintForIPFSParam.feeNumerator,
        mintForIPFSParam.documentId
      )
      .send(txSettings);
    console.log("transaction end");
    const tokenId: number = receipt.events.Transfer.returnValues.tokenId;
    return tokenId;
  }

  override async grantViewPermission(grantParam: GrantViewPermissionTxParam): Promise<void> {
    const myAddress = (await this.web3.eth.getAccounts())[0];
    let txSettings: unknown;
    if (grantParam.gasSettings?.gasPrice) {
      const gas = await this.erc6150Contract.methods
        .grantViewPermission(grantParam.tokenId, grantParam.grantee, grantParam.toDir)
        .estimateGas({ from: myAddress });
      txSettings = {
        from: myAddress,
        gasPrice: grantParam.gasSettings?.gasPrice,
        gas,
      };
    } else {
      const { maxPriorityFeePerGas: _maxPriorityFeePerGas, maxFeePerGas: _maxFeePerGas } =
        getFeeSettingsBasedOnEnvironment(
          grantParam.gasSettings?.maxPriorityFeePerGas,
          grantParam.gasSettings?.maxFeePerGas
        );
      txSettings = {
        from: myAddress,
        maxPriorityFeePerGas: _maxPriorityFeePerGas,
        maxFeePerGas: _maxFeePerGas,
      };
    }
    await this.erc6150Contract.methods
      .grantViewPermission(grantParam.tokenId, grantParam.grantee, grantParam.toDir)
      .send(txSettings);
  }

  async revokeDirPermission(tokenId: number, revoker: string, gasSettings?: GasSettings): Promise<void> {
    const myAddress = (await this.web3.eth.getAccounts())[0];
    let txSettings: unknown;
    if (gasSettings?.gasPrice) {
      const gas = await this.erc6150Contract.methods
        .revokeDirPermission(tokenId, revoker)
        .estimateGas({ from: myAddress });
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
    await this.erc6150Contract.methods.revokeDirPermission(tokenId, revoker).send(txSettings);
  }
}
