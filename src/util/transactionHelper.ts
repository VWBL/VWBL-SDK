export const getFeeSettingsBasedOnEnvironment = (
  maxPriorityFeePerGas: number | undefined,
  maxFeePerGas: number | undefined
) => {
  let _maxPriorityFeePerGas = null;
  let _maxFeePerGas = null;
  if (typeof window === "undefined") {
    _maxPriorityFeePerGas = maxPriorityFeePerGas ? maxPriorityFeePerGas : undefined;
    _maxFeePerGas = maxFeePerGas ? maxFeePerGas : undefined;
  }
  return { maxPriorityFeePerGas: _maxPriorityFeePerGas, maxFeePerGas: _maxFeePerGas };
};
