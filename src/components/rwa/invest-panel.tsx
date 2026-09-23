"use client";

import { useConnectModal } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { useState } from "react";
import { formatEther, parseEther } from "viem";
import { Button, Card, Chip } from "@/components/ui";
import { formatEth } from "@/lib/rwa";
import type { PropertyView } from "@/providers/rwa-provider";

const PRESET_FRACTIONS = [1, 5, 10];
const GAS_RESERVE = 0.0001;

const sanitizeEth = (raw: string) => {
  const [whole, ...decimals] = raw
    .replace(/,/g, ".")
    .replace(/[^\d.]/g, "")
    .split(".");
  return decimals.length ? `${whole}.${decimals.join("").slice(0, 18)}` : whole;
};

const toWei = (value: string) => {
  try {
    return parseEther(value || "0");
  } catch {
    return 0n;
  }
};

function StepperButton({
  label,
  rotated = false,
  onClick,
}: {
  label: string;
  rotated?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid h-6 w-8 place-items-center text-ink/40 transition-colors hover:bg-ink/5 hover:text-ink"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`h-3.5 w-3.5 ${rotated ? "rotate-180" : ""}`}
      >
        <title>{label}</title>
        <path d="m6 15 6-6 6 6" />
      </svg>
    </button>
  );
}

export function InvestPanel({
  property,
  owned,
  walletBalance,
  connected,
  busy,
  cooldown,
  status,
  onBuy,
}: {
  property: PropertyView;
  owned: number;
  walletBalance: number;
  connected: boolean;
  busy: boolean;
  cooldown: number;
  status: string;
  onBuy: (fractions: number) => void;
}) {
  const [input, setInput] = useState("0.001");
  const { openConnectModal } = useConnectModal();

  const { available, priceWei } = property;
  const fractions = priceWei ? Number(toWei(input) / priceWei) : 0;
  const total = fractions * property.price;
  const unspent = Math.max(Number(input.replace(/\.$/, "")) - total, 0);
  const ownership = property.total
    ? ((fractions / property.total) * 100).toFixed(2)
    : "0.00";

  const affordable = property.price
    ? Math.floor(Math.max(walletBalance - GAS_RESERVE, 0) / property.price)
    : 0;
  const maxFractions = connected ? Math.min(available, affordable) : available;

  const setFractions = (value: number) => {
    const next = Math.min(Math.max(value, 1), Math.max(available, 1));
    setInput(formatEther(BigInt(next) * priceWei));
  };

  const invalid = fractions < 1 || fractions > available;
  const insufficient = connected && total > walletBalance;
  const disabled =
    connected && (busy || invalid || insufficient || cooldown > 0);

  const buttonLabel = () => {
    if (!connected) return "Connect Wallet";
    if (busy) return "Processing Transaction...";
    if (cooldown > 0) return `Cooldown ${cooldown}s`;
    if (fractions < 1) return `Minimum ${formatEth(property.price)}`;
    if (invalid) return "Not Enough Fractions Available";
    if (insufficient) return "Insufficient ETH Balance";
    return "Buy Property Fractions";
  };

  return (
    <Card className="flex w-full flex-col gap-6 p-7">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-2xl font-semibold tracking-tight">
          Enter ETH Amount
        </h3>
        <span className="flex items-center overflow-hidden rounded-full bg-canvas text-xs font-semibold">
          <span className="px-3 py-2 text-ink/55">Balance</span>
          <span className="border-l border-ink/10 px-3 py-2">
            {connected ? `${walletBalance.toFixed(4)} ETH` : "—"}
          </span>
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {PRESET_FRACTIONS.map((preset) => (
          <Chip
            key={preset}
            active={fractions === preset}
            onClick={() => setFractions(preset)}
          >
            {formatEther(BigInt(preset) * priceWei)} ETH
          </Chip>
        ))}
        <Chip
          active={maxFractions > 0 && fractions === maxFractions}
          onClick={() => setFractions(maxFractions)}
        >
          Max
        </Chip>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-end justify-between gap-4 border-b border-ink/15 pb-4">
          <input
            type="text"
            inputMode="decimal"
            value={input}
            placeholder="0.0"
            onChange={(event) => setInput(sanitizeEth(event.target.value))}
            onBlur={() => fractions >= 1 && setFractions(fractions)}
            className="w-full min-w-0 bg-transparent text-5xl font-semibold tracking-tight outline-none placeholder:text-ink/20"
          />
          <div className="flex shrink-0 items-center gap-2 pb-1">
            <span className="flex items-center gap-1.5 rounded-full bg-canvas py-1.5 pl-2 pr-3.5 text-xs font-semibold text-ink/70">
              <Image
                src="/assets/eth-logo.svg"
                alt=""
                width={16}
                height={16}
                className="h-4 w-4"
              />
              ETH
            </span>
            <div className="flex flex-col overflow-hidden rounded-lg bg-canvas">
              <StepperButton
                label="Increase amount"
                onClick={() => setFractions(fractions + 1)}
              />
              <StepperButton
                label="Decrease amount"
                rotated
                onClick={() => setFractions(fractions - 1)}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm text-ink/55">
          <span className="flex items-center gap-2">
            <Image
              src="/assets/3d-bangunan.png"
              alt=""
              width={1371}
              height={1147}
              className="h-5 w-auto object-contain"
            />
            = {fractions} Fractions
          </span>
          <span>≈ {ownership}% ownership</span>
        </div>
        {fractions >= 1 && unspent > 0 ? (
          <p className="text-xs text-ink/45">
            Only whole fractions can be bought — {unspent.toFixed(6)} ETH stays
            in your wallet.
          </p>
        ) : null}
      </div>

      <div className="mt-auto flex flex-col gap-5">
        <div className="flex items-end justify-between gap-4 border-t border-ink/10 pt-5">
          <div>
            <p className="text-xs text-ink/50">Total Investment</p>
            <p className="mt-1 text-3xl font-semibold tracking-tight">
              {formatEth(total)}
            </p>
          </div>
          <p className="text-xs text-ink/45">
            {formatEth(property.price)} per fraction · My fractions{" "}
            {connected ? owned : 0} pcs
          </p>
        </div>

        <Button
          variant="blossom"
          disabled={disabled}
          onClick={connected ? () => onBuy(fractions) : openConnectModal}
          className="w-full py-4"
        >
          {buttonLabel()}
        </Button>

        {status ? <p className="text-xs text-ink/50">{status}</p> : null}
      </div>
    </Card>
  );
}
