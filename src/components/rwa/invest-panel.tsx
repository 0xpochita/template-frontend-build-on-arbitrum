"use client";

import { useConnectModal } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { useState } from "react";
import { Button, Card, Chip } from "@/components/ui";
import { formatEth } from "@/lib/rwa";
import type { PropertyView } from "@/providers/rwa-provider";

const PRESETS = [1, 5, 10];
const GAS_RESERVE = 0.0001;

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
  onBuy: (amount: number) => void;
}) {
  const [input, setInput] = useState("5");
  const { openConnectModal } = useConnectModal();

  const { available } = property;
  const affordable = property.price
    ? Math.floor(Math.max(walletBalance - GAS_RESERVE, 0) / property.price)
    : 0;
  const maxAmount = connected ? Math.min(available, affordable) : available;
  const amount = Number(input);
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  const clamp = (value: number) => Math.min(Math.max(value, 1), available);
  const setAmount = (value: number) =>
    setInput(String(clamp(Number.isFinite(value) ? value : 1)));
  const total = safeAmount * property.price;
  const ownership = property.total
    ? ((safeAmount / property.total) * 100).toFixed(2)
    : "0.00";
  const invalid = safeAmount < 1 || safeAmount > available;
  const insufficient = connected && total > walletBalance;
  const disabled =
    connected && (busy || invalid || insufficient || cooldown > 0);

  const buttonLabel = () => {
    if (!connected) return "Connect Wallet";
    if (busy) return "Processing Transaction...";
    if (cooldown > 0) return `Cooldown ${cooldown}s`;
    if (invalid) return "Invalid Fraction Amount";
    if (insufficient) return "Insufficient ETH Balance";
    return "Buy Property Fractions";
  };

  return (
    <Card className="flex w-full flex-col gap-6 p-7">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-2xl font-semibold tracking-tight">
          Enter Fraction Amount
        </h3>
        <span className="flex items-center overflow-hidden rounded-full bg-canvas text-xs font-semibold">
          <span className="px-3 py-2 text-ink/55">Balance</span>
          <span className="border-l border-ink/10 px-3 py-2">
            {connected ? `${walletBalance.toFixed(4)} ETH` : "—"}
          </span>
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <Chip
            key={preset}
            active={amount === preset}
            onClick={() => setAmount(preset)}
          >
            {preset} Fractions
          </Chip>
        ))}
        <Chip
          active={maxAmount > 0 && amount === maxAmount}
          onClick={() => setAmount(maxAmount)}
        >
          Max
        </Chip>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-end justify-between gap-4 border-b border-ink/15 pb-4">
          <input
            type="number"
            min={1}
            max={available}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onBlur={() => setAmount(invalid ? 1 : amount)}
            className="w-full bg-transparent text-5xl font-semibold tracking-tight outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <div className="flex shrink-0 items-center gap-2 pb-1">
            <span className="flex items-center gap-2 rounded-full bg-canvas py-1.5 pl-2 pr-3.5 text-xs font-semibold text-ink/70">
              <Image
                src="/assets/3d-bangunan.png"
                alt=""
                width={1371}
                height={1147}
                className="h-5 w-auto object-contain"
              />
              Fractions
            </span>
            <div className="flex flex-col overflow-hidden rounded-lg bg-canvas">
              <StepperButton
                label="Increase fractions"
                onClick={() => setAmount(safeAmount + 1)}
              />
              <StepperButton
                label="Decrease fractions"
                rotated
                onClick={() => setAmount(safeAmount - 1)}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm text-ink/55">
          <span>{formatEth(property.price)} per fraction</span>
          <span>≈ {ownership}% ownership</span>
        </div>
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
            My fractions {connected ? owned : 0} pcs
          </p>
        </div>

        <Button
          variant="blossom"
          disabled={disabled}
          onClick={connected ? () => onBuy(amount) : openConnectModal}
          className="w-full py-4"
        >
          {buttonLabel()}
        </Button>

        <p className="text-xs text-ink/50">
          Status: {status || "Idle — ready to send a transaction to Arbitrum."}
        </p>
      </div>
    </Card>
  );
}
