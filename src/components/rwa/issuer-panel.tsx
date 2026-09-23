"use client";

import { useState } from "react";
import { Button, Card } from "@/components/ui";
import { formatEth } from "@/lib/rwa";

export function IssuerPanel({
  contractBalance,
  busy,
  onRestock,
  onWithdraw,
}: {
  contractBalance: number;
  busy: boolean;
  onRestock: (amount: number) => void;
  onWithdraw: () => void;
}) {
  const [restockAmount, setRestockAmount] = useState(500);

  return (
    <Card
      tone="ink"
      className="flex flex-col gap-7 border border-dashed border-canvas/30 p-7"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-canvas/50">
            Asset Issuer Dashboard
          </p>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight">
            🔒 Contract Owner Panel
          </h3>
        </div>
        <span className="rounded-full bg-canvas/15 px-4 py-2 text-xs font-semibold">
          onlyOwner
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-5 rounded-[22px] bg-canvas/10 p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-canvas/50">
            Restock Fraction Supply
          </p>
          <div className="flex items-end justify-between gap-4 border-b border-canvas/20 pb-3">
            <input
              type="number"
              min={1}
              value={restockAmount}
              onChange={(event) => setRestockAmount(Number(event.target.value))}
              className="w-full bg-transparent text-4xl font-semibold tracking-tight text-canvas outline-none"
            />
            <span className="pb-1 text-xs font-semibold text-canvas/60">
              Fractions
            </span>
          </div>
          <Button
            variant="blossom"
            disabled={busy || restockAmount < 1}
            onClick={() => onRestock(restockAmount)}
            className="self-start"
          >
            Restock Supply
          </Button>
        </div>

        <div className="flex flex-col gap-5 rounded-[22px] bg-canvas/10 p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-canvas/50">
            Contract Balance
          </p>
          <div className="flex items-end justify-between gap-4 border-b border-canvas/20 pb-3">
            <p className="text-4xl font-semibold tracking-tight">
              {formatEth(contractBalance)}
            </p>
          </div>
          <Button
            variant="soft"
            disabled={busy || contractBalance <= 0}
            onClick={onWithdraw}
            className="self-start"
          >
            Withdraw Funds
          </Button>
        </div>
      </div>
    </Card>
  );
}
