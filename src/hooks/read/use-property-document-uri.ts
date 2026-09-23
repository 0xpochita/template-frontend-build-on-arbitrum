import { useReadContract } from "wagmi";
import { fractionalProperty } from "@/lib/web3/contracts";

export function usePropertyDocumentUri() {
  const { data } = useReadContract({
    ...fractionalProperty,
    functionName: "propertyDocumentURI",
  });

  return data ?? "";
}
