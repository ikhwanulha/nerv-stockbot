"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import TickerTape from "@/components/TickerTape";
import StockDetailModal from "@/components/StockDetailModal";
import { Calendar as CalendarIcon, DollarSign, Users, FileText, Rocket, BarChart3 } from "lucide-react";
import { formatDate } from "@/lib/utils";

const events = [
  { id: "1", date: "2024-07-15", title: "RUPST BBCA", type: "rups" as const, symbol: "BBCA", description: "Rapat Umum Pemegang Saham Tahunan PT Bank Central Asia Tbk" },
  { id: "2", date: "2024-07-20", title: "Dividen BMRI", type: "dividend" as const, symbol: "BMRI", description: "Pembayaran dividen final PT Bank Mandiri Tbk" },
  { id: "3", date: "2024-07-25", title: "Laporan Keuangan Q2 2024", type: "financial_report" as const, symbol: "", description: "Batas akhir pelaporan keuangan kuartal II 2024" },
  { id: "4", date: "2024-07-01", title: "IPO CUAN", type: "ipo" as const, symbol: "CUAN", description: "Pencatatan perdana saham PT Cuanki Tbk di BEI" },
  { id: "5", date: "2024-07-05", title: "Rilis Data Inflasi Juni", type: "economic" as const, symbol: "", description: "BPS merilis data inflasi bulan Juni 2024" },
  { id: "6", date: "2024-07-10", title: "Dividen TLKM", type: "dividend" as const, symbol: "TLKM", description: "Pembayaran dividen PT Telkom Indonesia Tbk" },
  { id: "7", date: "2024-08-01", title: "RUPSLB GOTO", type: "rups" as const, symbol: "GOTO", description: "RUPS Luar Biasa PT GoTo Gojek Tokopedia Tbk" },
  { id: "8", date: "2024-08-15", title: "Rilis Data GDP Q2", type: "economic" as const, symbol: "", description: "BPS merilis data pertumbuhan ekonomi kuartal II 2024" },
];

const typeConfig = {
  dividend: { icon: DollarSign, color: "text-green-400 bg-green-500/10", label: "Dividen" },
  rups: { icon: Users, color: "text-blue-400 bg-blue-500/10", label: "RUPS" },
  financial_report: { icon: FileText, color: "text-purple-400 bg-purple-500/10", label: "Laporan Keuangan" },
  ipo: { icon: Rocket, color: "text-orange-400 bg-orange-500/10", label: "IPO" },
  economic: { icon: BarChart3, color: "text-yellow-400 bg-yellow-500/10", label: "Ekonomi" },
};

export default function CalendarPage() {
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>("all");

  const filtered = filterType === "all" ? events : events.filter(e => e.type === filterType);

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <TickerTape />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 lg:p-6">
          <h1 className="text-lg font-bold text-text-primary mb-4">Kalender Aksi Korporasi</h1>

          <div className="flex gap-1 mb-4 flex-wrap">
            <button onClick={() => setFilterType("all")} className={`px-2 py-1 text-xs rounded-lg ${filterType === "all" ? "bg-primary-900/30 text-primary-400" : "text-text-muted"}`}>Semua</button>
            {Object.entries(typeConfig).map(([key, cfg]) => (
              <button key={key} onClick={() => setFilterType(key)}
                className={`px-2 py-1 text-xs rounded-lg flex items-center gap-1 ${filterType === key ? cfg.color : "text-text-muted"}`}>
                <cfg.icon size={12} />{cfg.label}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {filtered.map((event) => {
              const cfg = typeConfig[event.type];
              const Icon = cfg.icon;
              return (
                <div key={event.id} className="flex items-start gap-3 rounded-xl border border-surface-200 bg-surface/60 p-3 hover:border-surface-300 transition-all">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg.color}`}>
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-primary">{event.title}</p>
                    <p className="text-xs text-text-secondary">{event.description}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-mono text-text-primary">{event.date}</p>
                    {event.symbol && (
                      <button onClick={() => setSelectedStock(event.symbol)} className="text-[10px] text-primary-400 hover:text-primary-300">
                        {event.symbol} ↗
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
      {selectedStock && <StockDetailModal symbol={selectedStock} onClose={() => setSelectedStock(null)} />}
    </div>
  );
}
