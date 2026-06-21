"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import TickerTape from "@/components/TickerTape";
import { Calculator, RefreshCw } from "lucide-react";
import { formatNumber, formatCurrency } from "@/lib/utils";

export default function CalculatorPage() {
  const [price, setPrice] = useState("5000");
  const [lots, setLots] = useState("1");
  const [feePercent, setFeePercent] = useState("0.15");

  const currentPrice = parseFloat(price) || 0;
  const currentLots = parseInt(lots) || 0;
  const totalShares = currentLots * 100;
  const totalValue = totalShares * currentPrice;
  const buyFee = totalValue * (parseFloat(feePercent) / 100);
  const sellFee = totalValue * (parseFloat(feePercent) / 100 + 0.25 / 100); // 0.25% pajak
  const totalBuy = totalValue + buyFee;
  const totalSell = totalValue - sellFee;

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <TickerTape />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 lg:p-6 max-w-2xl">
          <h1 className="text-lg font-bold text-text-primary mb-4">Kalkulator Lot Saham</h1>

          <div className="rounded-xl border border-surface-200 bg-surface/60 p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              <div>
                <label className="text-[10px] text-text-muted uppercase mb-1 block">Harga Saham</label>
                <input type="number" value={price} onChange={e => setPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface-100 border border-surface-300 text-text-primary text-sm" />
              </div>
              <div>
                <label className="text-[10px] text-text-muted uppercase mb-1 block">Jumlah Lot</label>
                <input type="number" value={lots} onChange={e => setLots(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface-100 border border-surface-300 text-text-primary text-sm" />
              </div>
              <div>
                <label className="text-[10px] text-text-muted uppercase mb-1 block">Fee (%)</label>
                <input type="number" value={feePercent} onChange={e => setFeePercent(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface-100 border border-surface-300 text-text-primary text-sm" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                <p className="text-[10px] text-green-400 uppercase mb-1">Total Beli</p>
                <p className="text-lg font-bold font-mono text-green-400">{formatCurrency(totalBuy)}</p>
                <p className="text-[10px] text-text-muted">{totalShares} lembar ({currentLots} lot)</p>
              </div>
              <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                <p className="text-[10px] text-red-400 uppercase mb-1">Total Jual (net)</p>
                <p className="text-lg font-bold font-mono text-red-400">{formatCurrency(totalSell)}</p>
                <p className="text-[10px] text-text-muted">Setelah fee & pajak</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
              <div className="p-2 rounded bg-surface-100">
                <p className="text-[10px] text-text-muted">Nilai</p>
                <p className="text-xs font-mono text-text-primary">{formatCurrency(totalValue)}</p>
              </div>
              <div className="p-2 rounded bg-surface-100">
                <p className="text-[10px] text-text-muted">Fee Beli</p>
                <p className="text-xs font-mono text-text-primary">{formatCurrency(buyFee)}</p>
              </div>
              <div className="p-2 rounded bg-surface-100">
                <p className="text-[10px] text-text-muted">Fee Jual</p>
                <p className="text-xs font-mono text-text-primary">{formatCurrency(sellFee)}</p>
              </div>
              <div className="p-2 rounded bg-surface-100">
                <p className="text-[10px] text-text-muted">Selisih</p>
                <p className={`text-xs font-mono ${totalSell - totalBuy >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {formatCurrency(totalSell - totalBuy)}
                </p>
              </div>
            </div>
          </div>

          <p className="text-xs text-text-muted mt-3 italic">*Fee standar: ~0.15% beli, ~0.40% jual (termasuk pajak). Angka dapat berbeda tergantung broker.</p>
        </main>
      </div>
    </div>
  );
}
