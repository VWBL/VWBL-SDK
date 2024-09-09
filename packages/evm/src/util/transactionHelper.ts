export const getFeeSettingsBasedOnEnvironment = (
  maxPriorityFeePerGas: number | undefined,
  maxFeePerGas: number | undefined
) => {
  const isRunningOnNode = typeof window === "undefined";
  return isRunningOnNode ? { maxPriorityFeePerGas, maxFeePerGas } : { maxPriorityFeePerGas: null, maxFeePerGas: null };
};
