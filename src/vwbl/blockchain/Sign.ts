import Web3 from "web3";
//May: signの文字列はサーバから取得してもいいかも
const MESSAGE_TO_BE_SIGNED_WHEN_SET_KEY = "set key to VWBL server";
const MESSAGE_TO_BE_SIGNED_WHEN_GET_KEY = "get key from VWBL server";

export const signToSetKey = async (web3: Web3) => {
  const myAddress = (await web3.eth.getAccounts())[0];
  return await web3.eth.personal.sign(MESSAGE_TO_BE_SIGNED_WHEN_SET_KEY, myAddress, "");
};
export const signToGetKey = async (web3: Web3) => {
  const myAddress = (await web3.eth.getAccounts())[0];
  return await web3.eth.personal.sign(MESSAGE_TO_BE_SIGNED_WHEN_GET_KEY, myAddress, "");
};
