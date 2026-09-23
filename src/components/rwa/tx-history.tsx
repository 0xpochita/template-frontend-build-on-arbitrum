"use client";

import { useConnectModal } from "@rainbow-me/rainbowkit";
import { Button, Card, ExternalIcon } from "@/components/ui";
import {
  explorerTxUrl,
  formatTime,
  NETWORK_NAME,
  shortenHex,
  type TxKind,
  type TxRecord,
} from "@/lib/rwa";

const kindStyles: Record<TxKind, string> = {
  buy: "bg-blossom",
  restock: "bg-butter",
  withdraw: "bg-mint",
};

function EmptyState({ connected }: { connected: boolean }) {
  const { openConnectModal } = useConnectModal();

  if (connected) {
    return (
      <p className="rounded-[22px] bg-canvas p-6 text-sm text-ink/55">
        No transactions yet. Buy your first fraction to see the on-chain proof
        here.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-[22px] bg-canvas p-6">
      <p className="text-sm text-ink/55">
        Connect your wallet to see your transaction history.
      </p>
      <Button onClick={openConnectModal}>Connect Wallet</Button>
    </div>
  );
}

export function TxHistory({
  transactions,
  connected,
}: {
  transactions: TxRecord[];
  connected: boolean;
}) {
  return (
    <Card className="flex flex-col gap-6 p-7">
      <h3 className="text-2xl font-semibold tracking-tight">
        Transaction History
      </h3>

      {connected && transactions.length > 0 ? (
        <ul className="flex flex-col gap-3">
          {transactions.map((tx) => (
            <li key={tx.id}>
              <a
                href={explorerTxUrl(tx.hash)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-wrap items-center justify-between gap-4 rounded-[22px] bg-canvas px-5 py-4 transition-colors hover:bg-blossom-soft/50"
              >
                <span className="flex items-center gap-4">
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${kindStyles[tx.kind]}`}
                  />
                  <span>
                    <span className="block text-sm font-semibold">
                      {tx.detail}
                    </span>
                    <span className="block text-xs text-ink/45">
                      {tx.title} · {formatTime(tx.timestamp)} · {NETWORK_NAME}
                    </span>
                  </span>
                </span>
                <span className="flex items-center gap-2 text-xs text-ink/45">
                  <span className="font-mono">{shortenHex(tx.hash)}</span>
                  <ExternalIcon label="Open in Arbiscan" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState connected={connected} />
      )}
    </Card>
  );
}
