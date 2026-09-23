import Image from "next/image";
import { Card, ExternalIcon, Stat } from "@/components/ui";
import { formatEth, ipfsUrl, NETWORK_NAME } from "@/lib/rwa";
import type { PropertyView } from "@/providers/rwa-provider";

export function AssetCard({ property }: { property: PropertyView }) {
  const sold = property.total - property.available;
  const soldPercent = property.total
    ? Math.round((sold / property.total) * 100)
    : 0;

  return (
    <Card className="flex w-full flex-col gap-6 p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold leading-none tracking-tight">
            {property.name || "Loading..."}
          </h2>
          <p className="mt-2 text-sm text-ink/55">{property.symbol}</p>
        </div>
        <span className="shrink-0 rounded-full bg-mint px-4 py-2 text-xs font-semibold">
          Verified RWA
        </span>
      </div>

      <div className="relative grid h-44 place-items-center overflow-hidden rounded-[22px] bg-lilac">
        <Image
          src="/assets/3d-bangunan.png"
          alt={property.name}
          width={1371}
          height={1147}
          priority
          className="h-32 w-auto object-contain"
        />
        <span className="absolute bottom-4 left-4 rounded-full bg-white/80 px-3 py-1.5 text-xs font-semibold">
          {NETWORK_NAME}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-medium text-ink/55">
            Fractions sold
          </span>
          <span className="text-sm font-semibold">
            {sold} / {property.total} Fractions
          </span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-ink/10">
          <div
            className="h-full rounded-full bg-blossom transition-[width] duration-500"
            style={{ width: `${soldPercent}%` }}
          />
        </div>
      </div>

      <div className="mt-auto grid grid-cols-2 gap-5 border-t border-ink/10 pt-5 sm:grid-cols-3">
        <Stat label="Available" value={`${property.available} Pcs`} />
        <Stat label="Price / Fraction" value={formatEth(property.price)} />
        <Stat
          label="Certificate"
          value={
            <a
              href={ipfsUrl(property.documentUri)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-medium text-ink/70 transition-colors hover:text-ink"
            >
              View Certificate
              <ExternalIcon label="Open certificate on IPFS" />
            </a>
          }
        />
      </div>
    </Card>
  );
}
