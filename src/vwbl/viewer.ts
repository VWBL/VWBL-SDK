/* eslint-disable no-prototype-builtins */
import axios from "axios";
import { ethers } from "ethers";
import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import { AbiItem } from "web3-utils";

import vwblDataCollector from "../contract/VWBLDataCollector.json";
import { ExtendedMetadeta, PlainMetadata } from "./metadata";
import { ViewerConstructorProps, ViewerOption } from "./types";

type TokenInfo = {
  contractAddress: string;
  tokenId: number;
  tokenURI: string;
};

export class VWBLViewer {
  public opts: ViewerOption;
  private dataCollector: Contract | ethers.Contract;

  constructor(props: ViewerConstructorProps) {
    this.opts = props;
    const { provider, dataCollectorAddress } = props;
    this.dataCollector = provider.hasOwnProperty("eth")
      ? new (provider as Web3).eth.Contract(vwblDataCollector.abi as AbiItem[], dataCollectorAddress)
      : new ethers.Contract(dataCollectorAddress, vwblDataCollector.abi, provider as ethers.providers.BaseProvider);
  }

  getMetadata = async (contractAddress: string, tokenId: number): Promise<ExtendedMetadeta | undefined> => {
    if (!this.dataCollector) throw new Error("please set dataCollectorAddress");
    const metadataUrl =
      this.dataCollector instanceof Contract
        ? await this.dataCollector.methods.getTokenURI(contractAddress, tokenId).call()
        : await this.dataCollector.callStatic.getTokenURI(contractAddress, tokenId);
    if (!metadataUrl) return undefined;
    const metadata: PlainMetadata = (await axios.get(metadataUrl).catch(() => undefined))?.data;
    if (!metadata) return undefined;
    return {
      id: tokenId,
      name: metadata.name,
      description: metadata.description,
      image: metadata.image,
      mimeType: metadata.mime_type,
      encryptLogic: metadata.encrypt_logic,
      address: contractAddress,
    };
  };

  listMetadata = async (contractAddress: string): Promise<(ExtendedMetadeta | undefined)[]> => {
    if (!this.dataCollector) throw new Error("please set dataCollectorAddress");
    const tokens =
      this.dataCollector instanceof Contract
        ? await this.dataCollector.methods.getAllTokensFromOptionalContract(contractAddress).call()
        : await this.dataCollector.callStatic.getAllTokensFromOptionalContract(contractAddress);
    const items: (ExtendedMetadeta | undefined)[] = await Promise.all(
      tokens.map(async (token: TokenInfo) => {
        const metadata: PlainMetadata = (await axios.get(token.tokenURI).catch(() => undefined))?.data;
        if (!metadata) return undefined;
        return {
          id: token.tokenId,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image,
          mimeType: metadata.mime_type,
          encryptLogic: metadata.encrypt_logic,
          address: contractAddress,
        };
      })
    );
    return items;
  };

  listMetadataFormMultiContracts = async (contracts: string[]): Promise<(ExtendedMetadeta | undefined)[]> => {
    if (!this.dataCollector) throw new Error("please set dataCollectorAddress");
    const allItems: (ExtendedMetadeta | undefined)[] = [];
    for (const addr of contracts) {
      const items = await this.listMetadata(addr);
      allItems.push(...items);
    }
    return allItems;
  };

  listAllOwnedMetadata = async (userAddress: string): Promise<(ExtendedMetadeta | undefined)[]> => {
    if (!this.dataCollector) throw new Error("please set dataCollectorAddress");
    const tokens =
      this.dataCollector instanceof Contract
        ? await this.dataCollector.methods.getAllOwnedTokens(userAddress).call()
        : await this.dataCollector.callStatic.getAllOwnedTokens(userAddress);
    const items: (ExtendedMetadeta | undefined)[] = await Promise.all(
      tokens.map(async (token: TokenInfo) => {
        const metadata: PlainMetadata = (await axios.get(token.tokenURI).catch(() => undefined))?.data;
        if (!metadata) return undefined;
        return {
          id: token.tokenId,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image,
          mimeType: metadata.mime_type,
          encryptLogic: metadata.encrypt_logic,
          address: token.contractAddress,
        };
      })
    );
    return items;
  };

  listOwnedNFTMetadata = async (userAddress: string): Promise<(ExtendedMetadeta | undefined)[]> => {
    if (!this.dataCollector) throw new Error("please set dataCollectorAddress");
    const tokens =
      this.dataCollector instanceof Contract
        ? await this.dataCollector.methods.getOwnedNFTs(userAddress).call()
        : await this.dataCollector.callStatic.getOwnedNFTs(userAddress);
    const items: (ExtendedMetadeta | undefined)[] = await Promise.all(
      tokens.map(async (token: TokenInfo) => {
        const metadata: PlainMetadata = (await axios.get(token.tokenURI).catch(() => undefined))?.data;
        if (!metadata) return undefined;
        return {
          id: token.tokenId,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image,
          mimeType: metadata.mime_type,
          encryptLogic: metadata.encrypt_logic,
          address: token.contractAddress,
        };
      })
    );
    return items;
  };

  listOwnedERC1155Metadata = async (userAddress: string): Promise<(ExtendedMetadeta | undefined)[]> => {
    if (!this.dataCollector) throw new Error("please set dataCollectorAddress");
    const tokens =
      this.dataCollector instanceof Contract
        ? await this.dataCollector.methods.getOwnedERC1155s(userAddress).call()
        : await this.dataCollector.callStatic.getOwnedERC1155s(userAddress);
    const items: (ExtendedMetadeta | undefined)[] = await Promise.all(
      tokens.map(async (token: TokenInfo) => {
        const metadata: PlainMetadata = (await axios.get(token.tokenURI).catch(() => undefined))?.data;
        if (!metadata) return undefined;
        return {
          id: token.tokenId,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image,
          mimeType: metadata.mime_type,
          encryptLogic: metadata.encrypt_logic,
          address: token.contractAddress,
        };
      })
    );
    return items;
  };

  listAllMintedMetadata = async (userAddress: string): Promise<(ExtendedMetadeta | undefined)[]> => {
    if (!this.dataCollector) throw new Error("please set dataCollectorAddress");
    const tokens =
      this.dataCollector instanceof Contract
        ? await this.dataCollector.methods.getAllMintedTokens(userAddress).call()
        : await this.dataCollector.callStatic.getAllMintedTokens(userAddress);
    const items: (ExtendedMetadeta | undefined)[] = await Promise.all(
      tokens.map(async (token: TokenInfo) => {
        const metadata: PlainMetadata = (await axios.get(token.tokenURI).catch(() => undefined))?.data;
        if (!metadata) return undefined;
        return {
          id: token.tokenId,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image,
          mimeType: metadata.mime_type,
          encryptLogic: metadata.encrypt_logic,
          address: token.contractAddress,
        };
      })
    );
    return items;
  };

  listMintedNFTMetadata = async (userAddress: string): Promise<(ExtendedMetadeta | undefined)[]> => {
    if (!this.dataCollector) throw new Error("please set dataCollectorAddress");
    const tokens =
      this.dataCollector instanceof Contract
        ? await this.dataCollector.methods.getMintedNFTs(userAddress).call()
        : await this.dataCollector.callStatic.getMintedNFTs(userAddress);
    const items: (ExtendedMetadeta | undefined)[] = await Promise.all(
      tokens.map(async (token: TokenInfo) => {
        const metadata: PlainMetadata = (await axios.get(token.tokenURI).catch(() => undefined))?.data;
        if (!metadata) return undefined;
        return {
          id: token.tokenId,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image,
          mimeType: metadata.mime_type,
          encryptLogic: metadata.encrypt_logic,
          address: token.contractAddress,
        };
      })
    );
    return items;
  };

  listMintedERC1155Metadata = async (userAddress: string): Promise<(ExtendedMetadeta | undefined)[]> => {
    if (!this.dataCollector) throw new Error("please set dataCollectorAddress");
    const tokens =
      this.dataCollector instanceof Contract
        ? await this.dataCollector.methods.getMintedERC1155s(userAddress).call()
        : await this.dataCollector.callStatic.getMintedERC1155s(userAddress);
    const items: (ExtendedMetadeta | undefined)[] = await Promise.all(
      tokens.map(async (token: TokenInfo) => {
        const metadata: PlainMetadata = (await axios.get(token.tokenURI).catch(() => undefined))?.data;
        if (!metadata) return undefined;
        return {
          id: token.tokenId,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image,
          mimeType: metadata.mime_type,
          encryptLogic: metadata.encrypt_logic,
          address: token.contractAddress,
        };
      })
    );
    return items;
  };

  getMetadataUrl = async (contractAddress: string, tokenId: number): Promise<string | undefined> => {
    const metadataUrl =
      this.dataCollector instanceof Contract
        ? await this.dataCollector.methods.getTokenURI(contractAddress, tokenId).call()
        : await this.dataCollector.callStatic.getTokenURI(contractAddress, tokenId);
    if (!metadataUrl) return undefined;
    return metadataUrl;
  };

  getDocumentId = async (contractAddress: string, tokenId: number): Promise<string | undefined> => {
    const documentId =
      this.dataCollector instanceof Contract
        ? await this.dataCollector.methods.getDocumentId(contractAddress, tokenId).call()
        : await this.dataCollector.callStatic.getDocumentId(contractAddress, tokenId);
    if (!documentId) return undefined;
    return documentId;
  };

  getNFTOwner = async (contractAddress: string, tokenId: number): Promise<string> => {
    if (!this.dataCollector) throw new Error("please set dataCollectorAddress");
    const owner: string = await this.dataCollector.methods.getNFTOwner(contractAddress, tokenId).call();
    return owner;
  };
}
