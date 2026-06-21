"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import TickerTape from "@/components/TickerTape";
import StockDetailModal from "@/components/StockDetailModal";
import { TVAdvancedChart } from "@/components/TradingViewWidgets";
import { formatNumber, formatPercent } from "@/lib/utils";
import { Signal, TrendingUp, TrendingDown, Filter, Search, ArrowUpDown, Clock, Target, Shield } from "lucide-react";

// ============================================================
// DATA SIGNAL LENGKAP
// ============================================================
const ALL_SIGNALS = [
  { symbol: "BBCA", name: "Bank Central Asia Tbk", entry: 9850, sl: 9750, tp: 10150, rr: "1:3", direction: "BUY" as const, valid: "24 Jam", reason: "Breakout resistance level 9.800 dengan volume tinggi. RSI menunjukkan momentum positif. Support teruji di 9.750.", confidence: 85 },
  { symbol: "BBRI", name: "Bank Rakyat Indonesia Tbk", entry: 5750, sl: 5650, tp: 5950, rr: "1:2", direction: "BUY" as const, valid: "24 Jam", reason: "Golden Cross MA50 dan MA200. Volume meningkat 2x lipat dari rata-rata. Support kuat di 5.650.", confidence: 78 },
  { symbol: "BMRI", name: "Bank Mandiri Tbk", entry: 6200, sl: 6100, tp: 6400, rr: "1:2", direction: "BUY" as const, valid: "48 Jam", reason: "Support zone 6.150-6.200 teruji 3 kali. MACD bullish crossover. Target resistance 6.400.", confidence: 82 },
  { symbol: "GOTO", name: "GoTo Gojek Tokopedia Tbk", entry: 1200, sl: 1150, tp: 1300, rr: "1:2", direction: "SELL" as const, valid: "12 Jam", reason: "Bearish divergence pada RSI. Harga gagal menembus resistance 1.250. Volume menurun.", confidence: 72 },
  { symbol: "ADRO", name: "Adaro Energy Tbk", entry: 2850, sl: 2750, tp: 3050, rr: "1:2", direction: "BUY" as const, valid: "48 Jam", reason: "Volume spike 3x rata-rata. Support di 2.800 teruji. Momentum positif dari sektor batu bara.", confidence: 80 },
  { symbol: "TLKM", name: "Telkom Indonesia Tbk", entry: 3200, sl: 3100, tp: 3400, rr: "1:2", direction: "SELL" as const, valid: "24 Jam", reason: "Resistance zone 3.200. Overbought RSI. Volume distribusi meningkat.", confidence: 68 },
  { symbol: "ASII", name: "Astra International Tbk", entry: 6200, sl: 6050, tp: 6500, rr: "1:3", direction: "BUY" as const, valid: "48 Jam", reason: "Cup and handle pattern. Volume akumulasi meningkat. Target Fibonacci extension 6.500.", confidence: 75 },
  { symbol: "BYAN", name: "Bayan Resources Tbk", entry: 18500, sl: 18000, tp: 19500, rr: "1:2", direction: "SELL" as const, valid: "24 Jam", reason: "Double top pattern di 19.000. RSI bearish divergence. Volume menurun.", confidence: 65 },
  { symbol: "CPIN", name: "Charoen Pokphand Tbk", entry: 4800, sl: 4650, tp: 5050, rr: "1:1.67", direction: "BUY" as const, valid: "48 Jam", reason: "Bull flag pattern. Volume meningkat. Support kuat di 4.700.", confidence: 72 },
  { symbol: "EXCL", name: "XL Axiata Tbk", entry: 2100, sl: 2025, tp: 2250, rr: "1:2", direction: "BUY" as const, valid: "24 Jam", reason: "Breakout ascending triangle. Volume tinggi. Target 2.250.", confidence: 78 },
];

export default function SignalsPage() {
  const [signals] = useState(ALL_SIGNALS);
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [expandedSignal, setExpandedSignal] = useState<string | null>(null);
  const [directionFilter, setDirectionFilter] = useState<"all" | "BUY" | "SELL">("all");
  const [sortField, setSortField] = useState("symbol");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [searchSymbol, setSearchSymbol] = useState("");

  const filtered = signals
    .filter(s => directionFilter === "all" || s.direction === directionFilter)
    .filter(s => s.symbol.includes(searchSymbol.toUpperCase()));

  const sorted = [...filtered].sort((a, b) => {
    const aVal = (a as any)[sortField] ?? "";
    const bVal = (b as any)[sortField] ?? "";
    return sortDir === "asc" ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
  });

  const handleSort = (field: string) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <TickerTape />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-bold text-text-primary flex items-center gap-2">
              <Signal size={18} className="text-primary-400" /> Signal Trading
            </h1>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-text-muted" />
                <input type="text" value={searchSymbol} onChange={e => setSearchSymbol(e.target.value.toUpperCase())}
                  placeholder="Cari saham..." className="w-28 lg:w-36 pl-6 pr-2 py-1 text-[11px] rounded-lg bg-surface-100 border border-surface-300 text-text-primary" />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <Filter size={14} className="text-text-muted" />
            {(["all", "BUY", "SELL"] as const).map((d) => (
              <button key={d} onClick={() => setDirectionFilter(d)}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${
                  directionFilter === d
                    ? d === "BUY" ? "bg-green-500/20 text-green-400" : d === "SELL" ? "bg-red-500/20 text-red-400" : "bg-primary-900/30 text-primary-400"
                    : "text-text-muted hover:text-text-primary hover:bg-surface-200"
                }`}>
                {d === "all" ? "Semua" : d === "BUY" ? "▲ BUY" : "▼ SELL"} ({d === "all" ? signals.length : signals.filter(s => s.direction === d).length})
              </button>
            ))}
          </div>

          {/* Signal Cards */}
          <div className="space-y-2">
            {sorted.map((sig) => (
              <div key={sig.symbol} className="rounded-xl border border-surface-200 bg-surface/60 overflow-hidden hover:border-surface-300 transition-all">
                <button
                  onClick={() => setExpandedSignal(expandedSignal === sig.symbol ? null : sig.symbol)}
                  className="w-full text-left p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold
                        ${sig.direction === "BUY" ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"}`}>
                        {sig.direction === "BUY" ? "▲" : "▼"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-text-primary">{sig.symbol}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                            sig.direction === "BUY" ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"
                          }`}>{sig.direction}</span>
                        </div>
                        <p className="text-[10px] text-text-muted">{sig.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 lg:gap-6">
                      <div className="text-right hidden sm:block">
                        <p className="text-[9px] text-text-muted">Entry</p>
                        <p className="text-xs font-mono font-semibold text-text-primary">{formatNumber(sig.entry)}</p>
                      </div>
                      <div className="text-right hidden md:block">
                        <p className="text-[9px] text-text-muted">SL</p>
                        <p className="text-xs font-mono text-red-400">{formatNumber(sig.sl)}</p>
                      </div>
                      <div className="text-right hidden md:block">
                        <p className="text-[9px] text-text-muted">TP</p>
                        <p className="text-xs font-mono text-green-400">{formatNumber(sig.tp)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] text-text-muted">R:R</p>
                        <p className="text-xs font-mono text-text-primary">{sig.rr}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] text-text-muted">Keyakinan</p>
                        <p className="text-xs font-mono"
                          style={{ color: sig.confidence >= 80 ? "#22c55e" : sig.confidence >= 70 ? "#eab308" : "#ef4444" }}>
                          {sig.confidence}%
                        </p>
                      </div>
                    </div>
                  </div>
                </button>

                {/* Expanded detail */}
                {expandedSignal === sig.symbol && (
                  <div className="px-4 pb-4 border-t border-surface-200 animate-fade-in">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-3">
                      {/* Detail Chart */}
                      <div className="rounded-lg border border-surface-200 bg-surface/50 overflow-hidden" style={{ height: "300px" }}>
                        <TVAdvancedChart symbol={`IDX:${sig.symbol}`} />
                      </div>
                      {/* Detail Info */}
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-2">
                          <div className="p-2 rounded-lg bg-surface-100">
                            <p className="text-[9px] text-text-muted">Entry Price</p>
                            <p className="text-sm font-bold font-mono text-text-primary">{formatNumber(sig.entry)}</p>
                          </div>
                          <div className="p-2 rounded-lg bg-surface-100">
                            <p className="text-[9px] text-text-muted">Stop Loss</p>
                            <p className="text-sm font-bold font-mono text-red-400">{formatNumber(sig.sl)}</p>
                          </div>
                          <div className="p-2 rounded-lg bg-surface-100">
                            <p className="text-[9px] text-text-muted">Take Profit</p>
                            <p className="text-sm font-bold font-mono text-green-400">{formatNumber(sig.tp)}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <div className="p-2 rounded-lg bg-surface-100">
                            <p className="text-[9px] text-text-muted">Risk per Lot</p>
                            <p className="text-xs font-mono text-text-primary">Rp{formatNumber((sig.entry - sig.sl) * 100)}</p>
                          </div>
                          <div className="p-2 rounded-lg bg-surface-100">
                            <p className="text-[9px] text-text-muted">Reward per Lot</p>
                            <p className="text-xs font-mono text-text-primary">Rp{formatNumber((sig.tp - sig.entry) * 100)}</p>
                          </div>
                          <div className="p-2 rounded-lg bg-surface-100">
                            <p className="text-[9px] text-text-muted">Risk:Reward</p>
                            <p className="text-xs font-mono text-text-primary">{sig.rr}</p>
                          </div>
                        </div>

                        {/* Confidence bar */}
                        <div>
                          <div className="flex justify-between text-[10px] text-text-muted mb-1">
                            <span>Tingkat Keyakinan</span>
                            <span>{sig.confidence}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-surface-200 overflow-hidden">
                            <div className={`h-full rounded-full transition-all ${
                              sig.confidence >= 80 ? "bg-green-500" : sig.confidence >= 70 ? "bg-yellow-500" : "bg-red-500"
                            }`} style={{ width: `${sig.confidence}%` }} />
                          </div>
                        </div>

                        <div className="p-3 rounded-lg bg-surface-100 border border-surface-200">
                          <p className="text-[9px] text-text-muted mb-1">🔍 Alasan Sinyal</p>
                          <p className="text-xs text-text-secondary leading-relaxed">{sig.reason}</p>
                        </div>

                        <div className="flex items-center gap-3 text-[10px] text-text-muted">
                          <span className="flex items-center gap-1"><Clock size={12} /> Valid: {sig.valid}</span>
                          <span className="flex items-center gap-1"><Shield size={12} /> Diversifikasi dianjurkan</span>
                        </div>

                        <div className="p-2 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
                          <p className="text-[9px] text-yellow-400/70 italic">
                            ⚠️ Sinyal ini bukan saran investasi. Selalu lakukan analisis sendiri sebelum mengambil keputusan.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Disclaimer */}
          <div className="mt-6 p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
            <p className="text-xs text-blue-400/70 leading-relaxed">
              📊 Sinyal trading dihasilkan berdasarkan analisis teknikal dan fundamental otomatis. Akurasi tidak dijamin 100%.
              Selalu gunakan manajemen risiko yang baik. Tidak ada jaminan keuntungan.
            </p>
          </div>
        </main>
      </div>
      {selectedStock && <StockDetailModal symbol={selectedStock} onClose={() => setSelectedStock(null)} />}
    </div>
  );
}
