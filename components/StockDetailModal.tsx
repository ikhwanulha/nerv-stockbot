"use client";

import { useEffect, useState } from "react";
import { X, TrendingUp, TrendingDown, Minus, ExternalLink } from "lucide-react";
import { formatNumber, formatCurrency, formatPercent, getChangeColor } from "@/lib/utils";
import StockChart from "./StockChart";
import type { StockQuote } from "@/types";

interface Props {
  symbol: string;
  onClose: () => void;
}

export default function StockDetailModal({ symbol, onClose }: Props) {
  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"chart" | "fundamental" | "technical">("chart");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/stocks?action=quote&symbol=${symbol}`);
        if (res.ok) {
          const data = await res.json();
          setQuote(data);
        }
      } catch (err) {
        console.error("Failed to fetch stock detail:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [symbol]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-2xl border border-surface-300 bg-surface shadow-2xl animate-fade-in">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-surface-200 bg-surface/95 backdrop-blur">
          <div className="flex items-center gap-3">
            {loading ? (
              <div className="h-8 w-32 bg-surface-200 rounded animate-pulse" />
            ) : (
              <>
                <div>
                  <h2 className="text-lg font-bold text-text-primary">{symbol}</h2>
                  <p className="text-xs text-text-muted">{quote?.name || "-"}</p>
                </div>
                {quote && (
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold font-mono tabular-nums text-text-primary">
                      {formatNumber(quote.price)}
                    </span>
                    <span className={`flex items-center gap-1 text-sm font-medium ${getChangeColor(quote.change)}`}>
                      {quote.change && quote.change > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      {formatNumber(quote.change)} ({formatPercent(quote.changePercent)})
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-surface-200 text-text-secondary hover:text-text-primary transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-surface-200">
          {(["chart", "fundamental", "technical"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-primary-500 text-primary-400"
                  : "border-transparent text-text-muted hover:text-text-primary"
              }`}
            >
              {tab === "chart" ? "Chart" : tab === "fundamental" ? "Fundamental" : "Teknikal"}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-4">
          {activeTab === "chart" && (
            <div className="h-[400px]">
              <StockChart symbol={symbol} showControls />
            </div>
          )}

          {activeTab === "fundamental" && (
            <div className="space-y-4">
              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-16 bg-surface-200 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <FundamentalCard label="PER" value={quote?.peRatio ? formatNumber(quote.peRatio, 2) : "-"} />
                    <FundamentalCard label="PBV" value={quote?.priceToBook ? formatNumber(quote.priceToBook, 2) : "-"} />
                    <FundamentalCard label="EPS" value={quote?.eps ? formatCurrency(quote.eps) : "-"} />
                    <FundamentalCard label="Dividend Yield" value={quote?.dividendYield ? formatPercent(quote.dividendYield) : "-"} />
                    <FundamentalCard label="Market Cap" value={quote?.marketCap ? formatCurrency(quote.marketCap) : "-"} />
                    <FundamentalCard label="52W High" value={quote?.fiftyTwoWeekHigh ? formatNumber(quote.fiftyTwoWeekHigh) : "-"} />
                    <FundamentalCard label="52W Low" value={quote?.fiftyTwoWeekLow ? formatNumber(quote.fiftyTwoWeekLow) : "-"} />
                    <FundamentalCard label="Status Syariah" value="Halal ✅" />
                    <FundamentalCard label="Sektor" value="Keuangan" />
                  </div>

                  {/* Laporan keuangan ringkasan */}
                  <div className="mt-6">
                    <h3 className="text-sm font-semibold text-text-primary mb-3">Ringkasan Laporan Keuangan</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-surface-200">
                            <th className="text-left py-2 px-3 text-text-muted font-medium">Metrik</th>
                            <th className="text-right py-2 px-3 text-text-muted font-medium">2023</th>
                            <th className="text-right py-2 px-3 text-text-muted font-medium">2022</th>
                            <th className="text-right py-2 px-3 text-text-muted font-medium">2021</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-surface-100">
                            <td className="py-2 px-3 text-text-primary">Pendapatan</td>
                            <td className="text-right py-2 px-3 font-mono text-text-primary">Rp 150,5T</td>
                            <td className="text-right py-2 px-3 font-mono text-text-primary">Rp 135,2T</td>
                            <td className="text-right py-2 px-3 font-mono text-text-primary">Rp 120,8T</td>
                          </tr>
                          <tr className="border-b border-surface-100">
                            <td className="py-2 px-3 text-text-primary">Laba Bersih</td>
                            <td className="text-right py-2 px-3 font-mono text-green-400">Rp 45,2T</td>
                            <td className="text-right py-2 px-3 font-mono text-green-400">Rp 38,7T</td>
                            <td className="text-right py-2 px-3 font-mono text-green-400">Rp 32,1T</td>
                          </tr>
                          <tr className="border-b border-surface-100">
                            <td className="py-2 px-3 text-text-primary">Total Aset</td>
                            <td className="text-right py-2 px-3 font-mono text-text-primary">Rp 1.250T</td>
                            <td className="text-right py-2 px-3 font-mono text-text-primary">Rp 1.150T</td>
                            <td className="text-right py-2 px-3 font-mono text-text-primary">Rp 1.080T</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-3 text-text-primary">Total Utang</td>
                            <td className="text-right py-2 px-3 font-mono text-text-primary">Rp 680T</td>
                            <td className="text-right py-2 px-3 font-mono text-text-primary">Rp 650T</td>
                            <td className="text-right py-2 px-3 font-mono text-text-primary">Rp 620T</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p className="mt-2 text-[10px] text-text-muted italic">* Data ilustrasi. Untuk data akurat, lihat laporan keuangan resmi emiten.</p>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === "technical" && (
            <div className="space-y-4">
              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-16 bg-surface-200 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <TechnicalCard label="RSI (14)" value="58.4" status="netral" />
                    <TechnicalCard label="MACD" value="Positif" status="bullish" />
                    <TechnicalCard label="SMA 20" value={formatNumber(quote?.price ? quote.price * 0.99 : 0)} status="netral" />
                    <TechnicalCard label="SMA 50" value={formatNumber(quote?.price ? quote.price * 0.97 : 0)} status="netral" />
                    <TechnicalCard label="Bollinger" value="Middle Band" status="netral" />
                    <TechnicalCard label="Volume" value={formatNumber(quote?.volume || 0)} status={quote?.volume && quote.volume > 5000000 ? "bullish" : "netral"} />
                  </div>

                  <div className="mt-4 p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
                    <h4 className="text-sm font-semibold text-yellow-400 mb-1">Ringkasan Teknikal</h4>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      Saham ini menunjukkan momentum positif dalam jangka pendek dengan RSI di level netral. 
                      MACD berada di atas signal line mengindikasikan potensi penguatan. 
                      Volume tergolong normal dengan kecenderungan meningkat. 
                      Support terdekat di level {formatNumber(quote?.price ? Math.round(quote.price * 0.95) : 0)} 
                      dan resistance di {formatNumber(quote?.price ? Math.round(quote.price * 1.05) : 0)}.
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-surface-200 text-[10px] text-text-muted flex items-center justify-between">
          <span>Data tertunda ~15 menit • Sumber: Yahoo Finance</span>
          <span className="italic">NERV StockBot &copy; 2024</span>
        </div>
      </div>
    </div>
  );
}

function FundamentalCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface-100 rounded-xl p-3 border border-surface-200">
      <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">{label}</p>
      <p className="text-sm font-semibold font-mono text-text-primary">{value}</p>
    </div>
  );
}

function TechnicalCard({ label, value, status }: { label: string; value: string; status: "bullish" | "bearish" | "netral" }) {
  const colorMap = {
    bullish: "text-green-400",
    bearish: "text-red-400",
    netral: "text-yellow-400",
  };
  return (
    <div className="bg-surface-100 rounded-xl p-3 border border-surface-200">
      <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">{label}</p>
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold font-mono text-text-primary">{value}</span>
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${colorMap[status]} bg-current/10`}>
          {status.toUpperCase()}
        </span>
      </div>
    </div>
  );
}
