import { ethers } from "ethers";
import Web3 from "web3";

const MESSAGE_TO_BE_SIGNED = "Hello VWBL";

interface IEthersSigner {
  signMessage(message: string | ethers.utils.Bytes): Promise<string>;
}

const isEthersSigner = (signer: IEthersSigner): signer is IEthersSigner => {
  return signer.signMessage !== undefined;
};

export const signToProtocol = async (signer: Web3 | ethers.providers.JsonRpcSigner | ethers.Wallet) => {
  if (isEthersSigner(signer as IEthersSigner)) {
    return await (signer as IEthersSigner).signMessage(MESSAGE_TO_BE_SIGNED);
  } else {
    const myAddress = (await (signer as Web3).eth.getAccounts())[0];
    return await (signer as Web3).eth.personal.sign(MESSAGE_TO_BE_SIGNED, myAddress, "");
  }
};
