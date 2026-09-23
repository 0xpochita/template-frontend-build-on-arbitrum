import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useConfig, useWriteContract } from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";
import { fractionalProperty } from "@/lib/web3/contracts";
import { getGasFees } from "@/lib/web3/gas";

export function useWithdrawFunds() {
  const config = useConfig();
  const queryClient = useQueryClient();
  const { writeContractAsync, isPending } = useWriteContract();
  const [isConfirming, setIsConfirming] = useState(false);

  const withdrawFunds = async () => {
    const fees = await getGasFees(config);

    const hash = await writeContractAsync({
      ...fractionalProperty,
      ...fees,
      functionName: "withdrawFunds",
    });

    setIsConfirming(true);
    try {
      const receipt = await waitForTransactionReceipt(config, { hash });
      if (receipt.status === "reverted") {
        throw new Error("Transaction reverted on-chain.");
      }
      await queryClient.invalidateQueries();
      return hash;
    } finally {
      setIsConfirming(false);
    }
  };

  return { withdrawFunds, isPending, isConfirming };
}
