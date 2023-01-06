import axios from "axios";
import { Contract } from "web3-eth-contract";
import { AbiItem } from "web3-utils";

import vwblDataCollector from "../contract/VWBLDataCollector.json";
import { decryptFile, decryptStream, decryptString } from "../util/cryptoHelper";
import { VWBLBase } from "./base";
import { ExtendedMetadeta, ExtractMetadata, PlainMetadata } from "./metadata";
import { ViewerConstructorProps, ViewerOption } from "./types";

type TokenInfo = {
  contractAddress: string;
  tokenId: number;
  tokenURI: string;
};

export class VWBLViewer extends VWBLBase {
  public opts: ViewerOption;
  private dataCollector?: Contract;

  constructor(props: ViewerConstructorProps) {
    super(props);

    this.opts = props;
    const { web3, dataCollectorAddress } = props;
    this.dataCollector = new web3.eth.Contract(vwblDataCollector.abi as AbiItem[], dataCollectorAddress);
  }

  sign = async () => {
    await this._sign(this.opts.web3);
  };

  getMetadata = async (contractAddress: string, tokenId: number): Promise<ExtendedMetadeta | undefined> => {
    if (!this.dataCollector) throw new Error("please set dataCollectorAddress");
    const metadataUrl = await this.dataCollector.methods.getTokenURI(contractAddress, tokenId).call();
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
    const tokens = await this.dataCollector.methods.getAllTokensFromOptionalContract(contractAddress).call();
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
    const tokens = await this.dataCollector.methods.getAllOwnedTokens(userAddress).call();
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
    const tokens = await this.dataCollector.methods.getOwnedNFTs(userAddress).call();
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
    const tokens = await this.dataCollector.methods.getOwnedERC1155s(userAddress).call();
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
    const tokens = await this.dataCollector.methods.getAllMintedTokens(userAddress).call();
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
    const tokens = await this.dataCollector.methods.getAllMintedTokensOfNFT(userAddress).call();
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
    const tokens = await this.dataCollector.methods.getAllMintedTokensOfERC1155(userAddress).call();
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

  extractMetadata = async (
    contractAddress: string,
    tokenId: number,
    signature?: string
  ): Promise<ExtractMetadata | undefined> => {
    const sig = this.signature || signature;
    if (!sig) throw new Error("please sign or set signature param");
    if (!this.dataCollector) throw new Error("please set dataCollectorAddress");
    const metadataUrl = await this.dataCollector.methods.getTokenURI(contractAddress, tokenId).call();
    if (!metadataUrl) return undefined;
    const metadata: PlainMetadata = (await axios.get(metadataUrl).catch(() => undefined))?.data;
    if (!metadata) return undefined;
    const documentId = await this.dataCollector.methods.getDocumentId(contractAddress, tokenId).call();
    const chainId = await this.opts.web3.eth.getChainId();
    const decryptKey = await this.api.getKey(documentId, chainId, sig);
    const encryptedDataUrls = metadata.encrypted_data;
    const isRunningOnBrowser = typeof window !== "undefined";
    const encryptLogic = metadata.encrypt_logic ?? "base64";
    const ownDataArray = await Promise.all(
      encryptedDataUrls.map(async (encryptedDataUrl) => {
        const encryptedData = (
          await axios.get(encryptedDataUrl, {
            responseType: encryptLogic === "base64" ? "text" : isRunningOnBrowser ? "arraybuffer" : "stream",
          })
        ).data;
        return encryptLogic === "base64"
          ? decryptString(encryptedData, decryptKey)
          : isRunningOnBrowser
          ? await decryptFile(encryptedData, decryptKey)
          : decryptStream(encryptedData, decryptKey);
      })
    );
    const ownFiles = ownDataArray.filter((ownData): ownData is ArrayBuffer => typeof ownData !== "string");
    const ownDataBase64 = ownDataArray.filter((ownData): ownData is string => typeof ownData === "string");
    const fileName = encryptedDataUrls[0]
      .split("/")
      .slice(-1)[0]
      .replace(/\.vwbl/, "");
    return {
      id: tokenId,
      name: metadata.name,
      description: metadata.description,
      image: metadata.image,
      mimeType: metadata.mime_type,
      encryptLogic: metadata.encrypt_logic,
      ownDataBase64,
      ownFiles,
      fileName,
    };
  };
}
