import { useReadContract } from "wagmi";
import { fractionalProperty } from "@/lib/web3/contracts";

export function usePropertySymbol() {
  const { data } = useReadContract({
    ...fractionalProperty,
    functionName: "propertySymbol",
  });

  return data ?? "";
}
