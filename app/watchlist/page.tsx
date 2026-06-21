"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import TickerTape from "@/components/TickerTape";
import StockDetailModal from "@/components/StockDetailModal";
import { formatNumber, formatPercent, getChangeColor } from "@/lib/utils";
import { BookmarkCheck, Plus, Trash2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function WatchlistPage() {
  const { data: session } = useSession();
  const [watchlists, setWatchlists] = useState<any[]>([]);
  const [activeWatchlist, setActiveWatchlist] = useState<string | null>(null);
  const [stockQuotes, setStockQuotes] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [newSymbol, setNewSymbol] = useState("");
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [newWatchlistName, setNewWatchlistName] = useState("");

  const fetchWatchlists = async () => {
    try {
      const res = await fetch("/api/watchlist");
      if (res.ok) {
        const data = await res.json();
        setWatchlists(data);
        if (data.length > 0 && !activeWatchlist) {
          setActiveWatchlist(data[0].id);
        }
      }
    } catch (err) {
      console.error("Error fetching watchlists:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuotes = async (symbols: string[]) => {
    if (symbols.length === 0) return;
    try {
      const res = await fetch(`/api/stocks?action=quotes&symbols=${symbols.join(",")}`);
      if (res.ok) {
        const data = await res.json();
        const quoteMap: Record<string, any> = {};
        data.forEach((q: any) => { quoteMap[q.symbol] = q; });
        setStockQuotes(quoteMap);
      }
    } catch {}
  };

  useEffect(() => {
    fetchWatchlists();
  }, []);

  useEffect(() => {
    const activeWL = watchlists.find(w => w.id === activeWatchlist);
    if (activeWL?.stocks?.length > 0) {
      fetchQuotes(activeWL.stocks.map((s: any) => s.symbol));
    }
  }, [activeWatchlist, watchlists]);

  const addStock = async () => {
    if (!newSymbol.trim() || !activeWatchlist) return;
    try {
      const res = await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ watchlistId: activeWatchlist, symbol: newSymbol.toUpperCase() }),
      });
      if (res.ok) {
        toast.success(`${newSymbol.toUpperCase()} ditambahkan ke watchlist`);
        setNewSymbol("");
        fetchWatchlists();
      } else {
        const data = await res.json();
        toast.error(data.error || "Gagal menambahkan");
      }
    } catch {
      toast.error("Gagal menambahkan saham");
    }
  };

  const removeStock = async (stockId: string) => {
    try {
      const res = await fetch(`/api/watchlist/${stockId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Saham dihapus dari watchlist");
        fetchWatchlists();
      }
    } catch {
      toast.error("Gagal menghapus");
    }
  };

  const createWatchlist = async () => {
    if (!newWatchlistName.trim()) return;
    try {
      const res = await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newWatchlistName }),
      });
      if (res.ok) {
        toast.success("Watchlist baru dibuat");
        setNewWatchlistName("");
        fetchWatchlists();
      }
    } catch {
      toast.error("Gagal membuat watchlist");
    }
  };

  const deleteWatchlist = async (watchlistId: string) => {
    try {
      const res = await fetch("/api/watchlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ watchlistId }),
      });
      if (res.ok) {
        toast.success("Watchlist dihapus");
        setActiveWatchlist(null);
        fetchWatchlists();
      }
    } catch {
      toast.error("Gagal menghapus watchlist");
    }
  };

  const activeWL = watchlists.find(w => w.id === activeWatchlist);

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <TickerTape />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 lg:p-6">
          <h1 className="text-lg font-bold text-text-primary mb-4">Watchlist</h1>

          <div className="flex flex-col lg:flex-row gap-4">
            {/* Sidebar Watchlist */}
            <div className="w-full lg:w-56 flex-shrink-0">
              <div className="rounded-xl border border-surface-200 bg-surface/60 p-3">
                <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Daftar Watchlist</h2>
                <div className="space-y-1">
                  {watchlists.map((wl) => (
                    <div key={wl.id} className="flex items-center justify-between">
                      <button
                        onClick={() => setActiveWatchlist(wl.id)}
                        className={`flex-1 text-left px-2 py-1.5 text-xs rounded-lg transition-colors ${
                          activeWatchlist === wl.id ? "bg-primary-900/30 text-primary-400" : "text-text-secondary hover:text-text-primary hover:bg-surface-200"
                        }`}
                      >
                        {wl.name} ({wl.stocks?.length || 0})
                      </button>
                      <button onClick={() => deleteWatchlist(wl.id)} className="p-1 text-text-muted hover:text-red-400">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex gap-1">
                  <input
                    type="text"
                    value={newWatchlistName}
                    onChange={(e) => setNewWatchlistName(e.target.value)}
                    placeholder="Nama watchlist"
                    className="flex-1 px-2 py-1 text-xs rounded bg-surface-100 border border-surface-300 text-text-primary placeholder:text-text-muted"
                    onKeyDown={(e) => e.key === "Enter" && createWatchlist()}
                  />
                  <button onClick={createWatchlist} className="px-2 py-1 text-xs bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                    <Plus size={12} />
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <div className="rounded-xl border border-surface-200 bg-surface/60 overflow-hidden">
                {/* Add stock */}
                <div className="p-3 border-b border-surface-200">
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={newSymbol}
                      onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
                      placeholder="Kode saham (BBCA)"
                      className="w-32 px-2 py-1.5 text-sm rounded-lg bg-surface-100 border border-surface-300 text-text-primary placeholder:text-text-muted"
                      onKeyDown={(e) => e.key === "Enter" && addStock()}
                    />
                    <button onClick={addStock} className="px-3 py-1.5 text-xs bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors flex items-center gap-1">
                      <Plus size={12} /> Tambah
                    </button>
                    <span className="text-[10px] text-text-muted">
                      {activeWL ? `${activeWL.name} • ${activeWL.stocks?.length || 0} saham` : "Pilih watchlist"}
                    </span>
                  </div>
                </div>

                {/* Stocks list */}
                {loading ? (
                  <div className="flex justify-center py-12"><Loader2 size={20} className="animate-spin text-primary-400" /></div>
                ) : activeWL?.stocks?.length === 0 ? (
                  <div className="text-center py-12 text-text-muted">
                    <BookmarkCheck size={48} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Watchlist kosong</p>
                    <p className="text-xs mt-1">Tambahkan saham untuk mulai memantau</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-surface-200 bg-surface-100/50">
                          <th className="text-left px-3 py-2.5 text-[10px] uppercase text-text-muted">Kode</th>
                          <th className="text-right px-3 py-2.5 text-[10px] uppercase text-text-muted">Harga</th>
                          <th className="text-right px-3 py-2.5 text-[10px] uppercase text-text-muted">Perubahan</th>
                          <th className="text-right px-3 py-2.5 text-[10px] uppercase text-text-muted">Volume</th>
                          <th className="text-right px-3 py-2.5 text-[10px] uppercase text-text-muted">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeWL?.stocks?.map((stock: any) => {
                          const quote = stockQuotes[stock.symbol];
                          return (
                            <tr
                              key={stock.id}
                              onClick={() => setSelectedStock(stock.symbol)}
                              className="border-b border-surface-100 hover:bg-surface-100/50 cursor-pointer transition-colors"
                            >
                              <td className="px-3 py-2.5 font-semibold text-primary-400">{stock.symbol}</td>
                              <td className="px-3 py-2.5 font-mono text-right text-text-primary">{quote ? formatNumber(quote.price) : "-"}</td>
                              <td className={`px-3 py-2.5 font-mono text-right ${quote ? getChangeColor(quote.change) : "text-text-muted"}`}>
                                {quote ? `${getChangeColor(quote.change) === "text-gain" ? "+" : ""}${formatPercent(quote.changePercent)}` : "-"}
                              </td>
                              <td className="px-3 py-2.5 font-mono text-right text-text-primary">{quote?.volume?.toLocaleString("id-ID") || "-"}</td>
                              <td className="px-3 py-2.5 text-right">
                                <button
                                  onClick={(e) => { e.stopPropagation(); removeStock(stock.id); }}
                                  className="p-1 text-text-muted hover:text-red-400 transition-colors"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {selectedStock && <StockDetailModal symbol={selectedStock} onClose={() => setSelectedStock(null)} />}
    </div>
  );
}
