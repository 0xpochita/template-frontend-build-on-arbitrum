import { useReadContract } from "wagmi";
import { fractionalProperty } from "@/lib/web3/contracts";

export function useCooldownPeriod() {
  const { data } = useReadContract({
    ...fractionalProperty,
    functionName: "COOLDOWN_PERIOD",
  });

  return data ?? 0n;
}
