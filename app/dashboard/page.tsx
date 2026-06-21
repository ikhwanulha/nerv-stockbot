"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "@/providers/ThemeProvider";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import TickerTape from "@/components/TickerTape";
import StockChart from "@/components/StockChart";
import AIAnalyst from "@/components/AIAnalyst";
import StockDetailModal from "@/components/StockDetailModal";
import NewsCard from "@/components/NewsCard";
import type { StockQuote, IndexData, NewsItem } from "@/types";
import { formatNumber, formatPercent, formatCurrency, formatVolume, getChangeColor, getChangeIcon } from "@/lib/utils";
import {
  TrendingUp, TrendingDown, Search, Signal, BookmarkCheck, Newspaper,
  Brain, BarChart3, Activity, GripVertical, Maximize2, Minimize2,
  RefreshCw, PieChart, Wallet, AlertTriangle
} from "lucide-react";

// ============================================================
// DASHBOARD WIDGET DEFINITIONS
// ============================================================
interface WidgetProps {
  onExpand?: () => void;
  onSelectStock?: (symbol: string) => void;
}

function MarketOverviewWidget({ onExpand }: WidgetProps) {
  const [indices, setIndices] = useState<Record<string, IndexData> | null>(null);

  useEffect(() => {
    fetch("/api/stocks?action=indices")
      .then((r) => r.json())
      .then(setIndices)
      .catch(() => {});
  }, []);

  const items = indices
    ? [indices.ihsg, indices.lq45, indices.idx30]
    : [{ symbol: "^JKSE", name: "IHSG", price: 7200, change: 30, changePercent: 0.42 }, { symbol: "LQ45", name: "LQ45", price: 950, change: 5, changePercent: 0.53 }, { symbol: "IDX30", name: "IDX30", price: 500, change: -2, changePercent: -0.4 }];

  return (
    <WidgetCard title="Market Overview" icon={BarChart3} onExpand={onExpand}>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.symbol} className="flex items-center justify-between p-2 rounded-lg bg-surface-50/50">
            <div>
              <p className="text-sm font-semibold text-text-primary">{item.name}</p>
              <p className="text-[10px] text-text-muted">{item.symbol}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold font-mono text-text-primary">{formatNumber(item.price)}</p>
              <p className={`text-xs font-mono ${getChangeColor(item.change)}`}>
                {getChangeIcon(item.change)} {formatNumber(item.change)} ({formatPercent(item.changePercent)})
              </p>
            </div>
          </div>
        ))}
      </div>
    </WidgetCard>
  );
}

function TopGainersLosersWidget({ onExpand, onSelectStock }: WidgetProps) {
  const [stocks, setStocks] = useState<StockQuote[]>([]);
  const [tab, setTab] = useState<"gainers" | "losers">("gainers");

  useEffect(() => {
    const symbols = ["BBCA", "BBRI", "BMRI", "BYAN", "TLKM", "ASII", "ADRO", "GOTO", "UNVR", "CPIN", "ANTM", "PGAS"];
    fetch(`/api/stocks?action=quotes&symbols=${symbols.join(",")}`)
      .then((r) => r.json())
      .then((data) => {
        const sorted = [...data].sort((a, b) => (b.changePercent || 0) - (a.changePercent || 0));
        setStocks(sorted);
      })
      .catch(() => {});
  }, []);

  const displayStocks = tab === "gainers"
    ? stocks.filter(s => (s.changePercent || 0) >= 0).slice(0, 5)
    : stocks.filter(s => (s.changePercent || 0) < 0).sort((a, b) => (a.changePercent || 0) - (b.changePercent || 0)).slice(0, 5);

  // Sparkline mini (dummy data)
  const MiniSparkline = ({ change }: { change: number | null }) => (
    <svg width="50" height="20" viewBox="0 0 50 20" className="flex-shrink-0">
      <polyline
        points={change && change > 0 ? "0,15 10,12 20,14 30,8 40,10 50,5" : "0,5 10,8 20,6 30,12 40,10 50,15"}
        fill="none"
        stroke={change && change > 0 ? "#22c55e" : "#ef4444"}
        strokeWidth="1.5"
      />
    </svg>
  );

  return (
    <WidgetCard title="Top Gainers / Losers" icon={TrendingUp} onExpand={onExpand}>
      <div className="flex gap-1 mb-2">
        <button onClick={() => setTab("gainers")} className={`px-2 py-1 text-xs rounded-md font-medium transition-colors ${tab === "gainers" ? "bg-green-500/20 text-green-400" : "text-text-muted hover:text-text-primary"}`}>Gainers</button>
        <button onClick={() => setTab("losers")} className={`px-2 py-1 text-xs rounded-md font-medium transition-colors ${tab === "losers" ? "bg-red-500/20 text-red-400" : "text-text-muted hover:text-text-primary"}`}>Losers</button>
      </div>
      <div className="space-y-1">
        {displayStocks.map((s) => (
          <button
            key={s.symbol}
            onClick={() => onSelectStock?.(s.symbol)}
            className="flex items-center justify-between w-full p-1.5 rounded-lg hover:bg-surface-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-text-primary w-12">{s.symbol}</span>
              <MiniSparkline change={s.change} />
            </div>
            <div className="text-right flex items-center gap-2">
              <span className="text-xs font-mono text-text-primary">{formatNumber(s.price)}</span>
              <span className={`text-xs font-mono ${getChangeColor(s.change)}`}>{formatPercent(s.changePercent)}</span>
            </div>
          </button>
        ))}
      </div>
    </WidgetCard>
  );
}

function NewsWidget({ onExpand }: WidgetProps) {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    fetch("/api/news?limit=3")
      .then((r) => r.json())
      .then(setNews)
      .catch(() => {});
  }, []);

  return (
    <WidgetCard title="Latest News" icon={Newspaper} onExpand={onExpand}>
      <div className="space-y-2">
        {news.map((item) => (
          <NewsCard key={item.id} news={item} />
        ))}
      </div>
    </WidgetCard>
  );
}

function WatchlistPreviewWidget({ onExpand, onSelectStock }: WidgetProps) {
  const [watchlistData, setWatchlistData] = useState<StockQuote[]>([]);
  const defaults = ["BBCA", "BBRI", "BMRI", "TLKM"];

  useEffect(() => {
    fetch(`/api/stocks?action=quotes&symbols=${defaults.join(",")}`)
      .then((r) => r.json())
      .then(setWatchlistData)
      .catch(() => {});
  }, []);

  return (
    <WidgetCard title="Watchlist Preview" icon={BookmarkCheck} onExpand={onExpand}>
      <div className="space-y-1">
        {watchlistData.map((s) => (
          <button
            key={s.symbol}
            onClick={() => onSelectStock?.(s.symbol)}
            className="flex items-center justify-between w-full p-1.5 rounded-lg hover:bg-surface-100 transition-colors"
          >
            <span className="text-xs font-semibold text-text-primary">{s.symbol}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-text-primary">{formatNumber(s.price)}</span>
              <span className={`text-xs font-mono ${getChangeColor(s.change)}`}>{formatPercent(s.changePercent)}</span>
            </div>
          </button>
        ))}
      </div>
    </WidgetCard>
  );
}

function QuickAccessWidget() {
  const links = [
    { icon: Search, label: "Screener", href: "/screener", color: "text-blue-400 bg-blue-500/10" },
    { icon: Signal, label: "Signals", href: "/signals", color: "text-purple-400 bg-purple-500/10" },
    { icon: BookmarkCheck, label: "Watchlist", href: "/watchlist", color: "text-emerald-400 bg-emerald-500/10" },
    { icon: Brain, label: "AI Chat", href: "/dashboard?chat=true", color: "text-orange-400 bg-orange-500/10" },
    { icon: Wallet, label: "Portfolio", href: "/portfolio", color: "text-cyan-400 bg-cyan-500/10" },
    { icon: Newspaper, label: "News", href: "/news", color: "text-yellow-400 bg-yellow-500/10" },
    { icon: BarChart3, label: "Chart", href: "/chart", color: "text-pink-400 bg-pink-500/10" },
    { icon: Activity, label: "Scanner", href: "/pattern-scanner", color: "text-indigo-400 bg-indigo-500/10" },
  ];

  return (
    <WidgetCard title="Quick Access" icon={Activity}>
      <div className="grid grid-cols-4 gap-2">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <a
              key={link.label}
              href={link.href}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg ${link.color} hover:opacity-80 transition-opacity`}
            >
              <Icon size={18} />
              <span className="text-[10px] font-medium">{link.label}</span>
            </a>
          );
        })}
      </div>
    </WidgetCard>
  );
}

function UnusualVolumeWidget({ onExpand, onSelectStock }: WidgetProps) {
  const [stocks, setStocks] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/stocks?action=quotes&symbols=BBCA,BBRI,BMRI,BYAN,TLKM,ADRO,GOTO,UNVR`)
      .then((r) => r.json())
      .then((data) => {
        const sorted = [...data].sort((a, b) => (b.volume || 0) - (a.volume || 0));
        setStocks(sorted.slice(0, 4));
      })
      .catch(() => {});
  }, []);

  return (
    <WidgetCard title="Unusual Volume" icon={AlertTriangle} onExpand={onExpand}>
      <div className="space-y-1">
        {stocks.map((s) => (
          <button key={s.symbol} onClick={() => onSelectStock?.(s.symbol)} className="flex items-center justify-between w-full p-1.5 rounded-lg hover:bg-surface-100 transition-colors">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-text-primary">{s.symbol}</span>
              <span className="text-[10px] px-1.5 rounded bg-yellow-500/15 text-yellow-400">🔥</span>
            </div>
            <span className="text-xs font-mono text-text-primary">{formatVolume(s.volume)}</span>
          </button>
        ))}
      </div>
    </WidgetCard>
  );
}

function NetForeignWidget() {
  const netForeign = 450_000_000_000;
  return (
    <WidgetCard title="Net Asing" icon={TrendingUp}>
      <div className="flex flex-col items-center justify-center h-full py-4">
        <p className="text-2xl font-bold font-mono text-green-400">+{formatCurrency(netForeign)}</p>
        <p className="text-[10px] text-text-muted mt-1">Hari ini</p>
      </div>
    </WidgetCard>
  );
}

function ChartWidget({ symbol, onExpand }: { symbol: string } & WidgetProps) {
  const [sym, setSym] = useState(symbol || "BBCA");
  return (
    <WidgetCard title={`Chart: ${sym}`} icon={BarChart3} onExpand={onExpand}>
      <div className="mb-2">
        <input
          type="text"
          value={sym}
          onChange={(e) => setSym(e.target.value.toUpperCase())}
          className="w-24 px-2 py-1 text-xs rounded bg-surface-100 border border-surface-300 text-text-primary focus:outline-none focus:border-primary-500"
          placeholder="BBCA"
          onKeyDown={(e) => e.key === "Enter" && setSym(sym)}
        />
      </div>
      <div className="h-[200px]">
        <StockChart symbol={sym} />
      </div>
    </WidgetCard>
  );
}

// ============================================================
// WIDGET CARD WRAPPER
// ============================================================
function WidgetCard({
  title,
  icon: Icon,
  children,
  onExpand,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  onExpand?: () => void;
}) {
  return (
    <div className="rounded-xl border border-surface-200 bg-surface/60 p-3 hover:border-surface-300 transition-all h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon size={14} className="text-primary-400" />
          <h3 className="text-xs font-semibold text-text-primary">{title}</h3>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-1 rounded hover:bg-surface-200 text-text-muted hover:text-text-primary cursor-grab">
            <GripVertical size={12} />
          </button>
          {onExpand && (
            <button onClick={onExpand} className="p-1 rounded hover:bg-surface-200 text-text-muted hover:text-text-primary" title="Expand">
              <Maximize2 size={12} />
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto">{children}</div>
    </div>
  );
}

// ============================================================
// LAYOUT CONFIGURATION
// ============================================================
const WIDGET_LAYOUTS = [
  { id: "market-overview", w: 2, h: 1, component: MarketOverviewWidget },
  { id: "gainers-losers", w: 2, h: 1, component: TopGainersLosersWidget },
  { id: "chart", w: 4, h: 2, component: (p: WidgetProps) => <ChartWidget symbol="BBCA" {...p} /> },
  { id: "news", w: 2, h: 2, component: NewsWidget },
  { id: "watchlist", w: 1, h: 1, component: WatchlistPreviewWidget },
  { id: "quick-access", w: 1, h: 1, component: QuickAccessWidget },
  { id: "unusual-volume", w: 1, h: 1, component: UnusualVolumeWidget },
  { id: "net-foreign", w: 1, h: 1, component: NetForeignWidget },
];

// ============================================================
// DASHBOARD PAGE
// ============================================================
function DashboardContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { sidebarOpen, tickerEnabled, theme } = useTheme();

  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [expandedWidget, setExpandedWidget] = useState<string | null>(null);
  const [showAIChat, setShowAIChat] = useState(searchParams.get("chat") === "true");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Redirect jika belum login
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  if (status === "loading" || !mounted) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-text-muted">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <TickerTape />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-lg font-bold text-text-primary">Dashboard</h1>
              <p className="text-xs text-text-muted">
                Selamat datang, {session?.user?.name || "Trader"} • {new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                className="p-2 rounded-lg hover:bg-surface-200 text-text-secondary hover:text-text-primary transition-colors"
                title="Refresh data"
              >
                <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
              </button>
            </div>
          </div>

          {/* Grid Widget */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3 auto-rows-auto">
            {WIDGET_LAYOUTS.map((widget) => {
              const Widget = widget.component;
              const colSpan = widget.w;
              const rowSpan = widget.h;

              // Expand mode
              if (expandedWidget === widget.id) {
                return (
                  <div key={widget.id} className="col-span-full row-span-full min-h-[400px]">
                    <div className="relative rounded-xl border border-surface-200 bg-surface/80 p-4">
                      <button
                        onClick={() => setExpandedWidget(null)}
                        className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-surface-200 text-text-muted hover:text-text-primary transition-colors"
                      >
                        <Minimize2 size={16} />
                      </button>
                      <Widget onExpand={() => setExpandedWidget(null)} onSelectStock={setSelectedStock} />
                    </div>
                  </div>
                );
              }

              const spanClass = colSpan > 1 ? `sm:col-span-${Math.min(colSpan, 2)} lg:col-span-${Math.min(colSpan, 4)} xl:col-span-${colSpan}` : "";

              return (
                <div key={widget.id} className={`${spanClass} ${rowSpan > 1 ? "row-span-1" : ""}`}>
                  <Widget onExpand={() => setExpandedWidget(widget.id)} onSelectStock={setSelectedStock} />
                </div>
              );
            })}

            {/* AI Analyst Widget */}
            <div className="col-span-full lg:col-span-2 xl:col-span-3">
              <div className="rounded-xl border border-surface-200 bg-surface/60 overflow-hidden">
                <div className="p-3 border-b border-surface-100 flex items-center gap-2">
                  <Brain size={14} className="text-emerald-400" />
                  <h3 className="text-xs font-semibold text-text-primary">AI Analyst</h3>
                  <span className="text-[10px] text-text-muted ml-auto">Powered by Groq Llama 3</span>
                </div>
                <div className="h-[300px]">
                  <AIAnalyst />
                </div>
              </div>
            </div>
          </div>

          {/* Data delay notice */}
          <div className="mt-6 p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
            <p className="text-xs text-yellow-400/70 text-center">
              ⚠️ Data harga saham tertunda sekitar 15-20 menit dari bursa (sumber: Yahoo Finance).
              Gunakan data ini untuk analisis, bukan untuk eksekusi transaksi real-time.
            </p>
          </div>
        </main>
      </div>

      {/* AI Chat Floating Button */}
      <AIAnalyst floating />

      {/* Stock Detail Modal */}
      {selectedStock && (
        <StockDetailModal
          symbol={selectedStock}
          onClose={() => setSelectedStock(null)}
        />
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-text-muted">Memuat dashboard...</p>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
