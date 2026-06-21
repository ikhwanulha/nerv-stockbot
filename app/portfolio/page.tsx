"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import TickerTape from "@/components/TickerTape";
import StockDetailModal from "@/components/StockDetailModal";
import { formatNumber, formatCurrency, formatPercent, getChangeColor } from "@/lib/utils";
import { Wallet, TrendingUp, TrendingDown, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function PortfolioPage() {
  const [holdings, setHoldings] = useState<Array<{ symbol: string; shares: number; avgPrice: number }>>([
    { symbol: "BBCA", shares: 100, avgPrice: 9500 },
    { symbol: "BBRI", shares: 500, avgPrice: 5500 },
    { symbol: "BMRI", shares: 200, avgPrice: 6200 },
  ]);
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const cashBalance = 75000000;

  // Simulasi fetch harga
  useState(() => {
    const defaults = ["BBCA", "BBRI", "BMRI"];
    defaults.forEach(s => {
      setPrices(p => ({ ...p, [s]: 5000 + Math.random() * 10000 }));
    });
  });

  const totalValue = holdings.reduce((sum, h) => sum + (prices[h.symbol] || h.avgPrice) * h.shares, 0);
  const totalCost = holdings.reduce((sum, h) => sum + h.avgPrice * h.shares, 0);
  const totalPnL = totalValue - totalCost;
  const totalPnLPercent = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0;

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <TickerTape />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 lg:p-6">
          <h1 className="text-lg font-bold text-text-primary mb-4">Virtual Portfolio</h1>

          {/* Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="rounded-xl border border-surface-200 bg-surface/60 p-3">
              <p className="text-[10px] text-text-muted uppercase">Total Value</p>
              <p className="text-lg font-bold font-mono text-text-primary">{formatCurrency(totalValue + cashBalance)}</p>
            </div>
            <div className="rounded-xl border border-surface-200 bg-surface/60 p-3">
              <p className="text-[10px] text-text-muted uppercase">Cash Balance</p>
              <p className="text-lg font-bold font-mono text-text-primary">{formatCurrency(cashBalance)}</p>
            </div>
            <div className="rounded-xl border border-surface-200 bg-surface/60 p-3">
              <p className="text-[10px] text-text-muted uppercase">Total P&L</p>
              <p className={`text-lg font-bold font-mono ${totalPnL >= 0 ? "text-green-400" : "text-red-400"}`}>
                {totalPnL >= 0 ? "+" : ""}{formatCurrency(totalPnL)}
              </p>
            </div>
            <div className="rounded-xl border border-surface-200 bg-surface/60 p-3">
              <p className="text-[10px] text-text-muted uppercase">Return</p>
              <p className={`text-lg font-bold font-mono ${totalPnLPercent >= 0 ? "text-green-400" : "text-red-400"}`}>
                {totalPnLPercent >= 0 ? "+" : ""}{totalPnLPercent.toFixed(2)}%
              </p>
            </div>
          </div>

          {/* Holdings table */}
          <div className="rounded-xl border border-surface-200 bg-surface/60 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-200 bg-surface-100/50">
                  <th className="text-left px-3 py-2.5 text-[10px] uppercase text-text-muted">Kode</th>
                  <th className="text-right px-3 py-2.5 text-[10px] uppercase text-text-muted">Jumlah</th>
                  <th className="text-right px-3 py-2.5 text-[10px] uppercase text-text-muted">Avg Price</th>
                  <th className="text-right px-3 py-2.5 text-[10px] uppercase text-text-muted">Current</th>
                  <th className="text-right px-3 py-2.5 text-[10px] uppercase text-text-muted">Value</th>
                  <th className="text-right px-3 py-2.5 text-[10px] uppercase text-text-muted">P&L</th>
                  <th className="text-right px-3 py-2.5 text-[10px] uppercase text-text-muted">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((h) => {
                  const currentPrice = prices[h.symbol] || h.avgPrice;
                  const value = currentPrice * h.shares;
                  const cost = h.avgPrice * h.shares;
                  const pnl = value - cost;
                  const pnlPct = cost > 0 ? (pnl / cost) * 100 : 0;
                  return (
                    <tr key={h.symbol} className="border-b border-surface-100 hover:bg-surface-100/50 cursor-pointer" onClick={() => setSelectedStock(h.symbol)}>
                      <td className="px-3 py-2.5 font-semibold text-primary-400">{h.symbol}</td>
                      <td className="px-3 py-2.5 font-mono text-right text-text-primary">{h.shares.toLocaleString()}</td>
                      <td className="px-3 py-2.5 font-mono text-right text-text-primary">{formatNumber(h.avgPrice)}</td>
                      <td className="px-3 py-2.5 font-mono text-right text-text-primary">{formatNumber(currentPrice)}</td>
                      <td className="px-3 py-2.5 font-mono text-right text-text-primary">{formatCurrency(value)}</td>
                      <td className={`px-3 py-2.5 font-mono text-right ${pnl >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {formatCurrency(pnl)} ({pnlPct.toFixed(2)}%)
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <button className="p-1 text-text-muted hover:text-red-400"><Trash2 size={12} /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-text-muted mt-3 italic">*Portfolio virtual untuk simulasi. Data harga bisa berubah setiap refresh.</p>
        </main>
      </div>
      {selectedStock && <StockDetailModal symbol={selectedStock} onClose={() => setSelectedStock(null)} />}
    </div>
  );
}
