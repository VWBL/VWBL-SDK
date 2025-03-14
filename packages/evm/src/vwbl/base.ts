import { ethers } from "ethers";
import { Web3 } from "web3";

import { VWBLApi } from "./api";
import { signToProtocol } from "./blockchain";
import { BaseConstructorProps } from "./types";
import { CoreConstructorProps, VWBLCore } from "vwbl-core";
const MESSAGE_TO_BE_SIGNED = "Hello VWBL";

export class VWBLBase extends VWBLCore {
  protected api: VWBLApi;
  public signMsg?: string;
  public signature?: string;
  public contractAddress: string;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(props: BaseConstructorProps) {
    super(props as CoreConstructorProps);
    
    const { contractAddress, vwblNetworkUrl } = props;
    this.contractAddress = contractAddress;
    this.api = new VWBLApi(vwblNetworkUrl);
  }

  /**
   * Sign to VWBL
   *
   * @remarks
   * You need to call this method before you send a transaction（eg. mint NFT, decrypt NFT data）
   */
  protected _sign = async (signer: Web3 | ethers.Signer, targetContract?: string) => {
    //TODO: signerがWeb3 instanceかどうかを判断するロジックを切り出さないといけない signer instanceof Web3では意図した通り動かなかったため
    const castedSigner = signer as any; // eslint-disable-line @typescript-eslint/no-explicit-any
    // eslint-disable-next-line
    const chainId = castedSigner.hasOwnProperty("eth")
      ? await castedSigner.eth.getChainId()
      : await castedSigner.getChainId();
    const address = await this._getAddressBySigner(signer);
    const contractAddress = targetContract || this.contractAddress;
    const signMessage = await this.api
      .getSignMessage(contractAddress, chainId, address)
      .catch(() => MESSAGE_TO_BE_SIGNED);
    if (this.signMsg === signMessage) return;
    this.signMsg = signMessage;
    this.signature = await signToProtocol(signer, signMessage);
    console.log("signed");
  };

  protected _getAddressBySigner = async (signer: Web3 | ethers.Signer): Promise<string> => {
    //TODO: signerがWeb3 instanceかどうかを判断するロジックを切り出さないといけない signer instanceof Web3では意図した通り動かなかったため
    const castedSigner = signer as any; // eslint-disable-line @typescript-eslint/no-explicit-any
    // eslint-disable-next-line
    return castedSigner.hasOwnProperty("eth")
      ? (await castedSigner.eth.getAccounts())[0]
      : await castedSigner.getAddress();
  };

  /**
   * Set key to VWBL Network
   *
   * @param documentId - DocumentId
   * @param chainId - The indentifier of blockchain
   * @param key - The key generated by {@link VWBL.createKey}
   * @param address address
   * @param hasNonce
   * @param autoMigration
   *
   */
  protected _setKey = async (
    documentId: string,
    chainId: number,
    key: string,
    address?: string,
    hasNonce?: boolean, // eslint-disable-line @typescript-eslint/no-unused-vars
    autoMigration?: boolean // eslint-disable-line @typescript-eslint/no-unused-vars
  ): Promise<void> => {
    if (!this.signature) {
      throw "please sign first";
    }
    await this.api.setKey(documentId, chainId, key, this.signature, address);
  };

  /**
   * Set key to VWBL Network
   *
   * @param documentId - DocumentId
   * @param chainId - The indentifier of blockchain
   * @param address address
   *
   */
  protected _getKey = async (documentId: string, chainId: number, address?: string): Promise<string> => {
    if (!this.signature) {
      throw "please sign first";
    }
    return await this.api.getKey(documentId, chainId, this.signature, address);
  };
}
