// import { expect } from "chai";
// import * as dotenv from "dotenv";
// import Web3 from "web3";
// import HDWalletProvider from "@truffle/hdwallet-provider";

// import { VWBLViewer } from "../../../src/vwbl/viewer";

// dotenv.config();

// if (!process.env.PRIVATE_KEY || !process.env.PROVIDER_URL) throw new Error("please set PRIVATE_KEY and PROVIDER_URL");

// const provider = new HDWalletProvider({
//   privateKeys: [process.env.PRIVATE_KEY!],
//   providerOrUrl: process.env.PROVIDER_URL!,
// });
// const web3 = new Web3(provider as any);

// describe("VWBLViewer", () => {
//   const targetNFT = "0x9850c4682475ac6bcB9CdA91F927CCc1574781C7";
//   const targetTokenId = 46;

//   const viewer = new VWBLViewer({
//     web3,
//     contractAddress: targetNFT, // any address is OK
//     vwblNetworkUrl: "https://dev.vwbl.network/",
//     dataCollectorAddress: "0x96148CFd76627c0bd520a261F7293d1f25DA7473",
//   });

//   before(async () => {
//     await viewer.sign();
//   });

//   it("getMetadata()", async () => {
//     await viewer.getMetadata(targetNFT, 46).then((res) => console.log("fetched metadata: ", res));
//   }).timeout(60 * 1000); // 60 sec timeout

//   it("listMetadata()", async () => {
//     await viewer.listMetadata(targetNFT).then((res) => console.log("fetched metadata length: ", res.length));
//   }).timeout(60 * 1000); // 60 sec timeout

//   it("listMetadataFormMultiContracts()", async () => {
//     await viewer
//       .listMetadataFormMultiContracts([targetNFT, targetNFT])
//       .then((res) => console.log("fetched metadata length: ", res.length));
//   }).timeout(60 * 1000); // 60 sec timeout

//   it("extractMetadata()", async () => {
//     if (!process.env.PRIVATE_KEY) return console.error("please set private key");

//     // if PRIVATE_KEY's account don't have specified NFT, this request catch an error.
//     await viewer
//       .extractMetadata(viewer.signature!, targetNFT, targetTokenId)
//       .then((res) => console.log("extracted metadta: ", res))
//       .catch((err) => {
//         console.log("error status code: ", err.response.status);
//         console.log("error reason: ", err.response.statusText);
//       });
//   }).timeout(60 * 1000); // 60 sec timeout
// });
