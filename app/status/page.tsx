"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import TickerTape from "@/components/TickerTape";
import StockDetailModal from "@/components/StockDetailModal";
import { AlertTriangle, Ban, Info } from "lucide-react";

const suspendedStocks = [
  { symbol: "ENRG", name: "PT Energi Mega Persada Tbk", reason: "Suspensi sementara - menunggu konfirmasi informasi material", status: "suspended", date: "2024-06-20" },
  { symbol: "BUMI", name: "PT Bumi Resources Tbk", reason: "Suspensi - volatility tinggi", status: "suspended", date: "2024-06-19" },
  { symbol: "WINS", name: "PT Wintermar Offshore Marine Tbk", reason: "Suspensi - konfirmasi RUPS", status: "suspended", date: "2024-06-18" },
];

const umaStocks = [
  { symbol: "FIRE", name: "PT Fire Resources Indonesia Tbk", reason: "UMA - peningkatan harga signifikan", status: "uma", date: "2024-06-21" },
  { symbol: "CASH", name: "PT Cash Indonesia Tbk", reason: "UMA - volume transaksi tidak wajar", status: "uma", date: "2024-06-21" },
  { symbol: "ARTO", name: "PT Arto Indonesia Tbk", reason: "UMA - volatilitas tinggi", status: "uma", date: "2024-06-20" },
  { symbol: "HKMU", name: "PT Hkmu Tbk", reason: "UMA - kenaikan harga di luar kewajaran", status: "uma", date: "2024-06-20" },
];

export default function StatusPage() {
  const [tab, setTab] = useState<"suspended" | "uma">("suspended");
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const data = tab === "suspended" ? suspendedStocks : umaStocks;
  const Icon = tab === "suspended" ? Ban : AlertTriangle;

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <TickerTape />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 lg:p-6">
          <h1 className="text-lg font-bold text-text-primary mb-1">Status Emiten</h1>
          <p className="text-xs text-text-muted mb-4">Informasi saham yang sedang Suspensi dan terkena UMA (Unusual Market Activity)</p>

          <div className="flex gap-1 mb-4">
            <button onClick={() => setTab("suspended")} className={`px-3 py-1.5 text-xs rounded-lg font-medium ${tab === "suspended" ? "bg-red-500/20 text-red-400" : "text-text-muted hover:text-text-primary"}`}>
              <Ban size={12} className="inline mr-1" />Suspended ({suspendedStocks.length})
            </button>
            <button onClick={() => setTab("uma")} className={`px-3 py-1.5 text-xs rounded-lg font-medium ${tab === "uma" ? "bg-yellow-500/20 text-yellow-400" : "text-text-muted hover:text-text-primary"}`}>
              <AlertTriangle size={12} className="inline mr-1" />UMA ({umaStocks.length})
            </button>
          </div>

          <div className="rounded-xl border border-surface-200 bg-surface/60 overflow-hidden">
            <div className="space-y-2 p-3">
              {data.map((item) => (
                <button
                  key={item.symbol}
                  onClick={() => setSelectedStock(item.symbol)}
                  className="flex items-center justify-between w-full p-3 rounded-lg bg-surface-100/50 hover:bg-surface-200/50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      tab === "suspended" ? "bg-red-500/15" : "bg-yellow-500/15"
                    }`}>
                      <Icon size={16} className={tab === "suspended" ? "text-red-400" : "text-yellow-400"} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-primary">{item.symbol}</p>
                      <p className="text-[10px] text-text-muted">{item.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-text-secondary max-w-[300px]">{item.reason}</p>
                    <p className="text-[10px] text-text-muted mt-0.5">{item.date}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
            <div className="flex items-start gap-2">
              <Info size={14} className="text-blue-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-text-muted leading-relaxed">
                Data status emiten bersifat informatif dan diambil dari sumber publik. 
                Untuk informasi resmi, silakan cek website BEI (idx.co.id).
              </p>
            </div>
          </div>
        </main>
      </div>

      {selectedStock && <StockDetailModal symbol={selectedStock} onClose={() => setSelectedStock(null)} />}
    </div>
  );
}
