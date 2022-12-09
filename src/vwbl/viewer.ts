import axios from "axios";
import Web3 from "web3";
import { AbiItem } from "web3-utils";

import vwbl from "../contract/VWBL.json";
import { Metadata } from "./metadata";

export class VWBLViewer {
  private web3: Web3;

  constructor(web3: Web3) {
    this.web3 = web3;
  }

  getMetadata = async (contractAddress: string, tokenId: number): Promise<Metadata | undefined> => {
    const contract = new this.web3.eth.Contract(vwbl.abi as AbiItem[], contractAddress);
    const metadataUrl = await contract.methods.tokenURI(tokenId).call();
    const metadata = (await axios.get(metadataUrl).catch(() => undefined))?.data;

    if (!metadata) {
      return undefined;
    }
    return {
      id: tokenId,
      name: metadata.name,
      description: metadata.description,
      image: metadata.image,
      mimeType: metadata.mime_type,
      encryptLogic: metadata.encrypt_logic,
    };
  };

  listMetadata = async (contractAddress: string): Promise<(Metadata | undefined)[]> => {
    const contract = new this.web3.eth.Contract(vwbl.abi as AbiItem[], contractAddress);
    const itemCount = await contract.methods.counter().call();
    const tokenIds = Array.from(new Array(parseInt(itemCount))).map((v, i) => ++i);
    const items: (Metadata | undefined)[] = await Promise.all(
      tokenIds.map(async (tokenId: number) => {
        const metadataUrl = await contract.methods.tokenURI(tokenId).call();
        const metadata = (await axios.get(metadataUrl).catch(() => undefined))?.data;
        if (!metadata) {
          return undefined;
        }
        return {
          id: tokenId,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image,
          mimeType: metadata.mime_type,
          encryptLogic: metadata.encryptLogic,
        };
      })
    );
    return items;
  };
}
