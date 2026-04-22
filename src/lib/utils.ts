import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function shortenAddress(address: string, chars = 4): string {
  if (!address || address.length < 2 * chars + 2) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function formatNumber(num: number, decimals = 2): string {
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(decimals)}B`;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(decimals)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(decimals)}K`;
  return num.toFixed(decimals);
}

export function formatUSD(num: number): string {
  return `$${formatNumber(num)}`;
}

export function getScoreColor(score: number): string {
  if (score >= 75) return "#00FF88";
  if (score >= 50) return "#F5A623";
  if (score >= 25) return "#FF8800";
  return "#FF4444";
}

export function getTierColor(tier: string): string {
  const colors: Record<string, string> = {
    SAFE: "#00FF88",
    MODERATE: "#F5A623",
    RISKY: "#FF8800",
    DANGER: "#FF4444",
  };
  return colors[tier] || "#F5A623";
}

export function getTierBg(tier: string): string {
  const bgs: Record<string, string> = {
    SAFE: "rgba(0,255,136,0.1)",
    MODERATE: "rgba(245,166,35,0.1)",
    RISKY: "rgba(255,136,0,0.1)",
    DANGER: "rgba(255,68,68,0.1)",
  };
  return bgs[tier] || "rgba(245,166,35,0.1)";
}
