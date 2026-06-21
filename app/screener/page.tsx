"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import TickerTape from "@/components/TickerTape";
import StockDetailModal from "@/components/StockDetailModal";
import { formatNumber, formatPercent, formatVolume, getChangeColor } from "@/lib/utils";
import { Search, ArrowUpDown, Loader2 } from "lucide-react";

export default function ScreenerPage() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    cmf: { active: false, operator: "gt", value: 0 },
    obv: { active: false, operator: "gt", value: 0 },
    ad: { active: false, operator: "gt", value: 0 },
  });

  const [sortField, setSortField] = useState("symbol");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const handleScan = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ action: "screener" });
      if (filters.cmf.active) {
        params.set("cmf_op", filters.cmf.operator);
        params.set("cmf_val", filters.cmf.value.toString());
      }
      if (filters.obv.active) {
        params.set("obv_op", filters.obv.operator);
        params.set("obv_val", filters.obv.value.toString());
      }
      if (filters.ad.active) {
        params.set("ad_op", filters.ad.operator);
        params.set("ad_val", filters.ad.value.toString());
      }

      const res = await fetch(`/api/stocks?${params}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data);
      }
    } catch (err) {
      console.error("Screener error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const sortedResults = [...results].sort((a: any, b: any) => {
    const aVal = a[sortField] ?? 0;
    const bVal = b[sortField] ?? 0;
    return sortDir === "asc" ? (aVal > bVal ? 1 : -1) : aVal < bVal ? 1 : -1;
  });

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <TickerTape />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">
          <h1 className="text-lg font-bold text-text-primary mb-4">Stock Screener</h1>

          {/* Filter Panel */}
          <div className="rounded-xl border border-surface-200 bg-surface/60 p-4 mb-4">
            <h2 className="text-sm font-semibold text-text-primary mb-3">Filter Indikator</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(["cmf", "obv", "ad"] as const).map((ind) => (
                <div key={ind} className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters[ind].active}
                      onChange={(e) => setFilters((f) => ({ ...f, [ind]: { ...f[ind], active: e.target.checked } }))}
                      className="rounded border-surface-300 bg-surface-100 text-primary-500 focus:ring-primary-500"
                    />
                    <span className="text-xs font-medium text-text-primary uppercase">{ind}</span>
                  </label>
                  {filters[ind].active && (
                    <div className="flex gap-2">
                      <select
                        value={filters[ind].operator}
                        onChange={(e) => setFilters((f) => ({ ...f, [ind]: { ...f[ind], operator: e.target.value } }))}
                        className="w-20 px-2 py-1 text-xs rounded bg-surface-100 border border-surface-300 text-text-primary"
                      >
                        <option value="gt">&gt;</option>
                        <option value="lt">&lt;</option>
                        <option value="eq">=</option>
                      </select>
                      <input
                        type="number"
                        step="0.01"
                        value={filters[ind].value}
                        onChange={(e) => setFilters((f) => ({ ...f, [ind]: { ...f[ind], value: parseFloat(e.target.value) || 0 } }))}
                        className="flex-1 px-2 py-1 text-xs rounded bg-surface-100 border border-surface-300 text-text-primary"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={handleScan}
              disabled={loading}
              className="mt-4 px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white text-sm rounded-lg transition-colors flex items-center gap-2"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
              {loading ? "Scanning..." : "Scan Saham"}
            </button>
          </div>

          {/* Results Table */}
          <div className="rounded-xl border border-surface-200 bg-surface/60 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-200 bg-surface-100/50">
                    {["symbol", "name", "price", "changePercent", "volume", "cmf", "obv", "ad"].map((col) => (
                      <th
                        key={col}
                        onClick={() => handleSort(col)}
                        className="text-left px-3 py-2.5 text-[10px] uppercase tracking-wider text-text-muted font-semibold cursor-pointer hover:text-text-primary"
                      >
                        <div className="flex items-center gap-1">
                          {col === "symbol" ? "Kode" : col === "name" ? "Nama" : col === "price" ? "Harga" : col === "changePercent" ? "Perubahan" : col === "volume" ? "Volume" : col.toUpperCase()}
                          {sortField === col && <ArrowUpDown size={10} className={sortDir === "asc" ? "rotate-180" : ""} />}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedResults.length === 0 && !loading && (
                    <tr>
                      <td colSpan={8} className="text-center py-8 text-text-muted text-sm">
                        Klik "Scan Saham" untuk memulai pencarian
                      </td>
                    </tr>
                  )}
                  {sortedResults.map((row: any) => (
                    <tr
                      key={row.symbol}
                      onClick={() => setSelectedStock(row.symbol)}
                      className="border-b border-surface-100 hover:bg-surface-100/50 cursor-pointer transition-colors"
                    >
                      <td className="px-3 py-2.5 font-semibold text-primary-400">{row.symbol}</td>
                      <td className="px-3 py-2.5 text-text-secondary max-w-[200px] truncate">{row.name}</td>
                      <td className="px-3 py-2.5 font-mono text-text-primary">{formatNumber(row.price)}</td>
                      <td className={`px-3 py-2.5 font-mono ${getChangeColor(row.changePercent)}`}>{formatPercent(row.changePercent)}</td>
                      <td className="px-3 py-2.5 font-mono text-text-primary">{formatVolume(row.volume)}</td>
                      <td className={`px-3 py-2.5 font-mono ${row.cmf > 0 ? "text-green-400" : row.cmf < 0 ? "text-red-400" : "text-text-muted"}`}>{row.cmf?.toFixed(4) || "0"}</td>
                      <td className="px-3 py-2.5 font-mono text-text-primary">{row.obv?.toFixed(0) || "0"}</td>
                      <td className="px-3 py-2.5 font-mono text-text-primary">{row.ad?.toFixed(0) || "0"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {results.length > 0 && (
              <div className="p-3 border-t border-surface-200 text-xs text-text-muted">
                Menampilkan {results.length} hasil
              </div>
            )}
          </div>
        </main>
      </div>

      {selectedStock && (
        <StockDetailModal symbol={selectedStock} onClose={() => setSelectedStock(null)} />
      )}
    </div>
  );
}
