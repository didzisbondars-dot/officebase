import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number,
  currency = "USD",
  compact = false
): string {
  if (compact && amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (compact && amount >= 1_000) {
    return `$${(amount / 1_000).toFixed(0)}K`;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatArea(sqm: number): string {
  return new Intl.NumberFormat("en-US").format(sqm) + " sqm";
}

export function formatDate(dateStr?: string): string {
  if (!dateStr) return "TBA";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });
}

export function getStatusColor(status: string) {
  switch (status) {
    case "Available": return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Under construction": return "bg-amber-50 text-amber-700 border-amber-200";
    case "Fully leased out": return "bg-red-50 text-red-700 border-red-200";
    case "Planing stage": return "bg-blue-50 text-blue-700 border-blue-200";
    default: return "bg-gray-50 text-gray-700 border-gray-200";
  }
}

export function getStatusDot(status: string) {
  switch (status) {
    case "Available": return "bg-emerald-500";
    case "Under construction": return "bg-amber-500";
    case "Fully leased out": return "bg-red-500";
    case "Planing stage": return "bg-blue-500";
    default: return "bg-gray-400";
  }
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trimEnd() + "…";
}
