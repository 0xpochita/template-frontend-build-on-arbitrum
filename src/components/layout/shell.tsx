"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SuccessDialog } from "@/components/rwa/success-dialog";
import { useRwa } from "@/providers/rwa-provider";

const NAV_ITEMS = [
  { href: "/", label: "Invest" },
  { href: "/portfolio", label: "Portfolio" },
];

export function Shell({ children }: { children: ReactNode }) {
  const { receipt, clearReceipt } = useRwa();
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-canvas font-sans text-ink">
      <header className="sticky top-0 z-10 border-b border-ink/10 bg-canvas/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-5">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/assets/3d-bangunan.png"
              alt="ETHfrax"
              width={1371}
              height={1147}
              priority
              className="h-9 w-auto object-contain"
            />
            <p className="text-xl font-semibold tracking-tight">ETHfrax</p>
          </Link>

          <nav className="order-last flex w-full items-center gap-1 rounded-full bg-white p-1 text-sm font-medium md:order-none md:w-auto">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 transition-colors ${
                  pathname === item.href
                    ? "bg-ink text-canvas"
                    : "hover:bg-canvas"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <ConnectButton
            chainStatus="icon"
            accountStatus="address"
            showBalance={false}
          />
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-12">
        {children}
      </main>

      <SuccessDialog record={receipt} onClose={clearReceipt} />
    </div>
  );
}
