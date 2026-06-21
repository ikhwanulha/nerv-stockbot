"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import TickerTape from "@/components/TickerTape";
import StockChart from "@/components/StockChart";
import StockDetailModal from "@/components/StockDetailModal";
import { BarChart3, Search } from "lucide-react";

export default function ChartPage() {
  const [symbol, setSymbol] = useState("BBCA");
  const [inputSymbol, setInputSymbol] = useState("BBCA");
  const [selectedStock, setSelectedStock] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <TickerTape />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-bold text-text-primary">Chart Analysis</h1>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputSymbol}
                onChange={(e) => setInputSymbol(e.target.value.toUpperCase())}
                className="w-24 px-2 py-1.5 text-sm rounded-lg bg-surface-100 border border-surface-300 text-text-primary"
                placeholder="BBCA"
                onKeyDown={(e) => e.key === "Enter" && setSymbol(inputSymbol)}
              />
              <button
                onClick={() => setSymbol(inputSymbol)}
                className="p-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
              >
                <Search size={14} />
              </button>
              <button
                onClick={() => setSelectedStock(symbol)}
                className="px-3 py-1.5 text-xs bg-surface-200 hover:bg-surface-300 text-text-secondary rounded-lg transition-colors"
              >
                Detail
              </button>
            </div>
          </div>

          {/* Chart */}
          <div className="rounded-xl border border-surface-200 bg-surface/60 p-4">
            <StockChart symbol={symbol} height={500} showControls />
          </div>

          {/* Info panel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
            <div className="rounded-xl border border-surface-200 bg-surface/60 p-3">
              <p className="text-[10px] text-text-muted uppercase mb-1">Timeframe</p>
              <div className="flex gap-1">
                {["1D", "5D", "1M", "3M", "1Y", "5Y"].map((tf) => (
                  <button key={tf} className="px-2 py-1 text-xs rounded bg-surface-200 text-text-secondary hover:bg-surface-300 transition-colors">{tf}</button>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-surface-200 bg-surface/60 p-3">
              <p className="text-[10px] text-text-muted uppercase mb-1">Indikator</p>
              <div className="flex gap-1 flex-wrap">
                {["SMA", "EMA", "RSI", "MACD", "Bollinger", "Stochastic", "Ichimoku"].map((ind) => (
                  <button key={ind} className="px-2 py-1 text-xs rounded bg-surface-200 text-text-secondary hover:bg-surface-300 transition-colors">{ind}</button>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-surface-200 bg-surface/60 p-3">
              <p className="text-[10px] text-text-muted uppercase mb-1">Drawing Tools</p>
              <div className="flex gap-1 flex-wrap">
                {["Trendline", "Support", "Resistance", "Fib Retrace", "Channel"].map((tool) => (
                  <button key={tool} className="px-2 py-1 text-xs rounded bg-surface-200 text-text-secondary hover:bg-surface-300 transition-colors">{tool}</button>
                ))}
              </div>
            </div>
          </div>

          <p className="text-xs text-text-muted mt-3 italic">Chart menggunakan data historis dari Yahoo Finance. Data tertunda ~15 menit.</p>
        </main>
      </div>
      {selectedStock && <StockDetailModal symbol={selectedStock} onClose={() => setSelectedStock(null)} />}
    </div>
  );
}
