import type { Address } from "viem";
import { useReadContract } from "wagmi";
import { fractionalProperty } from "@/lib/web3/contracts";

export function useFractionBalance(investor?: Address) {
  const { data } = useReadContract({
    ...fractionalProperty,
    functionName: "fractionBalances",
    args: investor ? [investor] : undefined,
    query: { enabled: Boolean(investor) },
  });

  return data ?? 0n;
}
