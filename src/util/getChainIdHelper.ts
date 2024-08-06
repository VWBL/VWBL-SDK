import { ethers } from "ethers";

export async function getChainId(provider: ethers.Provider): Promise<bigint> {
  console.log("provider>>>>>>>", provider);
  try {
    const network = await provider.getNetwork();
    console.log("getChainIdSuccess", network.chainId);
    return network.chainId;
  } catch (error) {
    console.error("Error getting chainId:", error);
    if (error instanceof Error) {
      throw new Error(`Unable to determine chainId: ${error.message}`);
    } else {
      throw new Error("Unable to determine chainId: Unknown error");
    }
  }
}
