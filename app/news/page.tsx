"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import TickerTape from "@/components/TickerTape";
import NewsCard from "@/components/NewsCard";
import StockDetailModal from "@/components/StockDetailModal";
import type { NewsItem } from "@/types";
import { Newspaper, Filter, RefreshCw, TrendingUp, ArrowDown, Dot } from "lucide-react";

const SENTIMEN_FILTERS = [
  { value: "all", label: "Semua", color: "bg-primary-900/30 text-primary-400" },
  { value: "positive", label: "📈 Positif", color: "bg-green-500/20 text-green-400" },
  { value: "negative", label: "📉 Negatif", color: "bg-red-500/20 text-red-400" },
  { value: "neutral", label: "⚖️ Netral", color: "bg-yellow-500/20 text-yellow-400" },
];

const AUTO_REFRESH_INTERVAL = 30000; // 30 detik

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sentimentFilter, setSentimentFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("");
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [autoScroll, setAutoScroll] = useState(true);
  const [unreadIds, setUnreadIds] = useState<Set<string>>(new Set());
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const newsContainerRef = useRef<HTMLDivElement>(null);
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const prevNewsCount = useRef(0);

  // Fetch news
  const fetchNews = useCallback(async () => {
    try {
      const params = new URLSearchParams({ limit: "30" });
      if (sentimentFilter !== "all") params.set("sentiment", sentimentFilter);
      const res = await fetch(`/api/news?${params}`);
      if (res.ok) {
        const data = await res.json();
        prevNewsCount.current = news.length;
        
        // Tandai berita baru
        if (news.length > 0) {
          const newIds = new Set(unreadIds);
          data.forEach((item: NewsItem) => {
            if (!news.find(n => n.id === item.id) && !readIds.has(item.id)) {
              newIds.add(item.id);
            }
          });
          setUnreadIds(newIds);
        }
        
        setNews(data);
        setLastUpdate(new Date());
      }
    } catch (err) {
      console.error("Error fetching news:", err);
    } finally {
      setLoading(false);
    }
  }, [sentimentFilter, news.length, unreadIds, readIds]);

  // Initial fetch + auto-refresh
  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, AUTO_REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [sentimentFilter]);

  // Auto-scroll
  useEffect(() => {
    if (!autoScroll || !newsContainerRef.current) return;
    scrollIntervalRef.current = setInterval(() => {
      if (!newsContainerRef.current) return;
      const container = newsContainerRef.current;
      const maxScroll = container.scrollHeight - container.clientHeight;
      if (container.scrollTop >= maxScroll - 50) {
        container.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ top: 1, behavior: "smooth" });
      }
    }, 80);
    return () => { if (scrollIntervalRef.current) clearInterval(scrollIntervalRef.current); };
  }, [autoScroll]);

  // Filter stocks
  useEffect(() => {
    const allStocks = new Set<string>();
    news.forEach(n => n.relatedStocks.forEach(s => allStocks.add(s)));
  }, [news]);

  // Handle click news
  const handleNewsClick = (item: NewsItem) => {
    setReadIds(prev => new Set(prev).add(item.id));
    setUnreadIds(prev => { const s = new Set(prev); s.delete(item.id); return s; });
    if (item.relatedStocks?.[0]) setSelectedStock(item.relatedStocks[0]);
  };

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <TickerTape />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 lg:p-6 flex flex-col h-[calc(100vh-3.5rem)]">
          {/* Header */}
          <div className="flex items-center justify-between mb-3 flex-shrink-0">
            <div>
              <h1 className="text-lg font-bold text-text-primary flex items-center gap-2">
                <Newspaper size={18} className="text-primary-400" />
                Insights & News
              </h1>
              <p className="text-[10px] text-text-muted">
                Update terakhir: {lastUpdate.toLocaleTimeString("id-ID")} • Auto-refresh setiap 30 detik
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setAutoScroll(!autoScroll)}
                className={`px-2 py-1 text-[10px] rounded-lg flex items-center gap-1 ${autoScroll ? "bg-primary-900/30 text-primary-400" : "bg-surface-200 text-text-muted"}`}>
                <TrendingUp size={10} /> Auto-scroll
              </button>
              <button onClick={fetchNews} className="p-1.5 rounded-lg bg-surface-200 hover:bg-surface-300 text-text-secondary transition-colors" title="Refresh">
                <RefreshCw size={14} />
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 mb-3 flex-wrap flex-shrink-0">
            <Filter size={12} className="text-text-muted" />
            {SENTIMEN_FILTERS.map((f) => (
              <button key={f.value} onClick={() => setSentimentFilter(f.value)}
                className={`px-2 py-1 text-[10px] rounded-lg font-medium transition-colors ${sentimentFilter === f.value ? f.color : "text-text-muted hover:text-text-primary hover:bg-surface-200"}`}>
                {f.label}
              </button>
            ))}
            <div className="ml-2 text-[10px] text-text-muted">
              {news.length} berita • {unreadIds.size} baru
            </div>
          </div>

          {/* News Container - Infinite Scroll */}
          <div
            ref={newsContainerRef}
            className="flex-1 overflow-y-auto rounded-xl border border-surface-200 bg-surface/60 space-y-1 p-2"
            onMouseEnter={() => autoScroll && setAutoScroll(false)}
            onMouseLeave={() => !autoScroll && setAutoScroll(true)}
          >
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : news.length === 0 ? (
              <div className="text-center py-12 text-text-muted">
                <Newspaper size={48} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">Tidak ada berita</p>
              </div>
            ) : (
              <div className="space-y-1">
                {news.map((item) => (
                  <div key={item.id} className="relative" onClick={() => handleNewsClick(item)}>
                    {unreadIds.has(item.id) && (
                      <Dot size={16} className="absolute -left-4 top-3 text-blue-400" />
                    )}
                    <div className={`cursor-pointer ${unreadIds.has(item.id) ? "opacity-100" : "opacity-80 hover:opacity-100"}`}>
                      <NewsCard news={item} />
                    </div>
                  </div>
                ))}
                {/* End indicator */}
                <div className="text-center py-4 text-[10px] text-text-muted">
                  — Akhir dari berita. Auto-refresh setiap 30 detik —
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
      {selectedStock && <StockDetailModal symbol={selectedStock} onClose={() => setSelectedStock(null)} />}
    </div>
  );
}
