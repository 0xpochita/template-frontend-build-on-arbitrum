"use client";

import { AssetCard } from "@/components/rwa/asset-card";
import { InvestPanel } from "@/components/rwa/invest-panel";
import { TxHistory } from "@/components/rwa/tx-history";
import { useRwa } from "@/providers/rwa-provider";

export default function InvestPage() {
  const {
    property,
    isConnected,
    owned,
    walletBalance,
    busy,
    cooldown,
    status,
    transactions,
    buyFractions,
  } = useRwa();

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="flex">
          <AssetCard property={property} />
        </section>

        <section className="flex">
          <InvestPanel
            property={property}
            owned={owned}
            walletBalance={walletBalance}
            connected={isConnected}
            busy={busy}
            cooldown={cooldown}
            status={status}
            onBuy={buyFractions}
          />
        </section>
      </div>

      <TxHistory transactions={transactions} connected={isConnected} />
    </div>
  );
}
