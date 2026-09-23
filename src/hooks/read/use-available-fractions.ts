import { useReadContract } from "wagmi";
import { fractionalProperty } from "@/lib/web3/contracts";

export function useAvailableFractions() {
  const { data } = useReadContract({
    ...fractionalProperty,
    functionName: "availableFractions",
  });

  return data ?? 0n;
}
