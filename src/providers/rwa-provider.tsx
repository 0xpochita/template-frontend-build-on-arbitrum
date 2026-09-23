"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { BaseError, formatEther, type Hash, isAddressEqual } from "viem";
import { useAccount } from "wagmi";
import {
  useAvailableFractions,
  useBuyFractions,
  useContractBalance,
  useContractOwner,
  useCooldownPeriod,
  useFractionBalance,
  useFractionPrice,
  useLastInvestmentTime,
  usePropertyDocumentUri,
  usePropertyName,
  usePropertySymbol,
  useRestockFractions,
  useTotalFractions,
  useWalletBalance,
  useWithdrawFunds,
} from "@/hooks";
import { formatEth, NETWORK_NAME, type TxRecord } from "@/lib/rwa";

const STORAGE_KEY = "ethfrax-transactions";
const HISTORY_LIMIT = 8;

const SIGNING_STATUS = "Waiting for wallet signature...";
const CONFIRMING_STATUS = `Waiting for ${NETWORK_NAME} confirmation...`;

const toEth = (wei: bigint) => Number(formatEther(wei));
const nowInSeconds = () => Math.floor(Date.now() / 1000);

export type PropertyView = {
  name: string;
  symbol: string;
  documentUri: string;
  available: number;
  total: number;
  price: number;
  priceWei: bigint;
};

type RwaStore = {
  address?: string;
  isConnected: boolean;
  isOwner: boolean;
  property: PropertyView;
  owned: number;
  walletBalance: number;
  contractBalance: number;
  cooldown: number;
  transactions: TxRecord[];
  receipt: TxRecord | null;
  status: string;
  busy: boolean;
  buyFractions: (amount: number) => void;
  restockFractions: (amount: number) => void;
  withdrawFunds: () => void;
  clearReceipt: () => void;
};

const RwaContext = createContext<RwaStore | null>(null);

export function useRwa() {
  const store = useContext(RwaContext);
  if (!store) throw new Error("useRwa must be used inside RwaProvider");
  return store;
}

export function RwaProvider({ children }: { children: ReactNode }) {
  const { address, isConnected } = useAccount();

  const name = usePropertyName();
  const symbol = usePropertySymbol();
  const documentUri = usePropertyDocumentUri();
  const availableFractions = useAvailableFractions();
  const totalFractions = useTotalFractions();
  const fractionPrice = useFractionPrice();
  const owner = useContractOwner();
  const cooldownPeriod = useCooldownPeriod();
  const contractBalance = useContractBalance();

  const ownedFractions = useFractionBalance(address);
  const lastInvestmentTime = useLastInvestmentTime(address);
  const walletBalance = useWalletBalance(address);

  const buy = useBuyFractions();
  const restock = useRestockFractions();
  const withdraw = useWithdrawFunds();

  const isSigning = buy.isPending || restock.isPending || withdraw.isPending;
  const isConfirming =
    buy.isConfirming || restock.isConfirming || withdraw.isConfirming;

  const [history, setHistory] = useState<{
    key: string | null;
    items: TxRecord[];
  }>({ key: null, items: [] });
  const [receipt, setReceipt] = useState<TxRecord | null>(null);
  const [message, setMessage] = useState("");
  const [now, setNow] = useState(nowInSeconds);

  const cooldownEnds =
    lastInvestmentTime > 0n ? Number(lastInvestmentTime + cooldownPeriod) : 0;

  const storageKey = address ? `${STORAGE_KEY}:${address.toLowerCase()}` : null;
  const transactions = history.key === storageKey ? history.items : [];

  useEffect(() => {
    if (!storageKey) return;
    try {
      const saved = window.localStorage.getItem(storageKey);
      setHistory({
        key: storageKey,
        items: saved ? (JSON.parse(saved) as TxRecord[]) : [],
      });
    } catch {
      window.localStorage.removeItem(storageKey);
      setHistory({ key: storageKey, items: [] });
    }
  }, [storageKey]);

  useEffect(() => {
    if (!history.key) return;
    window.localStorage.setItem(history.key, JSON.stringify(history.items));
  }, [history]);

  useEffect(() => {
    const tick = () => {
      const current = nowInSeconds();
      setNow(current);
      return current < cooldownEnds;
    };
    if (!tick()) return;
    const timer = setInterval(() => {
      if (!tick()) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldownEnds]);

  const run = async (
    draft: Omit<TxRecord, "id" | "hash" | "timestamp">,
    send: () => Promise<Hash>,
  ) => {
    setMessage("");
    try {
      const hash = await send();
      const record: TxRecord = {
        ...draft,
        id: hash,
        hash,
        timestamp: Date.now(),
      };
      setHistory((current) => ({
        ...current,
        items: [record, ...current.items].slice(0, HISTORY_LIMIT),
      }));
      setMessage(`Transaction confirmed on ${NETWORK_NAME}.`);
      setReceipt(record);
    } catch (error) {
      setMessage(
        error instanceof BaseError
          ? error.shortMessage
          : error instanceof Error
            ? error.message
            : "Transaction failed.",
      );
    }
  };

  const buyFractions = (amount: number) =>
    run(
      {
        kind: "buy",
        title: "Buy Fractions",
        detail: `${amount} Fractions · ${formatEth(amount * toEth(fractionPrice))}`,
        fractions: amount,
        eth: amount * toEth(fractionPrice),
      },
      () => buy.buyFractions(BigInt(amount), fractionPrice),
    );

  const restockFractions = (amount: number) =>
    run(
      {
        kind: "restock",
        title: "Restock",
        detail: `${amount} Fractions added to supply`,
        fractions: amount,
      },
      () => restock.restockFractions(BigInt(amount)),
    );

  const withdrawFunds = () =>
    run(
      {
        kind: "withdraw",
        title: "Withdraw",
        detail: `${formatEth(toEth(contractBalance))} withdrawn to owner`,
        eth: toEth(contractBalance),
      },
      withdraw.withdrawFunds,
    );

  const isOwner = Boolean(address && owner && isAddressEqual(address, owner));

  return (
    <RwaContext.Provider
      value={{
        address,
        isConnected,
        isOwner,
        property: {
          name,
          symbol,
          documentUri,
          available: Number(availableFractions),
          total: Number(totalFractions),
          price: toEth(fractionPrice),
          priceWei: fractionPrice,
        },
        owned: Number(ownedFractions),
        walletBalance: toEth(walletBalance),
        contractBalance: toEth(contractBalance),
        cooldown: Math.max(cooldownEnds - now, 0),
        transactions,
        receipt,
        status: isSigning
          ? SIGNING_STATUS
          : isConfirming
            ? CONFIRMING_STATUS
            : message,
        busy: isSigning || isConfirming,
        buyFractions,
        restockFractions,
        withdrawFunds,
        clearReceipt: () => setReceipt(null),
      }}
    >
      {children}
    </RwaContext.Provider>
  );
}
