import Web3 from "web3";
//May: signの文字列はサーバから取得してもいいかも
const MESSAGE_TO_BE_SIGNED = "Hello VWBL";

export const signToProtocol = async (web3: Web3) => {
  const myAddress = (await web3.eth.getAccounts())[0];
  // @ts-ignore
  return await web3.eth.personal.sign(MESSAGE_TO_BE_SIGNED, myAddress, null);
};
