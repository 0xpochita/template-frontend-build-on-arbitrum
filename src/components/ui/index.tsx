import type { ButtonHTMLAttributes, ReactNode } from "react";

const tones = {
  white: "bg-white",
  canvas: "bg-canvas",
  blossom: "bg-blossom",
  blossomSoft: "bg-blossom-soft",
  mint: "bg-mint",
  lilac: "bg-lilac",
  butter: "bg-butter",
  ink: "bg-ink text-canvas",
};

const variants = {
  dark: "bg-ink text-canvas hover:bg-ink/85",
  blossom: "bg-blossom text-ink hover:bg-blossom/80",
  soft: "bg-blossom-soft text-ink hover:bg-blossom",
  outline: "border border-ink/15 bg-white text-ink hover:border-ink/40",
};

export function Card({
  tone = "white",
  className = "",
  children,
}: {
  tone?: keyof typeof tones;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`rounded-[28px] ${tones[tone]} ${className}`}>
      {children}
    </div>
  );
}

export function ExternalIcon({ label }: { label: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5"
    >
      <title>{label}</title>
      <path d="M7 17 17 7" />
      <path d="M9 7h8v8" />
    </svg>
  );
}

export function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-ink/50">{label}</span>
      <span className="text-lg font-semibold tracking-tight">{value}</span>
      {hint ? <span className="text-xs text-ink/45">{hint}</span> : null}
    </div>
  );
}

export function Button({
  variant = "dark",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
}) {
  return (
    <button
      type="button"
      className={`rounded-full px-5 py-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}

export function Chip({
  active = false,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      type="button"
      className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
        active
          ? "bg-blossom text-ink"
          : "bg-blossom-soft/60 text-ink/70 hover:bg-blossom-soft"
      } ${className}`}
      {...props}
    />
  );
}
