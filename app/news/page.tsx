"use client";

import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import TickerTape from "@/components/TickerTape";
import StockDetailModal from "@/components/StockDetailModal";
import { Newspaper, Filter, RefreshCw, X, ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/utils";

const SENTIMEN_FILTERS = [
  { value: "all", label: "Semua", color: "bg-primary-900/30 text-primary-400" },
  { value: "positive", label: "📈 Positif", color: "bg-green-500/20 text-green-400" },
  { value: "negative", label: "📉 Negatif", color: "bg-red-500/20 text-red-400" },
  { value: "neutral", label: "⚖️ Netral", color: "bg-yellow-500/20 text-yellow-400" },
];

const AUTO_REFRESH_INTERVAL = 60000;

export default function NewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sentimentFilter, setSentimentFilter] = useState("all");
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchNews = useCallback(async () => {
    try {
      const params = new URLSearchParams({ limit: "20" });
      if (sentimentFilter !== "all") params.set("sentiment", sentimentFilter);
      const res = await fetch(`/api/news?${params}`);
      if (res.ok) {
        setNews(await res.json());
        setLastUpdate(new Date());
      }
    } catch (err) {
      console.error("Error fetching news:", err);
    } finally {
      setLoading(false);
    }
  }, [sentimentFilter]);

  useEffect(() => { fetchNews(); const i = setInterval(fetchNews, AUTO_REFRESH_INTERVAL); return () => clearInterval(i); }, [sentimentFilter]);

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <TickerTape />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 lg:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-lg font-bold text-text-primary flex items-center gap-2">
                <Newspaper size={18} className="text-primary-400" /> Insights & News
              </h1>
              <p className="text-[10px] text-text-muted">
                Update: {lastUpdate.toLocaleTimeString("id-ID")} • Auto-refresh 60 detik • Klik berita untuk baca
              </p>
            </div>
            <button onClick={fetchNews} className="p-1.5 rounded-lg bg-surface-200 hover:bg-surface-300 text-text-secondary transition-colors" title="Refresh">
              <RefreshCw size={14} />
            </button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Filter size={12} className="text-text-muted" />
            {SENTIMEN_FILTERS.map((f) => (
              <button key={f.value} onClick={() => setSentimentFilter(f.value)}
                className={`px-2 py-1 text-[10px] rounded-lg font-medium transition-colors ${
                  sentimentFilter === f.value ? f.color : "text-text-muted hover:text-text-primary hover:bg-surface-200"
                }`}>{f.label}</button>
            ))}
          </div>

          {/* News List */}
          {loading ? (
            <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>
          ) : news.length === 0 ? (
            <div className="text-center py-12 text-text-muted"><Newspaper size={48} className="mx-auto mb-2 opacity-30" /><p className="text-sm">Tidak ada berita</p></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {news.map((item: any) => (
                <div key={item.id} className="rounded-xl border border-surface-200 bg-surface/60 overflow-hidden hover:border-surface-300 transition-all">
                  {/* Clickable header */}
                  <button onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                    className="w-full text-left p-3 hover:bg-surface-100/50 transition-colors">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                        item.sentiment === "positive" ? "bg-green-500/15 text-green-400" :
                        item.sentiment === "negative" ? "bg-red-500/15 text-red-400" : "bg-yellow-500/15 text-yellow-400"
                      }`}>{item.sentiment === "positive" ? "📈" : item.sentiment === "negative" ? "📉" : "⚖️"}</span>
                      <span className="text-[10px] text-text-muted">{item.source}</span>
                      <span className="text-[10px] text-text-muted">• {formatDate(item.publishedAt)}</span>
                      {item.relatedStocks?.slice(0, 2).map((s: string) => (
                        <button key={s} onClick={(e) => { e.stopPropagation(); setSelectedStock(s); }}
                          className="text-[10px] px-1 py-0.5 rounded bg-surface-200 text-primary-400 font-mono hover:bg-surface-300">{s}</button>
                      ))}
                    </div>
                    <h2 className="text-sm font-semibold text-text-primary leading-snug">{item.title}</h2>
                    {!expandedId || expandedId !== item.id ? (
                      <p className="text-xs text-text-secondary mt-1 line-clamp-2">{item.summary}</p>
                    ) : null}
                  </button>

                  {/* Expanded content */}
                  {expandedId === item.id && (
                    <div className="px-3 pb-3 border-t border-surface-200 animate-fade-in">
                      <div className="pt-3">
                        <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">{item.content}</p>
                        <div className="mt-3 pt-3 border-t border-surface-100 flex items-center justify-between">
                          <span className="text-[10px] text-text-muted">Sumber: {item.source}</span>
                          <div className="flex items-center gap-2">
                            <button onClick={() => setExpandedId(null)} className="px-2.5 py-1 text-[10px] bg-surface-200 hover:bg-surface-300 text-text-secondary rounded-lg transition-colors">
                              Tutup
                            </button>
                            <a href={item.url} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-600 hover:bg-primary-700 text-white text-[10px] rounded-lg transition-colors">
                              Baca Sumber Asli <ExternalLink size={10} />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
      {selectedStock && <StockDetailModal symbol={selectedStock} onClose={() => setSelectedStock(null)} />}
    </div>
  );
}
