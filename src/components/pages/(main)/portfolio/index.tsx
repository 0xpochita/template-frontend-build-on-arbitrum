"use client";

import Image from "next/image";
import { TxHistory } from "@/components/rwa/tx-history";
import { Card, Stat } from "@/components/ui";
import { formatEth, shortenHex } from "@/lib/rwa";
import { useRwa } from "@/providers/rwa-provider";

export default function PortfolioPage() {
  const { address, isConnected, property, owned, transactions } = useRwa();

  const value = owned * property.price;
  const ownership = property.total
    ? ((owned / property.total) * 100).toFixed(2)
    : "0.00";

  return (
    <div className="flex flex-col gap-6">
      <Card className="flex flex-col gap-6 p-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h3 className="text-2xl font-semibold tracking-tight">My Assets</h3>
          <span className="rounded-full bg-canvas px-4 py-2 font-mono text-xs font-semibold">
            {address ? shortenHex(address) : "Wallet not connected"}
          </span>
        </div>

        {isConnected && owned > 0 ? (
          <div className="flex flex-wrap items-center gap-6 rounded-[22px] bg-canvas p-5">
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-lilac">
              <Image
                src="/assets/3d-bangunan.png"
                alt={property.name}
                width={1371}
                height={1147}
                className="h-10 w-auto object-contain"
              />
            </div>

            <div className="min-w-40 flex-1">
              <p className="text-base font-semibold">{property.name}</p>
              <p className="text-xs text-ink/45">{property.symbol}</p>
            </div>

            <div className="flex flex-wrap gap-8">
              <Stat label="Fractions" value={`${owned} Pcs`} />
              <Stat label="Value" value={formatEth(value)} />
              <Stat label="Ownership" value={`${ownership}%`} />
            </div>
          </div>
        ) : (
          <p className="rounded-[22px] bg-canvas p-6 text-sm text-ink/55">
            {isConnected
              ? "No fractions yet. Buy from the Invest page to see your assets here."
              : "Connect your wallet to see your assets."}
          </p>
        )}
      </Card>

      <TxHistory transactions={transactions} connected={isConnected} />
    </div>
  );
}
