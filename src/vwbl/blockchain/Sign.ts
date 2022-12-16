import { ethers } from "ethers";
import Web3 from "web3";

const MESSAGE_TO_BE_SIGNED = "Hello VWBL";

export const signToProtocol = async (signer: Web3 | ethers.providers.JsonRpcSigner) => {
  if (signer instanceof Web3) {
    const myAddress = (await signer.eth.getAccounts())[0];
    return await signer.eth.personal.sign(MESSAGE_TO_BE_SIGNED, myAddress, "");
  } else if (signer instanceof ethers.providers.JsonRpcSigner) {
    return await signer.signMessage(MESSAGE_TO_BE_SIGNED);
  }
};
