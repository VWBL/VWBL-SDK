/* eslint-disable no-prototype-builtins */
import axios from "axios";
import { ethers } from "ethers";

import vwblDataCollector from "../contract/VWBLDataCollector.json";
import { ExtendedMetadeta, PlainMetadata } from "./metadata/type.js";
import { ViewerConstructorProps, ViewerOption } from "./types/ConstructorPropsType.js";

type TokenInfo = {
  contractAddress: string;
  tokenId: number;
  tokenURI: string;
};

export class VWBLViewer {
  public opts: ViewerOption;
  private dataCollector: any;

  constructor(props: ViewerConstructorProps) {
    this.opts = props;
    const { provider, dataCollectorAddress } = props;
    this.dataCollector =
      "eth" in provider
        ? new provider.eth.Contract(vwblDataCollector.abi, dataCollectorAddress)
        : new ethers.Contract(dataCollectorAddress, vwblDataCollector.abi, provider);
  }

  getMetadata = async (contractAddress: string, tokenId: number): Promise<ExtendedMetadeta | undefined> => {
    if (!this.dataCollector) throw new Error("please set dataCollectorAddress");
    const metadataUrl =
      "callStatic" in this.dataCollector
        ? await this.dataCollector.callStatic.getTokenURI(contractAddress, tokenId)
        : await this.dataCollector.methods.getTokenURI(contractAddress, tokenId).call();
    if (!metadataUrl) return undefined;
    const metadata: PlainMetadata = (await axios.default.get(metadataUrl).catch(() => undefined))?.data;
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
      "callStatic" in this.dataCollector
        ? await this.dataCollector.callStatic.getAllTokensFromOptionalContract(contractAddress)
        : await this.dataCollector.methods.getAllTokensFromOptionalContract(contractAddress).call();
    const items: (ExtendedMetadeta | undefined)[] = await Promise.all(
      tokens.map(async (token: TokenInfo) => {
        const metadata: PlainMetadata = (await axios.default.get(token.tokenURI).catch(() => undefined))?.data;
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
      "callStatic" in this.dataCollector
        ? await this.dataCollector.callStatic.getAllOwnedTokens(userAddress)
        : await this.dataCollector.methods.getAllOwnedTokens(userAddress).call();
    const items: (ExtendedMetadeta | undefined)[] = await Promise.all(
      tokens.map(async (token: TokenInfo) => {
        const metadata: PlainMetadata = (await axios.default.get(token.tokenURI).catch(() => undefined))?.data;
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
      "callStatic" in this.dataCollector
        ? await this.dataCollector.callStatic.getOwnedNFTs(userAddress)
        : await this.dataCollector.methods.getOwnedNFTs(userAddress).call();
    const items: (ExtendedMetadeta | undefined)[] = await Promise.all(
      tokens.map(async (token: TokenInfo) => {
        const metadata: PlainMetadata = (await axios.default.get(token.tokenURI).catch(() => undefined))?.data;
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
      "callStatic" in this.dataCollector
        ? await this.dataCollector.callStatic.getOwnedERC1155s(userAddress)
        : await this.dataCollector.methods.getOwnedERC1155s(userAddress).call();
    const items: (ExtendedMetadeta | undefined)[] = await Promise.all(
      tokens.map(async (token: TokenInfo) => {
        const metadata: PlainMetadata = (
          await axios.default.get(token.tokenURI).catch(() => undefined)
        )?.data;
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
      "callStatic" in this.dataCollector
        ? await this.dataCollector.callStatic.getAllMintedTokens(userAddress)
        : await this.dataCollector.methods.getAllMintedTokens(userAddress).call();
    const items: (ExtendedMetadeta | undefined)[] = await Promise.all(
      tokens.map(async (token: TokenInfo) => {
        const metadata: PlainMetadata = (await axios.default.get(token.tokenURI).catch(() => undefined))?.data;
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
      "callStatic" in this.dataCollector
        ? await this.dataCollector.callStatic.getMintedNFTs(userAddress)
        : await this.dataCollector.methods.getMintedNFTs(userAddress).call();
    const items: (ExtendedMetadeta | undefined)[] = await Promise.all(
      tokens.map(async (token: TokenInfo) => {
        const metadata: PlainMetadata = (await axios.default.get(token.tokenURI).catch(() => undefined))?.data;
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
      "callStatic" in this.dataCollector
        ? await this.dataCollector.callStatic.getMintedERC1155s(userAddress)
        : await this.dataCollector.methods.getMintedERC1155s(userAddress).call();
    const items: (ExtendedMetadeta | undefined)[] = await Promise.all(
      tokens.map(async (token: TokenInfo) => {
        const metadata: PlainMetadata = (await axios.default.get(token.tokenURI).catch(() => undefined))?.data;
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
    if (!this.dataCollector) throw new Error("please set dataCollectorAddress");
    const metadataUrl =
      "callStatic" in this.dataCollector
        ? await this.dataCollector.callStatic.getTokenURI(contractAddress, tokenId)
        : await this.dataCollector.methods.getTokenURI(contractAddress, tokenId).call();
    if (!metadataUrl) return undefined;
    return metadataUrl;
  };

  getDocumentId = async (contractAddress: string, tokenId: number): Promise<string | undefined> => {
    if (!this.dataCollector) throw new Error("please set dataCollectorAddress");
    const documentId =
      "callStatic" in this.dataCollector
        ? await this.dataCollector.callStatic.getDocumentId(contractAddress, tokenId)
        : await this.dataCollector.methods.getDocumentId(contractAddress, tokenId).call();
    if (!documentId) return undefined;
    return documentId;
  };

  getNFTOwner = async (contractAddress: string, tokenId: number): Promise<string> => {
    if (!this.dataCollector) throw new Error("please set dataCollectorAddress");
    const owner =
      "callStatic" in this.dataCollector
        ? await this.dataCollector.callStatic.getNFTOwner(contractAddress, tokenId)
        : await this.dataCollector.methods.getNFTOwner(contractAddress, tokenId).call();
    return owner;
  };
}
