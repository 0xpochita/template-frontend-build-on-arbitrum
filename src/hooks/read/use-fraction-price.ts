import { useReadContract } from "wagmi";
import { fractionalProperty } from "@/lib/web3/contracts";

export function useFractionPrice() {
  const { data } = useReadContract({
    ...fractionalProperty,
    functionName: "fractionPrice",
  });

  return data ?? 0n;
}
