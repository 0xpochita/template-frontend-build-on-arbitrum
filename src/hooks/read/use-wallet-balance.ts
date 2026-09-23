import type { Address } from "viem";
import { useBalance } from "wagmi";
import { fractionalProperty } from "@/lib/web3/contracts";

export function useWalletBalance(wallet?: Address) {
  const { data } = useBalance({
    address: wallet,
    chainId: fractionalProperty.chainId,
    query: { enabled: Boolean(wallet) },
  });

  return data?.value ?? 0n;
}
