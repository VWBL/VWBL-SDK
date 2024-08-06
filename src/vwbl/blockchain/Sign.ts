import { BytesLike, ethers } from "ethers";
import { Web3 } from "web3";

interface IEthersSigner {
  // signMessage(message: string | ethers.Bytes): Promise<string>;
  signMessage(message: string | BytesLike): Promise<string>;
}

const isEthersSigner = (signer: IEthersSigner): signer is IEthersSigner => {
  return signer.signMessage !== undefined;
};

export const signToProtocol = async (signer: Web3 | ethers.Signer, signMessage: string) => {
  if (isEthersSigner(signer as IEthersSigner)) {
    return await (signer as IEthersSigner).signMessage(signMessage);
  } else {
    const myAddress = (await (signer as Web3).eth.getAccounts())[0];
    return await (signer as Web3).eth.personal.sign(signMessage, myAddress, "");
  }
};
