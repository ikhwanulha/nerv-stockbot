"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import { formatNumber, formatPercent, getChangeColor } from "@/lib/utils";

// Daftar saham IDX untuk autocomplete
const IDX_STOCKS = [
  { symbol: "BBCA", name: "Bank Central Asia Tbk", sector: "Perbankan" },
  { symbol: "BBRI", name: "Bank Rakyat Indonesia Tbk", sector: "Perbankan" },
  { symbol: "BMRI", name: "Bank Mandiri Tbk", sector: "Perbankan" },
  { symbol: "BBNI", name: "Bank Negara Indonesia Tbk", sector: "Perbankan" },
  { symbol: "BYAN", name: "Bayan Resources Tbk", sector: "Pertambangan" },
  { symbol: "TLKM", name: "Telkom Indonesia Tbk", sector: "Telekomunikasi" },
  { symbol: "ASII", name: "Astra International Tbk", sector: "Otomotif" },
  { symbol: "ADRO", name: "Adaro Energy Tbk", sector: "Energi" },
  { symbol: "GOTO", name: "GoTo Gojek Tokopedia Tbk", sector: "Teknologi" },
  { symbol: "UNVR", name: "Unilever Indonesia Tbk", sector: "Consumer" },
  { symbol: "INDF", name: "Indofood Sukses Makmur Tbk", sector: "Consumer" },
  { symbol: "CPIN", name: "Charoen Pokphand Indonesia Tbk", sector: "Consumer" },
  { symbol: "EXCL", name: "XL Axiata Tbk", sector: "Telekomunikasi" },
  { symbol: "ISAT", name: "Indosat Ooredoo Hutchison Tbk", sector: "Telekomunikasi" },
  { symbol: "ACES", name: "Ace Hardware Indonesia Tbk", sector: "Consumer" },
  { symbol: "ANTM", name: "Aneka Tambang Tbk", sector: "Pertambangan" },
  { symbol: "PGAS", name: "Perusahaan Gas Negara Tbk", sector: "Energi" },
  { symbol: "PTBA", name: "Bukit Asam Tbk", sector: "Pertambangan" },
  { symbol: "KLBF", name: "Kalbe Farma Tbk", sector: "Farmasi" },
  { symbol: "SMGR", name: "Semen Indonesia Tbk", sector: "Infrastruktur" },
  { symbol: "PWON", name: "Pakuwon Jati Tbk", sector: "Properti" },
  { symbol: "CTRA", name: "Ciputra Development Tbk", sector: "Properti" },
  { symbol: "BSDE", name: "Bumi Serpong Damai Tbk", sector: "Properti" },
  { symbol: "MTEL", name: "Dayamitra Telekomunikasi Tbk", sector: "Telekomunikasi" },
  { symbol: "TBIG", name: "Tower Bersama Infrastructure Tbk", sector: "Telekomunikasi" },
  { symbol: "BREN", name: "Barito Renewables Energy Tbk", sector: "Energi" },
  { symbol: "MBMA", name: "Merdeka Battery Materials Tbk", sector: "Tambang" },
  { symbol: "AMMN", name: "Amman Mineral Internasional Tbk", sector: "Pertambangan" },
  { symbol: "NIKL", name: "Pelat Timah Nusantara Tbk", sector: "Tambang" },
  { symbol: "MEDC", name: "Medco Energi Internasional Tbk", sector: "Energi" },
  { symbol: "ARTO", name: "Arto Indonesia Tbk", sector: "Teknologi" },
];

// Saham global
const GLOBAL_STOCKS = [
  { symbol: "AAPL", name: "Apple Inc", sector: "Teknologi US", exchange: "NASDAQ" },
  { symbol: "MSFT", name: "Microsoft Corp", sector: "Teknologi US", exchange: "NASDAQ" },
  { symbol: "GOOGL", name: "Alphabet Inc", sector: "Teknologi US", exchange: "NASDAQ" },
  { symbol: "AMZN", name: "Amazon.com Inc", sector: "Consumer US", exchange: "NASDAQ" },
  { symbol: "TSLA", name: "Tesla Inc", sector: "Otomotif US", exchange: "NASDAQ" },
  { symbol: "META", name: "Meta Platforms", sector: "Teknologi US", exchange: "NASDAQ" },
  { symbol: "NVDA", name: "NVIDIA Corp", sector: "Teknologi US", exchange: "NASDAQ" },
  { symbol: "BTC", name: "Bitcoin USD", sector: "Kripto", exchange: "BITSTAMP" },
  { symbol: "ETH", name: "Ethereum USD", sector: "Kripto", exchange: "BITSTAMP" },
];

interface Props {
  onSelect: (symbol: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

export default function TickerAutocomplete({ onSelect, placeholder = "Cari saham...", className, autoFocus }: Props) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<Array<{ symbol: string; name: string; sector: string; exchange?: string }>>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [quotes, setQuotes] = useState<Record<string, any>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length < 1) { setResults([]); setIsOpen(false); return; }
    const q = query.toUpperCase();
    const all = [...IDX_STOCKS.map(s => ({ ...s, exchange: "IDX" })), ...GLOBAL_STOCKS];
    const filtered = all.filter(s => s.symbol.includes(q) || s.name.toUpperCase().includes(q)).slice(0, 8);
    setResults(filtered);
    setSelectedIndex(0);
    setIsOpen(filtered.length > 0);

    if (filtered.length > 0) {
      fetch(`/api/stocks?action=quotes&symbols=${filtered.map(s => s.symbol).join(",")}`)
        .then(r => r.json()).then(data => {
          const m: Record<string, any> = {};
          data.forEach((q: any) => { m[q.symbol] = q; });
          setQuotes(m);
        }).catch(() => {});
    }
  }, [query]);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const select = (stock: typeof results[0]) => {
    const prefix = stock.exchange === "IDX" ? "IDX:" : stock.exchange === "BITSTAMP" ? "BITSTAMP:" : stock.exchange === "NASDAQ" ? "NASDAQ:" : stock.exchange === "NYSE" ? "NYSE:" : "";
    onSelect(`${prefix}${stock.symbol}`);
    setQuery(stock.symbol);
    setIsOpen(false);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (!isOpen) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIndex(i => Math.min(i + 1, results.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIndex(i => Math.max(i - 1, 0)); }
    if (e.key === "Enter" && results[selectedIndex]) { e.preventDefault(); select(results[selectedIndex]); }
    if (e.key === "Escape") setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative ${className || ""}`}>
      <div className="flex items-center bg-surface-100 border border-surface-300 rounded-lg overflow-hidden focus-within:border-primary-500/50 transition-colors">
        <Search size={14} className="ml-2 text-text-muted flex-shrink-0" />
        <input type="text" value={query} onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKey} onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder={placeholder} autoFocus={autoFocus}
          className="w-full px-2 py-1.5 text-xs bg-transparent text-text-primary placeholder:text-text-muted outline-none"
          role="combobox" aria-expanded={isOpen} aria-label="Cari saham" />
        {query && <button onClick={() => { setQuery(""); setIsOpen(false); }} className="px-1.5 text-text-muted hover:text-text-primary text-xs">✕</button>}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-1 left-0 right-0 z-50 rounded-lg border border-surface-300 bg-surface shadow-xl overflow-hidden animate-fade-in" role="listbox">
          {results.map((stock, i) => {
            const q = quotes[stock.symbol];
            return (
              <button key={stock.symbol} onClick={() => select(stock)}
                onMouseEnter={() => setSelectedIndex(i)}
                className={`w-full text-left px-3 py-2 transition-colors flex items-center justify-between ${i === selectedIndex ? "bg-primary-900/30" : "hover:bg-surface-200"}`}
                role="option" aria-selected={i === selectedIndex}>
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-bold text-text-primary">{stock.symbol}</span>
                  <span className="text-[10px] text-text-muted truncate max-w-[120px]">{stock.name}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {q && <span className="text-xs font-mono text-text-primary">{formatNumber(q.price)}</span>}
                  {q && <span className={`text-[10px] font-mono ${getChangeColor(q.change)}`}>{formatPercent(q.changePercent)}</span>}
                  <span className="text-[9px] px-1 py-0.5 rounded bg-surface-200 text-text-muted whitespace-nowrap">{stock.sector}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
