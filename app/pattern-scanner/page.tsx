"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import TickerTape from "@/components/TickerTape";
import StockDetailModal from "@/components/StockDetailModal";
import { Activity, CandlestickChart, TrendingUp, TrendingDown } from "lucide-react";
import { formatNumber, formatPercent } from "@/lib/utils";

const patterns = [
  { symbol: "BBCA", price: 10250, change: 1.2, pattern: "Golden Cross", timeframe: "Daily", bullish: true, confidence: 85 },
  { symbol: "BBRI", price: 5750, change: -0.5, pattern: "Bull Flag", timeframe: "1H", bullish: true, confidence: 72 },
  { symbol: "BMRI", price: 6800, change: 0.8, pattern: "Cup & Handle", timeframe: "Weekly", bullish: true, confidence: 78 },
  { symbol: "TLKM", price: 3200, change: -1.1, pattern: "Head & Shoulders", timeframe: "Daily", bullish: false, confidence: 65 },
  { symbol: "ADRO", price: 2850, change: 2.3, pattern: "Bullish Engulfing", timeframe: "Daily", bullish: true, confidence: 90 },
  { symbol: "GOTO", price: 85, change: 3.7, pattern: "Double Bottom", timeframe: "4H", bullish: true, confidence: 82 },
  { symbol: "ASII", price: 6200, change: -0.3, pattern: "Falling Wedge", timeframe: "Daily", bullish: true, confidence: 68 },
  { symbol: "BYAN", price: 18500, change: -2.1, pattern: "Death Cross", timeframe: "Daily", bullish: false, confidence: 75 },
];

export default function PatternScannerPage() {
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "bullish" | "bearish">("all");
  const filtered = filter === "all" ? patterns : patterns.filter(p => filter === "bullish" ? p.bullish : !p.bullish);

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <TickerTape />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 lg:p-6">
          <h1 className="text-lg font-bold text-text-primary mb-4">Pattern Scanner</h1>

          <div className="flex gap-1 mb-4">
            <button onClick={() => setFilter("all")} className={`px-3 py-1.5 text-xs rounded-lg ${filter === "all" ? "bg-primary-900/30 text-primary-400" : "text-text-muted"}`}>Semua ({patterns.length})</button>
            <button onClick={() => setFilter("bullish")} className={`px-3 py-1.5 text-xs rounded-lg flex items-center gap-1 ${filter === "bullish" ? "bg-green-500/20 text-green-400" : "text-text-muted"}`}><TrendingUp size={12} />Bullish</button>
            <button onClick={() => setFilter("bearish")} className={`px-3 py-1.5 text-xs rounded-lg flex items-center gap-1 ${filter === "bearish" ? "bg-red-500/20 text-red-400" : "text-text-muted"}`}><TrendingDown size={12} />Bearish</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filtered.map((p) => (
              <button key={p.symbol} onClick={() => setSelectedStock(p.symbol)}
                className="rounded-xl border border-surface-200 bg-surface/60 p-3 text-left hover:border-surface-300 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-text-primary">{p.symbol}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded flex items-center gap-1 ${p.bullish ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"}`}>
                    {p.bullish ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                    {p.bullish ? "Bullish" : "Bearish"}
                  </span>
                </div>
                <p className="text-xs font-semibold text-text-primary">{p.pattern}</p>
                <p className="text-[10px] text-text-muted mt-1">{p.timeframe}</p>
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-surface-100">
                  <span className="text-xs font-mono text-text-primary">{formatNumber(p.price)}</span>
                  <span className={`text-xs font-mono ${p.change >= 0 ? "text-green-400" : "text-red-400"}`}>{p.change >= 0 ? "+" : ""}{p.change}%</span>
                </div>
                {/* Confidence bar */}
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-surface-200 overflow-hidden">
                    <div className={`h-full rounded-full ${p.confidence >= 80 ? "bg-green-500" : p.confidence >= 60 ? "bg-yellow-500" : "bg-red-500"}`}
                      style={{ width: `${p.confidence}%` }} />
                  </div>
                  <span className="text-[10px] text-text-muted">{p.confidence}%</span>
                </div>
              </button>
            ))}
          </div>
        </main>
      </div>
      {selectedStock && <StockDetailModal symbol={selectedStock} onClose={() => setSelectedStock(null)} />}
    </div>
  );
}
