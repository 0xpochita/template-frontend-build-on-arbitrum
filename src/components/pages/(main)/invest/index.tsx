"use client";

import { AssetCard } from "@/components/rwa/asset-card";
import { InvestPanel } from "@/components/rwa/invest-panel";
import { IssuerPanel } from "@/components/rwa/issuer-panel";
import { TxHistory } from "@/components/rwa/tx-history";
import { useRwa } from "@/providers/rwa-provider";

export default function InvestPage() {
  const {
    property,
    isConnected,
    isOwner,
    owned,
    walletBalance,
    busy,
    cooldown,
    status,
    contractBalance,
    transactions,
    buyFractions,
    restockFractions,
    withdrawFunds,
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

      {isOwner ? (
        <IssuerPanel
          contractBalance={contractBalance}
          busy={busy}
          onRestock={restockFractions}
          onWithdraw={withdrawFunds}
        />
      ) : null}
    </div>
  );
}
