import type { Config } from "wagmi";
import { estimateFeesPerGas } from "wagmi/actions";
import { fractionalProperty } from "./contracts";

export async function getGasFees(config: Config) {
  const { maxFeePerGas, maxPriorityFeePerGas } = await estimateFeesPerGas(
    config,
    { chainId: fractionalProperty.chainId },
  );

  return { maxFeePerGas: maxFeePerGas * 2n, maxPriorityFeePerGas };
}
