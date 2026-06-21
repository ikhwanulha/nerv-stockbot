"use client";

import { useEffect, useState } from "react";
import { X, TrendingUp, TrendingDown, ExternalLink, Newspaper, BarChart3, FileText, Activity, DollarSign, PieChart, Building2, Calendar, Shield, Info } from "lucide-react";
import { formatNumber, formatCurrency, formatPercent, formatVolume, getChangeColor, cn } from "@/lib/utils";
import { TVSymbolChart } from "./TradingViewWidgets";

// Logo URL helper
function getStockLogo(symbol: string): string {
  return `https://s3-symbol-logo.tradingview.com/${symbol}.svg`;
}

// Data fundamental dummy tapi realistis
const FUNDAMENTAL_DATA: Record<string, any> = {
  BBCA: { name: "Bank Central Asia Tbk", sector: "Perbankan", subsector: "Bank Umum", listingDate: "2000-05-31", per: 24.5, pbv: 4.2, roe: 23.1, der: 1.8, eps: 425, dividendYield: 3.2, marketCap: 1250000000000000, sharesOutstanding: 123000000000, priceBook: 4.2, revenue: 85000000000000, netProfit: 35000000000000, totalAssets: 1250000000000000, totalDebt: 450000000000000, employeeCount: 35000, website: "www.bca.co.id", statusSyariah: "Halal", description: "Bank Central Asia Tbk (BBCA) merupakan salah satu bank terbesar di Indonesia dengan fokus pada segmen korporasi, komersial, UKM, dan consumer. BBCA dikenal dengan fundamental yang kuat, efisiensi tinggi, dan kualitas aset yang baik." },
  BBRI: { name: "Bank Rakyat Indonesia Tbk", sector: "Perbankan", subsector: "Bank Umum", listingDate: "2003-11-10", per: 15.2, pbv: 2.8, roe: 19.5, der: 2.1, eps: 375, dividendYield: 5.8, marketCap: 750000000000000, sharesOutstanding: 125000000000, revenue: 145000000000000, netProfit: 45000000000000, totalAssets: 1800000000000000, totalDebt: 650000000000000, employeeCount: 95000, website: "www.bri.co.id", statusSyariah: "Halal", description: "Bank Rakyat Indonesia Tbk (BBRI) adalah bank terbesar di Indonesia dari sisi aset. BBRI fokus pada segmen mikro, kecil, dan menengah (UMKM) serta memiliki jaringan terluas di Indonesia." },
  BMRI: { name: "Bank Mandiri Tbk", sector: "Perbankan", subsector: "Bank Umum", listingDate: "2005-07-11", per: 13.8, pbv: 2.5, roe: 18.2, der: 2.3, eps: 450, dividendYield: 4.5, marketCap: 620000000000000, sharesOutstanding: 233000000000, revenue: 125000000000000, netProfit: 38000000000000, totalAssets: 1500000000000000, totalDebt: 550000000000000, employeeCount: 42000, website: "www.bankmandiri.co.id", statusSyariah: "Halal", description: "Bank Mandiri Tbk (BMRI) merupakan bank terbesar kedua di Indonesia dari sisi aset. Bank Mandiri fokus pada segmen korporasi, komersial, dan consumer." },
  TLKM: { name: "Telkom Indonesia Tbk", sector: "Telekomunikasi", subsector: "Telekomunikasi", listingDate: "1995-11-14", per: 18.5, pbv: 3.1, roe: 16.8, der: 1.2, eps: 175, dividendYield: 4.8, marketCap: 320000000000000, sharesOutstanding: 99000000000, revenue: 145000000000000, netProfit: 18000000000000, totalAssets: 250000000000000, totalDebt: 85000000000000, employeeCount: 22000, website: "www.telkom.co.id", statusSyariah: "Halal", description: "Telkom Indonesia Tbk (TLKM) adalah perusahaan telekomunikasi terbesar di Indonesia dengan bisnis utama fixed broadband, mobile, dan infrastruktur digital." },
  ASII: { name: "Astra International Tbk", sector: "Otomotif", subsector: "Otomotif & Komponen", listingDate: "1990-04-04", per: 12.5, pbv: 1.8, roe: 15.2, der: 0.9, eps: 495, dividendYield: 4.2, marketCap: 280000000000000, sharesOutstanding: 40500000000, revenue: 280000000000000, netProfit: 20000000000000, totalAssets: 350000000000000, totalDebt: 120000000000000, employeeCount: 150000, website: "www.astra.co.id", statusSyariah: "Halal", description: "Astra International Tbk (ASII) adalah konglomerat terbesar di Indonesia dengan bisnis di sektor otomotif, alat berat, agribisnis, properti, dan jasa keuangan." },
  ADRO: { name: "Adaro Energy Tbk", sector: "Pertambangan", subsector: "Batubara", listingDate: "2008-07-16", per: 8.2, pbv: 1.5, roe: 22.5, der: 0.6, eps: 325, dividendYield: 6.5, marketCap: 85000000000000, sharesOutstanding: 31500000000, revenue: 65000000000000, netProfit: 11000000000000, totalAssets: 95000000000000, totalDebt: 25000000000000, employeeCount: 8500, website: "www.adaro.com", statusSyariah: "Halal", description: "Adaro Energy Tbk (ADRO) adalah salah satu produsen batubara terbesar di Indonesia dengan operasi terintegrasi dari tambang hingga pembangkit listrik." },
  GOTO: { name: "GoTo Gojek Tokopedia Tbk", sector: "Teknologi", subsector: "Teknologi Digital", listingDate: "2022-04-11", per: -1.5, pbv: 2.8, roe: -12.5, der: 1.5, eps: -55, dividendYield: 0, marketCap: 85000000000000, sharesOutstanding: 1050000000000, revenue: 18000000000000, netProfit: -15000000000000, totalAssets: 55000000000000, totalDebt: 25000000000000, employeeCount: 18000, website: "www.goto.com", statusSyariah: "Halal", description: "GoTo Gojek Tokopedia Tbk (GOTO) adalah perusahaan teknologi terbesar di Indonesia yang mengoperasikan super-app Gojek dan platform e-commerce Tokopedia." },
};

const FINANCIAL_YEARS = ["2023", "2022", "2021"];

interface Props {
  symbol: string;
  onClose: () => void;
}

export default function StockDetailModal({ symbol, onClose }: Props) {
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"info" | "financial" | "technical" | "news">("info");
  const [logoError, setLogoError] = useState(false);

  const funda = FUNDAMENTAL_DATA[symbol] || {
    name: symbol, sector: "-", subsector: "-", listingDate: "-", per: "-", pbv: "-", roe: "-", der: "-", eps: "-",
    dividendYield: "-", marketCap: "-", revenue: "-", netProfit: "-", totalAssets: "-", totalDebt: "-",
    website: "-", statusSyariah: "Halal", description: `Informasi untuk saham ${symbol} akan ditambahkan kemudian.`,
  };

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const res = await fetch(`/api/stocks?action=quote&symbol=${symbol}`);
        if (res.ok) setQuote(await res.json());
      } catch {} finally { setLoading(false); }
    };
    fetchQuote();
    const interval = setInterval(fetchQuote, 30000);
    return () => clearInterval(interval);
  }, [symbol]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-4 lg:pt-8 pb-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-surface-300 bg-surface shadow-2xl animate-fade-in">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-surface/95 backdrop-blur border-b border-surface-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Logo Saham */}
              <div className="w-12 h-12 rounded-xl bg-surface-100 border border-surface-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                {!logoError ? (
                  <img src={getStockLogo(symbol)} alt={symbol} className="w-8 h-8 object-contain"
                    onError={() => setLogoError(true)} />
                ) : (
                  <span className="text-lg font-bold text-primary-400">{symbol.charAt(0)}</span>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-text-primary">{symbol}</h2>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-200 text-text-muted">{funda.sector}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400">{funda.statusSyariah}</span>
                </div>
                <p className="text-xs text-text-muted">{funda.name}</p>
              </div>
              {quote && (
                <div className="ml-auto text-right">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold font-mono text-text-primary">{formatNumber(quote.price)}</span>
                    <span className={`text-sm font-mono ${getChangeColor(quote.change)}`}>
                      {quote.change && quote.change > 0 ? <TrendingUp size={14} className="inline" /> : <TrendingDown size={14} className="inline" />}
                      {formatNumber(quote.change)} ({formatPercent(quote.changePercent)})
                    </span>
                  </div>
                </div>
              )}
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-200 text-text-muted hover:text-text-primary transition-colors flex-shrink-0">
              <X size={20} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-3 border-b border-surface-200">
            {[
              { key: "info", label: "Info", icon: Building2 },
              { key: "financial", label: "Keuangan", icon: DollarSign },
              { key: "technical", label: "Teknikal", icon: Activity },
              { key: "news", label: "Berita", icon: Newspaper },
            ].map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                  activeTab === tab.key ? "border-primary-500 text-primary-400" : "border-transparent text-text-muted hover:text-text-primary"
                }`}>
                <tab.icon size={14} /> {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {activeTab === "info" && (
            <div className="space-y-4">
              {/* Chart */}
              <div className="rounded-xl border border-surface-200 bg-surface/50 overflow-hidden" style={{ height: 300 }}>
                <TVSymbolChart symbol={`IDX:${symbol}`} height={300} />
              </div>

              {/* Key Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { label: "PER", value: funda.per, color: "text-text-primary" },
                  { label: "PBV", value: funda.pbv, color: "text-text-primary" },
                  { label: "ROE", value: `${funda.roe}%`, color: "text-text-primary" },
                  { label: "DER", value: funda.der, color: "text-text-primary" },
                  { label: "EPS", value: `Rp${formatNumber(funda.eps)}`, color: "text-text-primary" },
                  { label: "Div Yield", value: `${funda.dividendYield}%`, color: funda.dividendYield > 3 ? "text-gain" : "text-text-primary" },
                  { label: "Market Cap", value: formatCurrency(funda.marketCap), color: "text-text-primary" },
                  { label: "Volume", value: quote?.volume ? formatVolume(quote.volume) : "-", color: "text-text-primary" },
                ].map(item => (
                  <div key={item.label} className="p-2.5 rounded-lg bg-surface-100 border border-surface-200">
                    <p className="text-[9px] text-text-muted uppercase tracking-wider">{item.label}</p>
                    <p className={`text-xs font-bold font-mono mt-0.5 ${item.color}`}>{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Company Info */}
              <div className="rounded-xl border border-surface-200 bg-surface/50 p-4">
                <h3 className="text-sm font-bold text-text-primary mb-3 flex items-center gap-2"><Building2 size={14} className="text-primary-400" /> Profil Perusahaan</h3>
                <p className="text-xs text-text-secondary leading-relaxed mb-3">{funda.description}</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div><span className="text-text-muted">Sektor</span><p className="text-text-primary font-medium">{funda.sector}</p></div>
                  <div><span className="text-text-muted">Subsektor</span><p className="text-text-primary font-medium">{funda.subsector}</p></div>
                  <div><span className="text-text-muted">Listing</span><p className="text-text-primary font-medium">{funda.listingDate}</p></div>
                  <div><span className="text-text-muted">Karyawan</span><p className="text-text-primary font-medium">{formatNumber(funda.employeeCount)}</p></div>
                  <div><span className="text-text-muted">Website</span><p className="text-primary-400 font-medium">{funda.website}</p></div>
                  <div><span className="text-text-muted">Saham Beredar</span><p className="text-text-primary font-medium">{formatNumber(funda.sharesOutstanding)}</p></div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setActiveTab("financial")} className="p-3 rounded-lg bg-surface-100 hover:bg-surface-200 border border-surface-200 text-left transition-colors">
                  <DollarSign size={16} className="text-primary-400 mb-1" />
                  <p className="text-xs font-semibold text-text-primary">Laporan Keuangan</p>
                  <p className="text-[10px] text-text-muted">Pendapatan, laba, aset, utang</p>
                </button>
                <button onClick={() => setActiveTab("technical")} className="p-3 rounded-lg bg-surface-100 hover:bg-surface-200 border border-surface-200 text-left transition-colors">
                  <Activity size={16} className="text-primary-400 mb-1" />
                  <p className="text-xs font-semibold text-text-primary">Analisis Teknikal</p>
                  <p className="text-[10px] text-text-muted">RSI, MACD, Moving Average</p>
                </button>
              </div>
            </div>
          )}

          {activeTab === "financial" && (
            <div className="space-y-4">
              {/* Financial Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { label: "Pendapatan (TTM)", value: formatCurrency(funda.revenue) },
                  { label: "Laba Bersih (TTM)", value: formatCurrency(funda.netProfit) },
                  { label: "Total Aset", value: formatCurrency(funda.totalAssets) },
                  { label: "Total Utang", value: formatCurrency(funda.totalDebt) },
                  { label: "Market Cap", value: formatCurrency(funda.marketCap) },
                  { label: "EPS (TTM)", value: `Rp${formatNumber(funda.eps)}` },
                  { label: "ROE", value: `${funda.roe}%` },
                  { label: "Dividend Yield", value: `${funda.dividendYield}%` },
                ].map(item => (
                  <div key={item.label} className="p-2.5 rounded-lg bg-surface-100 border border-surface-200">
                    <p className="text-[9px] text-text-muted">{item.label}</p>
                    <p className="text-xs font-bold font-mono text-text-primary mt-0.5">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Financial Statements Table */}
              <div className="rounded-xl border border-surface-200 bg-surface/50 p-4">
                <h3 className="text-sm font-bold text-text-primary mb-3 flex items-center gap-2"><FileText size={14} className="text-primary-400" /> Ringkasan Laporan Keuangan (Rp Miliar)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-surface-200 text-text-muted">
                        <th className="text-left py-2 pr-4 font-medium">Metrik</th>
                        {FINANCIAL_YEARS.map(y => <th key={y} className="text-right py-2 px-3 font-medium">{y}</th>)}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-100">
                      {[
                        { label: "Pendapatan", values: [funda.revenue, funda.revenue * 0.92, funda.revenue * 0.85], color: "text-text-primary" },
                        { label: "Laba Kotor", values: [funda.revenue * 0.65, funda.revenue * 0.62, funda.revenue * 0.58], color: "text-text-primary" },
                        { label: "Laba Usaha", values: [funda.netProfit * 1.8, funda.netProfit * 1.6, funda.netProfit * 1.4], color: "text-text-primary" },
                        { label: "Laba Bersih", values: [funda.netProfit, funda.netProfit * 0.9, funda.netProfit * 0.78], color: "text-gain" },
                        { label: "Total Aset", values: [funda.totalAssets, funda.totalAssets * 0.95, funda.totalAssets * 0.88], color: "text-text-primary" },
                        { label: "Total Utang", values: [funda.totalDebt, funda.totalDebt * 0.93, funda.totalDebt * 0.85], color: "text-text-muted" },
                        { label: "Ekuitas", values: [funda.totalAssets - funda.totalDebt, (funda.totalAssets - funda.totalDebt) * 0.95, (funda.totalAssets - funda.totalDebt) * 0.9], color: "text-text-primary" },
                      ].map(row => (
                        <tr key={row.label}>
                          <td className="py-2 pr-4 text-text-primary font-medium">{row.label}</td>
                          {row.values.map((v, i) => (
                            <td key={i} className={`py-2 px-3 text-right font-mono ${row.color}`}>
                              {formatCurrency(v)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-[9px] text-text-muted mt-2 italic">*Data ilustrasi. Untuk data akurat, lihat laporan keuangan resmi emiten di IDX.</p>
              </div>

              {/* Key Ratios */}
              <div className="rounded-xl border border-surface-200 bg-surface/50 p-4">
                <h3 className="text-sm font-bold text-text-primary mb-3 flex items-center gap-2"><PieChart size={14} className="text-primary-400" /> Rasio Keuangan</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { label: "PER", value: funda.per, desc: "Price to Earnings Ratio" },
                    { label: "PBV", value: funda.pbv, desc: "Price to Book Value" },
                    { label: "ROE", value: `${funda.roe}%`, desc: "Return on Equity" },
                    { label: "DER", value: funda.der, desc: "Debt to Equity Ratio" },
                    { label: "EPS", value: `Rp${formatNumber(funda.eps)}`, desc: "Earnings per Share" },
                    { label: "Dividend Yield", value: `${funda.dividendYield}%`, desc: "Dividen / Harga Saham" },
                    { label: "NPM", value: `${((funda.netProfit / funda.revenue) * 100).toFixed(1)}%`, desc: "Net Profit Margin" },
                    { label: "ROA", value: `${((funda.netProfit / funda.totalAssets) * 100).toFixed(1)}%`, desc: "Return on Assets" },
                  ].map(item => (
                    <div key={item.label} className="p-2.5 rounded-lg bg-surface-100 border border-surface-200">
                      <p className="text-[9px] text-text-muted">{item.desc}</p>
                      <p className="text-xs font-bold font-mono text-text-primary">{item.value}</p>
                      <p className="text-[9px] text-text-muted">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "technical" && (
            <div className="space-y-4">
              <div className="rounded-xl border border-surface-200 bg-surface/50 overflow-hidden" style={{ height: 400 }}>
                <TVSymbolChart symbol={`IDX:${symbol}`} height={400} />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { label: "RSI (14)", value: "54.8", desc: "Netral" },
                  { label: "MACD", value: "+12.5", desc: "Bullish" },
                  { label: "MA 20", value: formatNumber(quote?.price ? quote.price * 0.99 : 0), desc: quote?.price ? quote.price * 0.99 > quote?.price * 0.98 ? "Di Atas" : "Di Bawah" : "-" },
                  { label: "MA 50", value: formatNumber(quote?.price ? quote.price * 0.97 : 0), desc: quote?.price ? quote.price * 0.97 > quote?.price * 0.95 ? "Di Atas" : "Di Bawah" : "-" },
                  { label: "Bollinger", value: "Middle", desc: "Netral" },
                  { label: "Stochastic", value: "62.5", desc: "Netral" },
                  { label: "Volume", value: quote?.volume ? formatVolume(quote.volume) : "-", desc: quote?.volume && quote.volume > 5000000 ? "Tinggi" : "Normal" },
                  { label: "OBV", value: "Naik", desc: "Akumulasi" },
                ].map(item => (
                  <div key={item.label} className="p-2.5 rounded-lg bg-surface-100 border border-surface-200">
                    <p className="text-[9px] text-text-muted">{item.label}</p>
                    <p className="text-xs font-bold font-mono text-text-primary">{item.value}</p>
                    <p className="text-[9px] text-text-muted">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "news" && (
            <div className="space-y-2">
              <p className="text-xs text-text-muted mb-2">Berita terkait {symbol}</p>
              {/* Fetch news from API - akan terfilter otomatis */}
              <div className="text-center py-8 text-text-muted">
                <Newspaper size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-xs">Fitur berita detail akan segera hadir</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
