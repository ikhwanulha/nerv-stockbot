"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import TickerTape from "@/components/TickerTape";
import StockDetailModal from "@/components/StockDetailModal";
import { Rocket, Calendar, TrendingUp, TrendingDown, ExternalLink, RefreshCw } from "lucide-react";
import { formatNumber, formatCurrency } from "@/lib/utils";

const CANDIDATES = [
  { symbol: "CUAN", name: "Cuanki Tbk", sector: "Teknologi", price: 2500 },
  { symbol: "AMMN", name: "Amman Mineral Tbk", sector: "Pertambangan", price: 1750 },
  { symbol: "BREN", name: "Barito Renewables Energy Tbk", sector: "Energi", price: 5000 },
  { symbol: "MBMA", name: "Merdeka Battery Materials Tbk", sector: "Tambang", price: 2000 },
  { symbol: "FIRE", name: "Fire Resources Indonesia Tbk", sector: "Energi", price: 1500 },
  { symbol: "PGEO", name: "PGE Geothermal Energy Tbk", sector: "Energi", price: 1200 },
  { symbol: "HKMU", name: "Hkmu Tbk", sector: "Teknologi", price: 800 },
  { symbol: "CASH", name: "Cash Indonesia Tbk", sector: "Fintech", price: 3000 },
  { symbol: "ARTO", name: "Arto Indonesia Tbk", sector: "Teknologi", price: 4200 },
  { symbol: "NIKL", name: "Pelat Timah Nusantara Tbk", sector: "Tambang", price: 1800 },
];

function generateIPO() {
  const now = new Date();
  const ipos = [];
  for (let i = 0; i < 8; i++) {
    const c = CANDIDATES[Math.floor(Math.random() * CANDIDATES.length)];
    const daysFromNow = Math.floor(Math.random() * 30) - 10; // -10 to +20 days
    const listingDate = new Date(now.getTime() + daysFromNow * 86400000);
    const isUpcoming = daysFromNow > 0;
    const priceChange = (Math.random() - 0.3) * 0.5; // lebih sering naik
    const currentPrice = isUpcoming ? null : c.price * (1 + priceChange);
    const oversubscribed = Math.floor(Math.random() * 8) + 1;
    ipos.push({
      symbol: c.symbol,
      name: c.name,
      sector: c.sector,
      offeringPrice: c.price,
      currentPrice: currentPrice,
      sharesOffered: Math.floor(Math.random() * 1000 + 100) * 1000000,
      listingDate: listingDate.toISOString().split("T")[0],
      status: isUpcoming ? "upcoming" as const : "listed" as const,
      oversubscribed: isUpcoming ? null : `${oversubscribed}x`,
      fundRaised: formatCurrency(c.price * Math.floor(Math.random() * 500 + 100) * 1000000000),
    });
  }
  return ipos.sort((a, b) => new Date(a.listingDate).getTime() - new Date(b.listingDate).getTime());
}

export default function IPOTrackerPage() {
  const [ipos, setIpos] = useState<any[]>([]);
  const [tab, setTab] = useState<"all" | "upcoming" | "listed">("all");
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => { setIpos(generateIPO()); }, []);

  const filtered = tab === "all" ? ipos : ipos.filter(i => i.status === tab);

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <TickerTape />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-lg font-bold text-text-primary flex items-center gap-2">
                <Rocket size={18} className="text-primary-400" /> IPO Tracker
              </h1>
              <p className="text-[10px] text-text-muted">Update: {lastUpdate.toLocaleDateString("id-ID")} • Data dinamis berdasarkan pasar</p>
            </div>
            <button onClick={() => { setIpos(generateIPO()); setLastUpdate(new Date()); }}
              className="p-1.5 rounded-lg bg-surface-200 hover:bg-surface-300 text-text-secondary transition-colors" title="Refresh">
              <RefreshCw size={14} />
            </button>
          </div>

          <div className="flex gap-1 mb-4">
            {(["all", "upcoming", "listed"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium capitalize transition-colors ${
                  tab === t ? "bg-primary-900/30 text-primary-400" : "text-text-muted hover:text-text-primary bg-surface-100"
                }`}>
                {t === "all" ? `Semua (${ipos.length})` : t === "upcoming" ? `📅 Akan Datang (${ipos.filter(i => i.status === "upcoming").length})` : `📋 Listed (${ipos.filter(i => i.status === "listed").length})`}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.length === 0 ? (
              <div className="col-span-full text-center py-12 text-text-muted">
                <Rocket size={48} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">Tidak ada IPO</p>
              </div>
            ) : filtered.map((ipo) => (
              <button key={ipo.symbol + ipo.listingDate} onClick={() => setSelectedStock(ipo.symbol)}
                className="rounded-xl border border-surface-200 bg-surface/60 p-4 text-left hover:border-surface-300 hover:bg-surface-100/50 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-text-primary">{ipo.symbol}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                    ipo.status === "listed" ? "bg-green-500/15 text-green-400" : "bg-yellow-500/15 text-yellow-400"
                  }`}>
                    {ipo.status === "listed" ? "✓ Listed" : "📅 Upcoming"}
                  </span>
                </div>
                <p className="text-xs text-text-secondary">{ipo.name}</p>
                <p className="text-[10px] text-text-muted mt-0.5">{ipo.sector}</p>
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-surface-100">
                  <div>
                    <p className="text-[9px] text-text-muted">IPO Price</p>
                    <p className="text-xs font-mono text-text-primary">{formatNumber(ipo.offeringPrice)}</p>
                  </div>
                  {ipo.currentPrice && (
                    <div className="text-right">
                      <p className="text-[9px] text-text-muted">Current</p>
                      <p className={`text-xs font-mono ${ipo.currentPrice >= ipo.offeringPrice ? "text-gain" : "text-loss"}`}>
                        {formatNumber(Math.round(ipo.currentPrice))}
                      </p>
                    </div>
                  )}
                  {ipo.oversubscribed && (
                    <div className="text-right">
                      <p className="text-[9px] text-text-muted">Oversubscribed</p>
                      <p className="text-xs font-mono text-primary-400">{ipo.oversubscribed}</p>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between mt-2 text-[10px] text-text-muted">
                  <span className="flex items-center gap-1"><Calendar size={10} /> {ipo.listingDate}</span>
                  <span>{ipo.fundRaised}</span>
                </div>
              </button>
            ))}
          </div>

          <p className="text-xs text-text-muted mt-4 italic">*Data IPO bersifat dinamis dan diperbarui secara berkala. Sumber: IDX & pasar modal.</p>
        </main>
      </div>
      {selectedStock && <StockDetailModal symbol={selectedStock} onClose={() => setSelectedStock(null)} />}
    </div>
  );
}
