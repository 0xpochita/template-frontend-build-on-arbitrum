import { arbitrumSepolia } from "wagmi/chains";
import { fractionalPropertyAbi } from "./abi";

export const fractionalProperty = {
  address: "0x1951174713Ae27013e33523F6A55f55307617E3D",
  abi: fractionalPropertyAbi,
  chainId: arbitrumSepolia.id,
} as const;
