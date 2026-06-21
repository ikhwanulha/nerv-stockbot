import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility untuk merge Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format angka dengan separator ribuan
export function formatNumber(num: number | null | undefined, decimals = 0): string {
  if (num === null || num === undefined) return "-";
  return new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

// Format mata uang Rupiah
export function formatCurrency(num: number | null | undefined): string {
  if (num === null || num === undefined) return "-";
  if (Math.abs(num) >= 1_000_000_000_000) {
    return `Rp${(num / 1_000_000_000_000).toFixed(2)}T`;
  }
  if (Math.abs(num) >= 1_000_000_000) {
    return `Rp${(num / 1_000_000_000).toFixed(2)}M`;
  }
  if (Math.abs(num) >= 1_000_000) {
    return `Rp${(num / 1_000_000).toFixed(0)}M`;
  }
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

// Format persentase
export function formatPercent(num: number | null | undefined): string {
  if (num === null || num === undefined) return "-";
  const sign = num > 0 ? "+" : "";
  return `${sign}${num.toFixed(2)}%`;
}

// Format volume (ribuan, jutaan)
export function formatVolume(num: number | null | undefined): string {
  if (num === null || num === undefined) return "-";
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(2)}B`;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

// Format tanggal ke format Indonesia
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Format waktu
export function formatTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Format datetime
export function formatDateTime(date: Date | string): string {
  const d = new Date(date);
  return `${formatDate(d)} ${formatTime(d)}`;
}

// Warna berdasarkan perubahan
export function getChangeColor(change: number | null | undefined): string {
  if (change === null || change === undefined) return "text-text-muted";
  if (change > 0) return "text-gain";
  if (change < 0) return "text-loss";
  return "text-text-muted";
}

// Ikon berdasarkan perubahan
export function getChangeIcon(change: number | null | undefined): string {
  if (change === null || change === undefined) return "➡️";
  if (change > 0) return "▲";
  if (change < 0) return "▼";
  return "➡️";
}

// Generate random ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

// Delay helper
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
