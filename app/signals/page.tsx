"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import TickerTape from "@/components/TickerTape";
import StockDetailModal from "@/components/StockDetailModal";
import { formatNumber, formatPercent, getChangeColor } from "@/lib/utils";
import { Signal, TrendingUp, TrendingDown, Minus, Loader2 } from "lucide-react";

export default function SignalsPage() {
  const [signals, setSignals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "accumulation" | "distribution" | "scalping">("all");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stocks?action=signals");
      if (res.ok) {
        const data = await res.json();
        setSignals(data);
      }
    } catch (err) {
      console.error("Error fetching signals:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSignals = activeTab === "all" ? signals
    : activeTab === "scalping" ? signals.filter(s => s.score >= 50)
    : signals.filter(s => s.signal === activeTab);

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <TickerTape />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-bold text-text-primary">Signal Detector</h1>
            <button onClick={fetchData} disabled={loading} className="px-3 py-1.5 text-xs bg-surface-200 hover:bg-surface-300 rounded-lg transition-colors flex items-center gap-1">
              {loading && <Loader2 size={12} className="animate-spin" />}
              Refresh
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-4">
            {(["all", "accumulation", "distribution", "scalping"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors capitalize ${
                  activeTab === tab ? "bg-primary-900/30 text-primary-400" : "text-text-muted hover:text-text-primary hover:bg-surface-200"
                }`}
              >
                {tab === "all" ? "Semua" : tab === "accumulation" ? "📈 Akumulasi" : tab === "distribution" ? "📉 Distribusi" : "⚡ Scalping"}
              </button>
            ))}
          </div>

          {/* Signals List */}
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 size={24} className="animate-spin text-primary-400" />
            </div>
          ) : filteredSignals.length === 0 ? (
            <div className="text-center py-12 text-text-muted">
              <Signal size={48} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Tidak ada sinyal yang terdeteksi saat ini</p>
              <p className="text-xs mt-1">Data akan diperbarui otomatis</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredSignals.map((s: any) => (
                <button
                  key={s.symbol}
                  onClick={() => setSelectedStock(s.symbol)}
                  className="rounded-xl border border-surface-200 bg-surface/60 p-4 text-left hover:border-surface-300 hover:bg-surface-100/50 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-text-primary">{s.symbol}</span>
                      {s.signal === "accumulation" && <span className="text-xs px-1.5 py-0.5 rounded bg-green-500/15 text-green-400">Akumulasi</span>}
                      {s.signal === "distribution" && <span className="text-xs px-1.5 py-0.5 rounded bg-red-500/15 text-red-400">Distribusi</span>}
                      {s.signal === "neutral" && s.score >= 50 && <span className="text-xs px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-400">Scalping</span>}
                    </div>
                    <span className={`text-xs font-bold font-mono ${getChangeColor(s.changePercent)}`}>
                      {formatPercent(s.changePercent)}
                    </span>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-lg font-bold font-mono text-text-primary">{formatNumber(s.price)}</p>
                      <p className="text-[10px] text-text-muted mt-1">
                        Spread: {s.spread?.toFixed(3)}% • Score: {s.score}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-mono text-text-secondary">
                        Vol: {s.volume?.toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>

                  {/* Score bar */}
                  <div className="mt-2 h-1.5 rounded-full bg-surface-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        s.score >= 70 ? "bg-green-500" : s.score >= 40 ? "bg-yellow-500" : "bg-surface-400"
                      }`}
                      style={{ width: `${Math.min(s.score, 100)}%` }}
                    />
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Stats */}
          {signals.length > 0 && !loading && (
            <div className="mt-6 p-3 rounded-lg bg-surface-100/50 border border-surface-200">
              <p className="text-xs text-text-muted">
                📊 Akumulasi: {signals.filter(s => s.signal === "accumulation").length} • 
                Distribusi: {signals.filter(s => s.signal === "distribution").length} • 
                Scalping: {signals.filter(s => s.score >= 50).length} • 
                Total: {signals.length}
              </p>
            </div>
          )}
        </main>
      </div>

      {selectedStock && (
        <StockDetailModal symbol={selectedStock} onClose={() => setSelectedStock(null)} />
      )}
    </div>
  );
}
