import { useBalance } from "wagmi";
import { fractionalProperty } from "@/lib/web3/contracts";

export function useContractBalance() {
  const { data } = useBalance({
    address: fractionalProperty.address,
    chainId: fractionalProperty.chainId,
  });

  return data?.value ?? 0n;
}
