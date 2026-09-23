import { useReadContract } from "wagmi";
import { fractionalProperty } from "@/lib/web3/contracts";

export function useContractOwner() {
  const { data } = useReadContract({
    ...fractionalProperty,
    functionName: "owner",
  });

  return data;
}
