"use client";

import { useState } from "react";
import { formatNumber, getChangeColor } from "@/lib/utils";

function getLogo(symbol: string): string {
  return `https://s3-symbol-logo.tradingview.com/${symbol}.svg`;
}

interface Props {
  symbol: string;
  price?: number | null;
  change?: number | null;
  changePercent?: number | null;
  onClick?: () => void;
  size?: "sm" | "md";
  showPrice?: boolean;
}

export default function StockTicker({ symbol, price, change, changePercent, onClick, size = "sm", showPrice = true }: Props) {
  const [logoErr, setLogoErr] = useState(false);
  const isSm = size === "sm";
  return (
    <button onClick={onClick} className={`flex items-center gap-${isSm ? "1.5" : "2"} hover:opacity-80 transition-opacity text-left`}>
      <div className={`${isSm ? "w-5 h-5" : "w-8 h-8"} rounded${isSm ? "" : "-lg"} bg-surface-100 border border-surface-200 overflow-hidden flex items-center justify-center flex-shrink-0`}>
        {!logoErr ? (
          <img src={getLogo(symbol)} alt={symbol} className="w-full h-full object-contain p-0.5"
            onError={() => setLogoErr(true)} />
        ) : (
          <span className={`${isSm ? "text-[9px]" : "text-sm"} font-bold text-primary-400`}>{symbol.charAt(0)}</span>
        )}
      </div>
      <div className="min-w-0">
        <p className={`${isSm ? "text-[11px]" : "text-sm"} font-semibold text-text-primary leading-tight`}>{symbol}</p>
        {showPrice && price != null && (
          <p className={`${isSm ? "text-[9px]" : "text-[10px]"} font-mono ${getChangeColor(change)}`}>
            {formatNumber(price)} {change != null && (change >= 0 ? "▲" : "▼")} {changePercent != null ? `${Math.abs(changePercent).toFixed(2)}%` : ""}
          </p>
        )}
      </div>
    </button>
  );
}
