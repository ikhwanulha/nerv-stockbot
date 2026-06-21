"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import TickerTape from "@/components/TickerTape";
import NewsCard from "@/components/NewsCard";
import StockDetailModal from "@/components/StockDetailModal";
import type { NewsItem } from "@/types";
import { Newspaper, Filter, Loader2 } from "lucide-react";

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sentimentFilter, setSentimentFilter] = useState("all");
  const [selectedStock, setSelectedStock] = useState<string | null>(null);

  useEffect(() => {
    fetchNews();
  }, [sentimentFilter]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "20" });
      if (sentimentFilter !== "all") params.set("sentiment", sentimentFilter);
      const res = await fetch(`/api/news?${params}`);
      if (res.ok) setNews(await res.json());
    } catch (err) {
      console.error("Error fetching news:", err);
    } finally {
      setLoading(false);
    }
  };

  const counts = {
    all: 10,
    positive: news.filter(n => n.sentiment === "positive").length,
    negative: news.filter(n => n.sentiment === "negative").length,
    neutral: news.filter(n => n.sentiment === "neutral").length,
  };

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <TickerTape />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 lg:p-6">
          <h1 className="text-lg font-bold text-text-primary mb-4">Insights & News</h1>

          {/* Filters */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <Filter size={14} className="text-text-muted" />
            {(["all", "positive", "negative", "neutral"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSentimentFilter(s)}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${
                  sentimentFilter === s
                    ? s === "positive" ? "bg-green-500/20 text-green-400"
                      : s === "negative" ? "bg-red-500/20 text-red-400"
                      : s === "neutral" ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-primary-900/30 text-primary-400"
                    : "text-text-muted hover:text-text-primary hover:bg-surface-200"
                }`}
              >
                {s === "all" ? "Semua" : s === "positive" ? "📈 Positif" : s === "negative" ? "📉 Negatif" : "⚖️ Netral"}
              </button>
            ))}
          </div>

          {/* News grid */}
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-primary-400" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {news.map((item) => (
                <div key={item.id} onClick={() => item.relatedStocks?.[0] && setSelectedStock(item.relatedStocks[0])} className="cursor-pointer">
                  <NewsCard news={item} />
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
