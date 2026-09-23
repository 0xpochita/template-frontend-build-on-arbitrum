import { arbitrumSepolia } from "wagmi/chains";

export const NETWORK_NAME = arbitrumSepolia.name;

export const explorerTxUrl = (hash: string) =>
  `${arbitrumSepolia.blockExplorers.default.url}/tx/${hash}`;

export const ipfsUrl = (uri: string) =>
  uri.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/");

export type TxKind = "buy" | "restock" | "withdraw";

export type TxRecord = {
  id: string;
  kind: TxKind;
  title: string;
  detail: string;
  fractions?: number;
  eth?: number;
  hash: string;
  timestamp: number;
};

export const shortenHex = (value: string, head = 6, tail = 4) =>
  `${value.slice(0, head)}...${value.slice(-tail)}`;

export const formatEth = (value: number) => `${value.toFixed(3)} ETH`;

export const formatTime = (timestamp: number) =>
  new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

const matchNumber = (text: string, pattern: RegExp) => {
  const match = text.match(pattern);
  return match ? Number(match[1]) : undefined;
};

export const txAmounts = (tx: TxRecord) => ({
  fractions: tx.fractions ?? matchNumber(tx.detail, /(\d+) Fractions/),
  eth: tx.eth ?? matchNumber(tx.detail, /([\d.]+) ETH/),
});
