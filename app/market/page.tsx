"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import TickerTape from "@/components/TickerTape";
import StockDetailModal from "@/components/StockDetailModal";
import { formatNumber, formatPercent, formatVolume, formatCurrency, getChangeColor, cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, ChevronRight, Star, Search, MessageSquare, Wallet, Activity } from "lucide-react";
import { TVTickerTape } from "@/components/TradingViewWidgets";

// ============================================================
// DATA
// ============================================================

const MAIN_INDICES = [
  { symbol: "IHSG", name: "IHSG", price: 6177.14, change: 4.80, changePercent: 0.08, open: 6172.34, high: 6190.50, low: 6165.20, lots: { all: 125000, regular: 98000 }, value: 8.5e12, freq: 245000 },
  { symbol: "IDX30", name: "IDX30", price: 480.50, change: 2.15, changePercent: 0.45 },
  { symbol: "LQ45", name: "LQ45", price: 920.30, change: 3.80, changePercent: 0.41 },
  { symbol: "SRI-KEHATI", name: "SRI-KEHATI", price: 380.25, change: -1.20, changePercent: -0.31 },
];

const SECTORS = [
  { name: "FINANCE", change: 0.85, changePercent: 0.42 },
  { name: "CYCLICAL", change: -0.32, changePercent: -0.18 },
  { name: "ENERGY", change: 1.25, changePercent: 0.75 },
  { name: "NON-CYCLICAL", change: 0.15, changePercent: 0.08 },
  { name: "INDUSTRIAL", change: -0.45, changePercent: -0.22 },
  { name: "INFRASTRUCTURE", change: 0.55, changePercent: 0.31 },
  { name: "PROPERTY", change: -0.75, changePercent: -0.40 },
  { name: "TECHNOLOGY", change: 2.10, changePercent: 1.20 },
  { name: "BASIC-IND", change: 0.90, changePercent: 0.50 },
  { name: "HEALTH", change: -0.20, changePercent: -0.10 },
  { name: "TRANSPORT", change: 1.50, changePercent: 0.85 },
];

const GAINERS = [
  { symbol: "SDMU", name: "Sidomulyo Selaras Tbk.", price: 94, change: 24, changePercent: 34.29, volume: 125000000 },
  { symbol: "BCIC", name: "Bumi Citra Indah Tbk.", price: 205, change: 38, changePercent: 22.75, volume: 85000000 },
  { symbol: "ZONE", name: "Zona Bangun Persada Tbk.", price: 156, change: 26, changePercent: 20.00, volume: 65000000 },
];

const TOP_VOLUME = [
  { symbol: "GOTO", name: "GoTo Gojek Tokopedia Tbk.", price: 85, change: 3, changePercent: 3.66, volume: 2500000000 },
  { symbol: "BBCA", name: "Bank Central Asia Tbk.", price: 10250, change: 125, changePercent: 1.23, volume: 850000000 },
  { symbol: "BBRI", name: "Bank Rakyat Indonesia Tbk.", price: 5750, change: -25, changePercent: -0.43, volume: 720000000 },
];

const NET_FOREIGN_BUY = [
  { symbol: "BBCA", name: "Bank Central Asia Tbk.", price: 10250, change: 125, changePercent: 1.23, net: 850000000000 },
  { symbol: "BMRI", name: "Bank Mandiri Tbk.", price: 6200, change: 75, changePercent: 1.22, net: 450000000000 },
  { symbol: "BBRI", name: "Bank Rakyat Indonesia Tbk.", price: 5750, change: -25, changePercent: -0.43, net: 320000000000 },
];

const NET_FOREIGN_SELL = [
  { symbol: "GOTO", name: "GoTo Gojek Tokopedia Tbk.", price: 85, change: -5, changePercent: -5.56, net: -280000000000 },
  { symbol: "TLKM", name: "Telkom Indonesia Tbk.", price: 3200, change: -45, changePercent: -1.39, net: -195000000000 },
  { symbol: "UNVR", name: "Unilever Indonesia Tbk.", price: 2800, change: -35, changePercent: -1.23, net: -150000000000 },
];

const UNBOXING = [
  { symbol: "AMMN", title: "AMMN: When Passive Selling Eases", sector: "MET", image: "📊" },
  { symbol: "BDMN", title: "Integrasi BDMN-MUFG: Asymmetric Risk-Reward", sector: "FIN", image: "🏦" },
  { symbol: "BREN", title: "BREN: Energi Baru, Potensi Baru", sector: "ENG", image: "⚡" },
];

const COMMODITIES = [
  { name: "Crude Oil (OIL)", price: 78.50, change: 1.20, changePercent: 1.55, unit: "USD/bbl" },
  { name: "Brent Oil", price: 82.75, change: 1.05, changePercent: 1.28, unit: "USD/bbl" },
  { name: "Palm Oil (CPO)", price: 3850, change: 45, changePercent: 1.18, unit: "MYR/ton" },
  { name: "Newcastle Coal", price: 135.25, change: -2.50, changePercent: -1.82, unit: "USD/ton" },
  { name: "Gold (XAU)", price: 2350.50, change: 15.80, changePercent: 0.68, unit: "USD/oz" },
  { name: "Silver", price: 28.45, change: 0.35, changePercent: 1.24, unit: "USD/oz" },
  { name: "Nickel", price: 16250, change: -125, changePercent: -0.76, unit: "USD/ton" },
  { name: "Natural Gas", price: 2.85, change: 0.08, changePercent: 2.89, unit: "USD/MMBtu" },
];

const CURRENCIES = [
  { pair: "USD/IDR", price: 16200, change: -45, changePercent: -0.28 },
  { pair: "SGD/IDR", price: 12100, change: 15, changePercent: 0.12 },
  { pair: "EUR/IDR", price: 17650, change: 85, changePercent: 0.48 },
  { pair: "AUD/IDR", price: 10750, change: -20, changePercent: -0.19 },
  { pair: "CNY/IDR", price: 2250, change: 8, changePercent: 0.36 },
];

// ============================================================
// KOMPONEN
// ============================================================

function TabButton({ label, active, onClick, isNew }: { label: string; active: boolean; onClick: () => void; isNew?: boolean }) {
  return (
    <button onClick={onClick} className={cn("relative px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap", active ? "text-primary-400 border-b-2 border-primary-500" : "text-text-muted hover:text-text-primary border-b-2 border-transparent")}>
      {label}
      {isNew && <span className="absolute -top-0.5 -right-1 text-[8px] px-1 py-0.5 rounded bg-primary-500 text-white font-bold">NEW</span>}
    </button>
  );
}

function ChangeBadge({ value, percent, size = "sm" }: { value: number; percent: number; size?: "sm" | "md" | "lg" }) {
  const isUp = value >= 0;
  const sizeClass = size === "lg" ? "text-lg" : size === "md" ? "text-sm" : "text-xs";
  return (
    <span className={cn(`font-mono tabular-nums ${sizeClass}`, isUp ? "text-gain" : "text-loss")}>
      {isUp ? "▲" : "▼"} {formatNumber(Math.abs(value), 2)} ({formatPercent(Math.abs(percent))})
    </span>
  );
}

function MoversSection() {
  const [tab, setTab] = useState("gainer");
  const tabs = [
    { key: "gainer", label: "Top Gainer" },
    { key: "volume", label: "Top Volume" },
    { key: "frequency", label: "Top Frequency" },
    { key: "netbuy", label: "Net Foreign Buy" },
    { key: "netsell", label: "Net Foreign Sell" },
  ];

  const data: Record<string, any[]> = {
    gainer: GAINERS,
    volume: TOP_VOLUME,
    frequency: TOP_VOLUME,
    netbuy: NET_FOREIGN_BUY,
    netsell: NET_FOREIGN_SELL,
  };

  return (
    <SectionCard title="Pergerakan Saham" action="Selengkapnya >">
      <div className="flex gap-1 overflow-x-auto pb-2 mb-2 scrollbar-none">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={cn("px-2.5 py-1 text-[10px] rounded-lg font-medium whitespace-nowrap transition-colors", tab === t.key ? "bg-primary-900/40 text-primary-400" : "bg-surface-100 text-text-muted hover:text-text-primary")}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="space-y-1">
        {data[tab]?.map((item) => (
          <div key={item.symbol} className="flex items-center justify-between p-2 rounded-lg hover:bg-surface-100/50 transition-colors">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span className="text-xs font-bold text-text-primary">{item.symbol}</span>
              <span className="text-[9px] text-text-muted truncate hidden sm:block max-w-[120px]">{item.name}</span>
            </div>
            <div className="flex items-center gap-3 ml-2">
              <span className="text-xs font-mono text-text-primary">{formatNumber(item.price)}</span>
              <span className={cn("text-[10px] font-mono", item.change >= 0 ? "text-gain" : "text-loss")}>
                {item.change >= 0 ? "+" : ""}{item.change} ({formatPercent(Math.abs(item.changePercent))})
              </span>
              {item.net && <span className={cn("text-[10px] font-mono hidden md:block", item.net >= 0 ? "text-gain" : "text-loss")}>{formatCurrency(item.net)}</span>}
              {item.volume && <span className="text-[10px] font-mono text-text-muted hidden md:block">{formatVolume(item.volume)}</span>}
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function SectionCard({ title, action, children, className }: { title: string; action?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-xl border border-surface-200 bg-surface/60 p-3", className)}>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xs font-semibold text-text-primary">{title}</h2>
        {action && <button className="text-[10px] text-primary-400 hover:text-primary-300 flex items-center gap-0.5">{action} <ChevronRight size={10} /></button>}
      </div>
      {children}
    </div>
  );
}

function SectionCardFull({ title, action, children, className, id }: { title: string; action?: string; children: React.ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={cn("rounded-xl border border-surface-200 bg-surface/60 overflow-hidden", className)}>
      <div className="flex items-center justify-between p-3 border-b border-surface-200">
        <h2 className="text-sm font-bold text-text-primary">{title}</h2>
        {action && <button className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1">{action} <ChevronRight size={12} /></button>}
      </div>
      <div className="p-3">{children}</div>
    </section>
  );
}

// ============================================================
// MARKET PAGE
// ============================================================
export default function MarketPage() {
  const [activeTab, setActiveTab] = useState("MARKET");
  const [quoteData, setQuoteData] = useState<any>({});
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [moversTab, setMoversTab] = useState("gainer");

  // Fetch live quotes
  useEffect(() => {
    const symbols = ["BBCA","BBRI","BMRI","GOTO","TLKM","UNVR","ADRO","BYAN"];
    const fetchQuotes = async () => {
      try {
        const res = await fetch(`/api/stocks?action=quotes&symbols=${symbols.join(",")}`);
        if (res.ok) {
          const data = await res.json();
          const map: Record<string, any> = {};
          data.forEach((q: any) => { map[q.symbol] = q; });
          setQuoteData(map);
        }
      } catch {}
    };
    fetchQuotes();
    const interval = setInterval(fetchQuotes, 30000);
    return () => clearInterval(interval);
  }, []);

  const allSectors = [...SECTORS];
  const gainers = GAINERS;
  const volume = TOP_VOLUME;

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <TickerTape />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-3 lg:p-4 overflow-x-hidden pb-20 lg:pb-4">
          {/* Tab Navigasi */}
          <div className="flex gap-1 mb-3 overflow-x-auto border-b border-surface-200">
            {["MARKET", "GLOBAL", "BONDS", "REKSADANA"].map((tab) => (
              <TabButton key={tab} label={tab} active={activeTab === tab} onClick={() => setActiveTab(tab)} isNew={tab === "REKSADANA"} />
            ))}
          </div>

          {activeTab === "MARKET" && (
            <div className="space-y-3">
              {/* ============================================================ */}
              {/* HEADER IHSG */}
              {/* ============================================================ */}
              <SectionCardFull title="">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-xl font-bold text-text-primary">IHSG</h1>
                      <span className="text-2xl font-bold font-mono text-text-primary">{formatNumber(MAIN_INDICES[0].price, 2)}</span>
                    </div>
                    <ChangeBadge value={MAIN_INDICES[0].change} percent={MAIN_INDICES[0].changePercent} size="md" />
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-xs">
                    {[
                      { label: "Open", value: formatNumber(MAIN_INDICES[0].open, 2) },
                      { label: "High", value: formatNumber(MAIN_INDICES[0].high, 2) },
                      { label: "Low", value: formatNumber(MAIN_INDICES[0].low, 2) },
                      { label: "Lot Regular", value: formatVolume(MAIN_INDICES[0].lots.regular) },
                      { label: "Lot All", value: formatVolume(MAIN_INDICES[0].lots.all) },
                      { label: "Value", value: formatCurrency(MAIN_INDICES[0].value) },
                      { label: "Freq", value: formatVolume(MAIN_INDICES[0].freq) },
                    ].map((item) => (
                      <div key={item.label} className="bg-surface-100 rounded-lg p-2 text-center">
                        <p className="text-[9px] text-text-muted">{item.label}</p>
                        <p className="text-xs font-mono font-semibold text-text-primary">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Indeks Lainnya */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {MAIN_INDICES.slice(1).map((idx) => (
                    <div key={idx.symbol} className="flex items-center justify-between p-2 rounded-lg bg-surface-100">
                      <span className="text-xs font-semibold text-text-primary">{idx.symbol}</span>
                      <div className="text-right">
                        <span className="text-xs font-mono text-text-primary">{formatNumber(idx.price, 2)}</span>
                        <p className={`text-[10px] font-mono ${idx.change >= 0 ? "text-gain" : "text-loss"}`}>
                          {formatPercent(idx.changePercent)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCardFull>

              {/* ============================================================ */}
              {/* SEKTOR */}
              {/* ============================================================ */}
              <SectionCard title="Sektor" action="Selengkapnya >">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1.5">
                  {allSectors.map((s) => (
                    <div key={s.name} className={cn("flex items-center justify-between p-2 rounded-lg text-xs font-medium transition-colors", s.changePercent >= 0 ? "bg-green-500/5" : "bg-red-500/5")}>
                      <span className="text-text-primary">{s.name}</span>
                      <span className={`font-mono ${s.changePercent >= 0 ? "text-gain" : "text-loss"}`}>
                        {formatPercent(s.changePercent)}
                      </span>
                    </div>
                  ))}
                </div>
              </SectionCard>

              {/* ============================================================ */}
              {/* MOVERS */}
              {/* ============================================================ */}
              <MoversSection />

              {/* ============================================================ */}
              {/* UNBOXING SAHAM */}
              {/* ============================================================ */}
              <SectionCard title="Unboxing Saham" action="Selengkapnya >">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {UNBOXING.map((item) => (
                    <button key={item.symbol} onClick={() => setSelectedStock(item.symbol)}
                      className="p-3 rounded-lg bg-surface-100 hover:bg-surface-200 transition-colors text-left border border-surface-200 hover:border-surface-300">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{item.image}</span>
                        <span className="text-xs font-bold text-primary-400">{item.symbol}</span>
                        <span className="text-[9px] px-1 py-0.5 rounded bg-surface-200 text-text-muted">{item.sector}</span>
                      </div>
                      <p className="text-xs text-text-secondary leading-snug">{item.title}</p>
                    </button>
                  ))}
                </div>
              </SectionCard>
            </div>
          )}

          {activeTab === "GLOBAL" && (
            <div className="space-y-3">
              {/* ============================================================ */}
              {/* KOMODITAS */}
              {/* ============================================================ */}
              <SectionCardFull title="Komoditas">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {COMMODITIES.map((item) => (
                    <div key={item.name} className="flex items-center justify-between p-2 rounded-lg bg-surface-100">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-text-primary truncate">{item.name}</p>
                        <p className="text-[9px] text-text-muted">{item.unit}</p>
                      </div>
                      <div className="text-right ml-2">
                        <p className="text-xs font-mono text-text-primary">{formatNumber(item.price, 2)}</p>
                        <span className={`text-[10px] font-mono ${item.change >= 0 ? "text-gain" : "text-loss"}`}>
                          {item.change >= 0 ? "+" : ""}{formatNumber(item.change, 2)} ({formatPercent(Math.abs(item.changePercent))})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCardFull>

              {/* ============================================================ */}
              {/* MATA UANG */}
              {/* ============================================================ */}
              <SectionCardFull title="Mata Uang (Kurs terhadap Rupiah)">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {CURRENCIES.map((item) => (
                    <div key={item.pair} className="flex items-center justify-between p-2 rounded-lg bg-surface-100">
                      <span className="text-xs font-semibold text-text-primary">{item.pair}</span>
                      <div className="text-right">
                        <span className="text-xs font-mono text-text-primary">{formatNumber(item.price, 2)}</span>
                        <p className={`text-[10px] font-mono ${item.change >= 0 ? "text-gain" : "text-loss"}`}>
                          {item.change >= 0 ? "+" : ""}{formatNumber(item.change, 2)} ({formatPercent(Math.abs(item.changePercent))})
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCardFull>
            </div>
          )}

          {(activeTab === "BONDS" || activeTab === "REKSADANA") && (
            <div className="flex items-center justify-center py-20 text-text-muted">
              <div className="text-center">
                <Activity size={48} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">Fitur {activeTab} sedang dalam pengembangan</p>
                <p className="text-xs mt-1">Akan segera hadir</p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Stock Detail Modal */}
      {selectedStock && <StockDetailModal symbol={selectedStock} onClose={() => setSelectedStock(null)} />}
    </div>
  );
}
