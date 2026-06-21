"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import TickerTape from "@/components/TickerTape";
import StockDetailModal from "@/components/StockDetailModal";
import { Rocket, Calendar, TrendingUp } from "lucide-react";
import { formatNumber, formatCurrency } from "@/lib/utils";

const ipoData = [
  { symbol: "CUAN", name: "PT Cuanki Tbk", sector: "Teknologi", offeringPrice: 2500, currentPrice: 3200, sharesOffered: 500_000_000, listingDate: "2024-07-15", status: "upcoming" as const },
  { symbol: "AMMN", name: "PT Amman Mineral Tbk", sector: "Pertambangan", offeringPrice: 1750, currentPrice: 1900, sharesOffered: 1_200_000_000, listingDate: "2024-07-01", status: "upcoming" as const },
  { symbol: "BREN", name: "PT Barito Renewables Energy Tbk", sector: "Energi", offeringPrice: 5000, currentPrice: 6800, sharesOffered: 800_000_000, listingDate: "2024-05-20", status: "listed" as const },
  { symbol: "MBMA", name: "PT Merdeka Battery Materials Tbk", sector: "Tambang", offeringPrice: 2000, currentPrice: 2450, sharesOffered: 600_000_000, listingDate: "2024-04-10", status: "listed" as const },
  { symbol: "FIRE", name: "PT Fire Resources Indonesia Tbk", sector: "Energi", offeringPrice: 1500, currentPrice: 1800, sharesOffered: 350_000_000, listingDate: "2024-03-28", status: "listed" as const },
];

export default function IPOTrackerPage() {
  const [tab, setTab] = useState<"all" | "upcoming" | "listed">("all");
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const filtered = tab === "all" ? ipoData : ipoData.filter(i => i.status === tab);

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <TickerTape />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 lg:p-6">
          <h1 className="text-lg font-bold text-text-primary mb-4">IPO Tracker</h1>
          <div className="flex gap-1 mb-4">
            {(["all", "upcoming", "listed"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium capitalize ${tab === t ? "bg-primary-900/30 text-primary-400" : "text-text-muted hover:text-text-primary"}`}>
                {t === "all" ? "Semua" : t === "upcoming" ? "📅 Akan Datang" : "📋 Terdaftar"}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((ipo) => (
              <button key={ipo.symbol} onClick={() => setSelectedStock(ipo.symbol)}
                className="rounded-xl border border-surface-200 bg-surface/60 p-4 text-left hover:border-surface-300 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-text-primary">{ipo.symbol}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${ipo.status === "listed" ? "bg-green-500/15 text-green-400" : "bg-yellow-500/15 text-yellow-400"}`}>
                    {ipo.status === "listed" ? "Listed" : "Upcoming"}
                  </span>
                </div>
                <p className="text-xs text-text-secondary">{ipo.name}</p>
                <p className="text-[10px] text-text-muted mt-1">{ipo.sector}</p>
                <div className="flex justify-between mt-3 pt-2 border-t border-surface-100">
                  <div>
                    <p className="text-[10px] text-text-muted">IPO Price</p>
                    <p className="text-sm font-mono text-text-primary">{formatNumber(ipo.offeringPrice)}</p>
                  </div>
                  {ipo.currentPrice && (
                    <div className="text-right">
                      <p className="text-[10px] text-text-muted">Current</p>
                      <p className={`text-sm font-mono ${ipo.currentPrice >= ipo.offeringPrice ? "text-green-400" : "text-red-400"}`}>
                        {formatNumber(ipo.currentPrice)}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 mt-2 text-[10px] text-text-muted">
                  <Calendar size={10} /> {ipo.listingDate}
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
