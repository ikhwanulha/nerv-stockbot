"use client";

import { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "@/providers/ThemeProvider";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import TickerTape from "@/components/TickerTape";
import AIAnalyst from "@/components/AIAnalyst";
import StockDetailModal from "@/components/StockDetailModal";
import NewsCard from "@/components/NewsCard";
import { formatNumber, formatPercent, formatVolume, getChangeColor } from "@/lib/utils";
import {
  TVAdvancedChart, TVSymbolInfo, TVMarketOverview,
  TVTechnicalAnalysis, TVFundamentalData, TVTickerTape
} from "@/components/TradingViewWidgets";
import TickerAutocomplete from "@/components/TickerAutocomplete";
import { DashboardSkeleton } from "@/components/SkeletonLoaders";
import { BarChart3, TrendingUp, BookmarkCheck, Brain, Search, TrendingDown, Signal as SignalIcon, RefreshCw } from "lucide-react";

// ============================================================
// DASHBOARD SIGNALS
// ============================================================
const SIGNALS = [
  { symbol: "BBCA", entry: 9850, sl: 9750, tp: 10150, rr: "1:3", direction: "BUY" as const, valid: "24 Jam", reason: "Breakout resistance, volume tinggi" },
  { symbol: "BMRI", entry: 6200, sl: 6100, tp: 6400, rr: "1:2", direction: "BUY" as const, valid: "24 Jam", reason: "Golden Cross, support teruji" },
  { symbol: "GOTO", entry: 1200, sl: 1150, tp: 1300, rr: "1:2", direction: "SELL" as const, valid: "12 Jam", reason: "Bearish divergence RSI" },
  { symbol: "ADRO", entry: 2850, sl: 2750, tp: 3050, rr: "1:2", direction: "BUY" as const, valid: "48 Jam", reason: "Volume spike, support kuat" },
  { symbol: "TLKM", entry: 3200, sl: 3100, tp: 3400, rr: "1:2", direction: "SELL" as const, valid: "24 Jam", reason: "Resistance zone, overbought" },
];

const WATCHLIST_DEFAULT = ["BBCA", "BBRI", "BMRI", "BYAN", "GOTO", "TLKM"];

// ============================================================
// WATCHLIST WIDGET
// ============================================================
function WatchlistPanel({ onSelectStock }: { onSelectStock: (s: string) => void }) {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch(`/api/stocks?action=quotes&symbols=${WATCHLIST_DEFAULT.join(",")}`)
      .then(r => r.json()).then(setQuotes).catch(() => {});
    const interval = setInterval(() => {
      fetch(`/api/stocks?action=quotes&symbols=${WATCHLIST_DEFAULT.join(",")}`)
        .then(r => r.json()).then(setQuotes).catch(() => {});
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const filtered = quotes.filter(q => q.symbol?.includes(searchTerm.toUpperCase()));
  const allWatchlistSymbols = [...WATCHLIST_DEFAULT, ...quotes.map(q => q.symbol)];

  return (
    <div className="rounded-xl border border-surface-200 bg-surface/60 overflow-hidden">
      <div className="p-3 border-b border-surface-200 flex items-center justify-between">
        <h3 className="text-xs font-semibold text-text-primary flex items-center gap-1.5">
          <BookmarkCheck size={14} className="text-primary-400" /> Watchlist
        </h3>
        <div className="relative">
          <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-text-muted" />
          <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Filter..."
            className="w-20 lg:w-28 pl-6 pr-2 py-1 text-[10px] rounded bg-surface-100 border border-surface-300 text-text-primary" />
        </div>
      </div>
      <div className="divide-y divide-surface-100 max-h-[300px] overflow-y-auto">
        {filtered.map((q) => (
          <button key={q.symbol} onClick={() => onSelectStock(q.symbol)}
            className="flex items-center justify-between w-full px-3 py-2 hover:bg-surface-100/50 transition-colors text-left">
            <div>
              <p className="text-xs font-semibold text-text-primary">{q.symbol}</p>
              <p className="text-[10px] text-text-muted truncate max-w-[100px]">{q.name || ""}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-mono tabular-nums text-text-primary">{formatNumber(q.price)}</p>
              <p className={`text-[10px] font-mono tabular-nums ${getChangeColor(q.change)}`}>
                {q.changePercent != null ? `${q.changePercent >= 0 ? "+" : ""}${q.changePercent?.toFixed(2)}%` : "-"}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// SIGNALS WIDGET
// ============================================================
function SignalsWidget({ onSelectStock }: { onSelectStock: (s: string) => void }) {
  return (
    <div className="rounded-xl border border-surface-200 bg-surface/60 overflow-hidden">
      <div className="p-3 border-b border-surface-200">
        <h3 className="text-xs font-semibold text-text-primary flex items-center gap-1.5">
          <SignalIcon size={14} className="text-orange-400" /> Sinyal Terbaru
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[10px]">
          <thead>
            <tr className="border-b border-surface-100 text-text-muted">
              <th className="text-left px-2 py-1.5 font-medium">Saham</th>
              <th className="text-right px-2 py-1.5 font-medium">Entry</th>
              <th className="text-right px-2 py-1.5 font-medium">SL</th>
              <th className="text-right px-2 py-1.5 font-medium">TP</th>
              <th className="text-right px-2 py-1.5 font-medium">R:R</th>
              <th className="text-center px-2 py-1.5 font-medium">Sinyal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100">
            {SIGNALS.map((sig) => (
              <tr key={sig.symbol} onClick={() => onSelectStock(sig.symbol)}
                className="hover:bg-surface-100/50 cursor-pointer transition-colors">
                <td className="px-2 py-2 font-semibold text-text-primary">{sig.symbol}</td>
                <td className="px-2 py-2 text-right font-mono text-text-primary">{formatNumber(sig.entry)}</td>
                <td className="px-2 py-2 text-right font-mono text-red-400">{formatNumber(sig.sl)}</td>
                <td className="px-2 py-2 text-right font-mono text-green-400">{formatNumber(sig.tp)}</td>
                <td className="px-2 py-2 text-right font-mono text-text-secondary">{sig.rr}</td>
                <td className="px-2 py-2 text-center">
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${
                    sig.direction === "BUY" ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"
                  }`}>
                    {sig.direction === "BUY" ? "▲ BUY" : "▼ SELL"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================
// NEWS PREVIEW WIDGET
// ============================================================
function NewsPreviewWidget({ onSelectStock }: { onSelectStock: (s: string) => void }) {
  const [news, setNews] = useState<any[]>([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    fetch(`/api/news?limit=10`).then(r => r.json()).then(setNews).catch(() => {});
    const interval = setInterval(() => {
      fetch(`/api/news?limit=10`).then(r => r.json()).then(setNews).catch(() => {});
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const visibleNews = news.slice(page * 5, (page + 1) * 5);
  const totalPages = Math.ceil(news.length / 5);

  return (
    <div className="rounded-xl border border-surface-200 bg-surface/60 overflow-hidden">
      <div className="p-3 border-b border-surface-200 flex items-center justify-between">
        <h3 className="text-xs font-semibold text-text-primary">Berita Terkini</h3>
        <div className="flex items-center gap-1">
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
            className="px-1.5 py-0.5 text-[10px] rounded bg-surface-200 text-text-muted disabled:opacity-30">‹</button>
          <span className="text-[10px] text-text-muted">{page + 1}/{totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
            className="px-1.5 py-0.5 text-[10px] rounded bg-surface-200 text-text-muted disabled:opacity-30">›</button>
          <span className="text-[10px] text-text-muted ml-1">Auto-refresh 60s</span>
        </div>
      </div>
      <div className="divide-y divide-surface-100">
        {visibleNews.map((item: any) => (
          <button key={item.id} onClick={() => item.relatedStocks?.[0] && onSelectStock(item.relatedStocks[0])}
            className="w-full text-left px-3 py-2 hover:bg-surface-100/50 transition-colors">
            <p className="text-[11px] text-text-primary leading-snug line-clamp-2">{item.title}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-[9px] px-1 rounded ${
                item.sentiment === "positive" ? "bg-green-500/15 text-green-400" :
                item.sentiment === "negative" ? "bg-red-500/15 text-red-400" : "bg-yellow-500/15 text-yellow-400"
              }`}>
                {item.sentiment === "positive" ? "📈" : item.sentiment === "negative" ? "📉" : "⚖️"}
              </span>
              {item.relatedStocks?.slice(0, 2).map((s: string) => (
                <span key={s} className="text-[9px] px-1 rounded bg-surface-200 text-primary-400 font-mono">{s}</span>
              ))}
              <span className="text-[9px] text-text-muted ml-auto">
                {new Date(item.publishedAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// DASHBOARD PAGE
// ============================================================
function DashboardContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { sidebarOpen } = useTheme();
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [chartSymbol, setChartSymbol] = useState("IDX:BBCA");
  const [inputSymbol, setInputSymbol] = useState("BBCA");
  const [activeTab, setActiveTab] = useState<string>("chart");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { if (status === "unauthenticated") router.push("/login"); }, [status]);

  if (status === "loading" || !mounted) {
    return <DashboardSkeleton />;
  }

  if (status === "unauthenticated") return null;

  const updateChartSymbol = () => {
    const s = inputSymbol.toUpperCase().replace("IDX:", "");
    setChartSymbol(s ? `IDX:${s}` : "IDX:BBCA");
  };

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <TickerTape />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-3 lg:p-4 overflow-x-hidden">
          {/* Symbol selector dengan autocomplete */}
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="w-40 lg:w-56">
                <TickerAutocomplete
                  onSelect={(symbol) => setChartSymbol(symbol)}
                  placeholder="Cari saham (BBCA, AAPL, BTC)..."
                  autoFocus
                />
              </div>
              <span className="text-[10px] text-text-muted hidden sm:inline">IDX:BBCA, NASDAQ:AAPL, BITSTAMP:BTCUSD</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setActiveTab("chart")}
                className={`px-2 py-1 text-[10px] rounded-lg ${activeTab === "chart" ? "bg-primary-900/30 text-primary-400" : "text-text-muted hover:text-text-primary"}`}>
                Chart
              </button>
              <button onClick={() => setActiveTab("technical")}
                className={`px-2 py-1 text-[10px] rounded-lg ${activeTab === "technical" ? "bg-primary-900/30 text-primary-400" : "text-text-muted hover:text-text-primary"}`}>
                Teknikal
              </button>
              <button onClick={() => setActiveTab("fundamental")}
                className={`px-2 py-1 text-[10px] rounded-lg ${activeTab === "fundamental" ? "bg-primary-900/30 text-primary-400" : "text-text-muted hover:text-text-primary"}`}>
                Fundamental
              </button>
            </div>
          </div>

          {/* Main grid: 12 columns */}
          <div className="grid grid-cols-12 gap-3">
            {/* LEFT: Chart + Info (8 cols) */}
            <div className="col-span-12 lg:col-span-8 space-y-3">
              {/* Symbol Info & Chart */}
              <div className="rounded-xl border border-surface-200 bg-surface/60 overflow-hidden">
                <TVSymbolInfo symbol={chartSymbol} />
              </div>
              <div className="rounded-xl border border-surface-200 bg-surface/60 overflow-hidden" style={{ height: "500px" }}>
                {activeTab === "chart" && <TVAdvancedChart symbol={chartSymbol} />}
                {activeTab === "technical" && <TVTechnicalAnalysis symbol={chartSymbol} />}
                {activeTab === "fundamental" && <TVFundamentalData symbol={chartSymbol} />}
              </div>

              {/* Market Overview */}
              <div className="rounded-xl border border-surface-200 bg-surface/60 overflow-hidden">
                <TVMarketOverview height={350} />
              </div>
            </div>

            {/* RIGHT: Watchlist + Signals + News (4 cols) */}
            <div className="col-span-12 lg:col-span-4 space-y-3">
              <WatchlistPanel onSelectStock={setSelectedStock} />
              <SignalsWidget onSelectStock={setSelectedStock} />
              <NewsPreviewWidget onSelectStock={setSelectedStock} />
            </div>
          </div>

          {/* Data delay notice */}
          <div className="mt-4 p-2 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
            <p className="text-[10px] text-yellow-400/70 text-center">
              ⚠️ Data saham dari TradingView bersifat real-time (update otomatis). Data dari Yahoo Finance tertunda ~15-20 menit.
            </p>
          </div>
        </main>
      </div>

      <AIAnalyst floating />
      {selectedStock && <StockDetailModal symbol={selectedStock} onClose={() => setSelectedStock(null)} />}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface flex items-center justify-center"><div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <DashboardContent />
    </Suspense>
  );
}
