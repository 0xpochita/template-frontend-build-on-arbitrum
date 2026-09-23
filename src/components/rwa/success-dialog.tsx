"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui";
import { explorerTxUrl, shortenHex, type TxRecord } from "@/lib/rwa";

export function SuccessDialog({
  record,
  onClose,
}: {
  record: TxRecord | null;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (record && !dialog.open) dialog.showModal();
    if (!record && dialog.open) dialog.close();
  }, [record]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="m-auto w-[min(92vw,26rem)] rounded-[32px] bg-ink p-4 text-ink backdrop:bg-ink/50 backdrop:backdrop-blur-sm"
    >
      {record ? (
        <div className="flex flex-col gap-7 rounded-[24px] bg-white p-7">
          <h2 className="text-4xl font-semibold leading-[1.05] tracking-tight">
            Transaction
            <br />
            Successful!
          </h2>

          <div className="flex gap-2">
            {[0, 1, 2, 3].map((index) => (
              <span
                key={index}
                className="h-12 w-12 rounded-full border-2 border-blossom"
                style={{ marginLeft: index === 0 ? 0 : "-1.75rem" }}
              />
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-ink/10 pt-5">
            <div>
              <p className="text-xs text-ink/50">{record.title}</p>
              <p className="mt-1 text-sm font-semibold">{record.detail}</p>
            </div>
            <div>
              <p className="text-xs text-ink/50">Tx Hash</p>
              <p className="mt-1 font-mono text-sm font-semibold">
                {shortenHex(record.hash)}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="blossom" onClick={onClose}>
              Keep Investing
            </Button>
            <a
              href={explorerTxUrl(record.hash)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-blossom-soft px-5 py-3 text-sm font-semibold hover:bg-blossom"
            >
              View on Arbiscan ↗
            </a>
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
