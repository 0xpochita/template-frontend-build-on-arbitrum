import { useReadContract } from "wagmi";
import { fractionalProperty } from "@/lib/web3/contracts";

export function useTotalFractions() {
  const { data } = useReadContract({
    ...fractionalProperty,
    functionName: "totalFractions",
  });

  return data ?? 0n;
}
