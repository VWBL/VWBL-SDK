import { ethers } from "ethers";

export async function getChainId(signer: ethers.Signer): Promise<number> {
  const provider = signer.provider;
  if (!provider) {
    throw new Error("Signer does not have a provider");
  }
  const network = await provider.getNetwork();
  return Number(network.chainId);
}
