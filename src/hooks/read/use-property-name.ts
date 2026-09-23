import { useReadContract } from "wagmi";
import { fractionalProperty } from "@/lib/web3/contracts";

export function usePropertyName() {
  const { data } = useReadContract({
    ...fractionalProperty,
    functionName: "propertyName",
  });

  return data ?? "";
}
