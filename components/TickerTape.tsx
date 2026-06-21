"use client";

import { useEffect, useState, useRef } from "react";
import { useTheme } from "@/providers/ThemeProvider";
import { getChangeColor, getChangeIcon, formatPercent, formatNumber } from "@/lib/utils";
import { X, Play, Pause, TrendingUp } from "lucide-react";

interface TickerItem {
  symbol: string;
  price: number | null;
  change: number | null;
  changePercent: number | null;
}

const DEFAULT_TICKERS = [
  "BBCA", "BBRI", "BMRI", "BYAN", "TLKM", "ASII", "ADRO", "GOTO",
  "UNVR", "CPIN", "ANTM", "PGAS", "EXCL", "ISAT", "ACES", "KLBF",
];

export default function TickerTape() {
  const { tickerEnabled, setTickerEnabled } = useTheme();
  const [tickers, setTickers] = useState<TickerItem[]>([]);
  const [paused, setPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!tickerEnabled) return;

    const fetchTickers = async () => {
      try {
        const res = await fetch(
          `/api/stocks?action=quotes&symbols=${DEFAULT_TICKERS.join(",")}`
        );
        if (res.ok) {
          const data = await res.json();
          setTickers(data);
        }
      } catch {
        // Fallback dummy data
        setTickers(
          DEFAULT_TICKERS.map((s) => ({
            symbol: s,
            price: 1000 + Math.random() * 50000,
            change: (Math.random() - 0.5) * 200,
            changePercent: (Math.random() - 0.5) * 4,
          }))
        );
      }
    };

    fetchTickers();
    const interval = setInterval(fetchTickers, 30000); // Refresh setiap 30 detik
    return () => clearInterval(interval);
  }, [tickerEnabled]);

  if (!tickerEnabled) return null;

  // Duplikasi untuk efek marquee tak terbatas
  const displayItems = [...tickers, ...tickers];

  return (
    <div className="relative border-b border-surface-200 bg-surface/80 overflow-hidden h-9">
      {/* Kontrol */}
      <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center gap-1 px-2 bg-gradient-to-r from-surface via-surface/95 to-transparent">
        <TrendingUp size={12} className="text-primary-400" />
        <button
          onClick={() => setPaused(!paused)}
          className="p-0.5 rounded hover:bg-surface-200 text-text-muted hover:text-text-primary transition-colors"
          title={paused ? "Lanjutkan" : "Jeda"}
        >
          {paused ? <Play size={10} /> : <Pause size={10} />}
        </button>
      </div>

      {/* Marquee */}
      <div
        ref={containerRef}
        className={`h-full flex items-center overflow-hidden ${paused ? "" : ""}`}
      >
        <div
          className={`flex items-center gap-6 whitespace-nowrap ${
            paused ? "" : "animate-ticker"
          }`}
          style={{
            animationPlayState: paused ? "paused" : "running",
          }}
        >
          {displayItems.map((item, i) => (
            <div
              key={`${item.symbol}-${i}`}
              className="flex items-center gap-2 text-xs cursor-default"
            >
              <span className="font-semibold text-text-primary">{item.symbol}</span>
              <span className="font-mono tabular-nums text-text-primary">
                {formatNumber(item.price)}
              </span>
              <span className={`flex items-center gap-0.5 font-mono tabular-nums ${getChangeColor(item.change)}`}>
                {getChangeIcon(item.change)}
                {formatPercent(item.changePercent)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Close button */}
      <div className="absolute right-0 top-0 bottom-0 z-10 flex items-center px-2 bg-gradient-to-l from-surface via-surface/95 to-transparent">
        <button
          onClick={() => setTickerEnabled(false)}
          className="p-0.5 rounded hover:bg-surface-200 text-text-muted hover:text-text-primary transition-colors"
          title="Tutup ticker"
        >
          <X size={12} />
        </button>
      </div>
    </div>
  );
}
