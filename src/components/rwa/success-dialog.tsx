"use client";

import Image from "next/image";
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
      className="m-auto w-[min(92vw,26rem)] rounded-[30px] bg-stone-200 p-1.5 text-ink backdrop:bg-ink/50 backdrop:backdrop-blur-sm motion-safe:open:animate-dialog-in motion-safe:open:backdrop:animate-fade-in"
    >
      {record ? (
        <div className="flex flex-col gap-7 rounded-[24px] bg-white p-7">
          <h2 className="text-center text-2xl font-semibold tracking-tight">
            Transaction Successful!
          </h2>

          <div className="relative grid h-40 place-items-center overflow-hidden rounded-[22px] bg-lilac">
            <span className="absolute h-28 w-28 rounded-full bg-white/40" />
            <Image
              src="/assets/3d-bangunan.png"
              alt=""
              width={1371}
              height={1147}
              className="relative h-28 w-auto object-contain"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-ink/10 pt-5 text-center">
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

          <div className="grid grid-cols-2 gap-3">
            <Button variant="blossom" onClick={onClose}>
              Keep Investing
            </Button>
            <a
              href={explorerTxUrl(record.hash)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-blossom-soft px-5 py-3 text-center text-sm font-semibold hover:bg-blossom"
            >
              View Transaction
            </a>
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
