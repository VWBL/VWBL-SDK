import { ethers } from "ethers";
import Web3 from "web3";

const MESSAGE_TO_BE_SIGNED = "Hello VWBL";

interface IEthersSigner {
  signMessage (message: string | ethers.utils.Bytes): Promise<string>
}

const isEthersSigner = (signer: unknown): signer is IEthersSigner  => {
  return (signer as IEthersSigner).signMessage !== undefined
}

export const signToProtocol = async (signer: Web3 | ethers.providers.JsonRpcSigner | ethers.Wallet) => {
  if (isEthersSigner(signer)) {
    console.log("ethers instance"); 
    return await signer.signMessage(MESSAGE_TO_BE_SIGNED);
  } else {
    console.log("web3 instance");
    const myAddress = (await signer.eth.getAccounts())[0];
    return await signer.eth.personal.sign(MESSAGE_TO_BE_SIGNED, myAddress, "");
  }
};