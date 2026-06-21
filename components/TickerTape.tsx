"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/providers/ThemeProvider";
import { X, Play, Pause, TrendingUp } from "lucide-react";

export default function TickerTape() {
  const { tickerEnabled, setTickerEnabled } = useTheme();
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!tickerEnabled) return;

    // Hapus TradingView widget lama jika ada
    const container = document.getElementById("tv-ticker-tape");
    if (container) container.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [
        { proName: "FOREXCOM:SPXUSD", title: "S&P 500" },
        { proName: "FOREXCOM:NSXUSD", title: "Nasdaq 100" },
        { proName: "BITSTAMP:BTCUSD", title: "Bitcoin" },
        { proName: "BITSTAMP:ETHUSD", title: "Ethereum" },
        { description: "BBCA", proName: "IDX:BBCA" },
        { description: "BBRI", proName: "IDX:BBRI" },
        { description: "BMRI", proName: "IDX:BMRI" },
        { description: "BYAN", proName: "IDX:BYAN" },
        { description: "TLKM", proName: "IDX:TLKM" },
        { description: "ASII", proName: "IDX:ASII" },
        { description: "ADRO", proName: "IDX:ADRO" },
        { description: "GOTO", proName: "IDX:GOTO" },
        { description: "UNVR", proName: "IDX:UNVR" },
        { description: "CPIN", proName: "IDX:CPIN" },
      ],
      showSymbolLogo: true,
      colorTheme: "dark",
      isTransparent: true,
      displayMode: "adaptive",
      locale: "id_ID",
    });
    container?.appendChild(script);

    return () => {
      try { script.remove(); } catch {}
    };
  }, [tickerEnabled]);

  if (!tickerEnabled) return null;

  return (
    <div className="relative border-b border-surface-200 bg-surface/80 overflow-hidden h-[50px]">
      <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center gap-1 px-2 bg-gradient-to-r from-surface via-surface/95 to-transparent">
        <TrendingUp size={12} className="text-primary-400" />
        <button onClick={() => setPaused(!paused)} className="p-0.5 rounded hover:bg-surface-200 text-text-muted hover:text-text-primary" title={paused ? "Lanjutkan" : "Jeda"}>
          {paused ? <Play size={10} /> : <Pause size={10} />}
        </button>
      </div>
      <div id="tv-ticker-tape" className="h-full" />
      <div className="absolute right-0 top-0 bottom-0 z-10 flex items-center px-2 bg-gradient-to-l from-surface via-surface/95 to-transparent">
        <button onClick={() => setTickerEnabled(false)} className="p-0.5 rounded hover:bg-surface-200 text-text-muted hover:text-text-primary" title="Tutup ticker">
          <X size={12} />
        </button>
      </div>
    </div>
  );
}
