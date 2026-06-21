"use client";

import { useEffect, useRef } from "react";

interface TVWidgetProps {
  type: "market-overview" | "chart" | "technical-analysis" | "heatmap" | "stock-list";
  symbol?: string;
  width?: string | number;
  height?: number;
}

// TradingView Widget Components
// Widget-widget ini gratis dan menyediakan data real-time akurat
export function TVMarketOverview({ width = "100%", height = 400 }: Partial<TVWidgetProps>) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = "";
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      colorTheme: "dark",
      dateRange: "1M",
      showChart: true,
      locale: "id_ID",
      width: "100%",
      height: height,
      largeChartUrl: "",
      isTransparent: true,
      showSymbolLogo: true,
      showFloatingTooltip: false,
      plotLineColorGrowing: "#22c55e",
      plotLineColorFalling: "#ef4444",
      gridLineColor: "#1f2937",
      scaleFontColor: "#9ca3af",
      belowLineFillColorGrowing: "rgba(34, 197, 94, 0.12)",
      belowLineFillColorFalling: "rgba(239, 68, 68, 0.12)",
      tabs: [
        { title: "Indeks", symbols: [{ s: "IDX:COMPOSITE", d: "IHSG" }, { s: "IDX:LQ45", d: "LQ45" }, { s: "IDX:IDX30", d: "IDX30" }, { s: "FOREXCOM:SPXUSD", d: "S&P 500" }, { s: "FOREXCOM:NSXUSD", d: "Nasdaq" }], originalTitle: "Indeks" },
        { title: "Saham IDX", symbols: [{ s: "IDX:BBCA", d: "BBCA" }, { s: "IDX:BBRI", d: "BBRI" }, { s: "IDX:BMRI", d: "BMRI" }, { s: "IDX:BYAN", d: "BYAN" }, { s: "IDX:TLKM", d: "TLKM" }], originalTitle: "Saham IDX" },
        { title: "Komoditas", symbols: [{ s: "NYMEX:CL1!", d: "Minyak Mentah" }, { s: "COMEX:GC1!", d: "Emas" }, { s: "NYMEX:NG1!", d: "Gas Alam" }, { s: "CBOT:ZC1!", d: "Jagung" }], originalTitle: "Komoditas" },
        { title: "Kripto", symbols: [{ s: "BITSTAMP:BTCUSD", d: "Bitcoin" }, { s: "BITSTAMP:ETHUSD", d: "Ethereum" }, { s: "COINBASE:SOLUSD", d: "Solana" }, { s: "COINBASE:DOGEUSD", d: "Dogecoin" }], originalTitle: "Kripto" },
      ],
    });
    ref.current.appendChild(script);
    return () => { try { script.remove(); } catch {} };
  }, [height]);

  return <div ref={ref} style={{ width, height }} />;
}

export function TVSymbolChart({ symbol = "IDX:BBCA", height = 400 }: Partial<TVWidgetProps>) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = "";
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [[symbol]],
      colorTheme: "dark",
      isTransparent: true,
      width: "100%",
      height: height,
      locale: "id_ID",
      dateRange: "1M",
      showChart: true,
      chartOnly: false,
      lineColor: "#22c55e",
      gridLineColor: "rgba(42, 46, 57, 0)",
    });
    ref.current.appendChild(script);
    return () => { try { script.remove(); } catch {} };
  }, [symbol, height]);

  return <div ref={ref} style={{ width: "100%", height }} />;
}

export function TVScreener({ width = "100%", height = 600 }: Partial<TVWidgetProps>) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = "";
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-screener.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      width: "100%",
      height: height,
      defaultColumn: "overview",
      defaultScreen: "most_actively_traded",
      market: "indonesia",
      showToolbar: true,
      colorTheme: "dark",
      isTransparent: true,
      locale: "id_ID",
    });
    ref.current.appendChild(script);
    return () => { try { script.remove(); } catch {} };
  }, [height]);

  return <div ref={ref} style={{ width, height }} />;
}

export function TVHeatmap({ width = "100%", height = 400 }: Partial<TVWidgetProps>) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = "";
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      exchanges: ["IDX"],
      dataSource: "SPX500",
      grouping: "sector",
      blockSize: "market_cap_basic",
      blockColor: "change",
      locale: "id_ID",
      colorTheme: "dark",
      isTransparent: true,
      width: "100%",
      height: height,
    });
    ref.current.appendChild(script);
    return () => { try { script.remove(); } catch {} };
  }, [height]);

  return <div ref={ref} style={{ width, height }} />;
}

export default function TVTickerWidget() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [
        { proName: "FOREXCOM:SPXUSD", title: "S&P 500" },
        { proName: "BITSTAMP:BTCUSD", title: "Bitcoin" },
        { description: "BBCA", proName: "IDX:BBCA" },
        { description: "BBRI", proName: "IDX:BBRI" },
        { description: "BMRI", proName: "IDX:BMRI" },
        { description: "GOTO", proName: "IDX:GOTO" },
        { description: "BYAN", proName: "IDX:BYAN" },
      ],
      showSymbolLogo: true,
      colorTheme: "dark",
      isTransparent: true,
      displayMode: "compact",
      locale: "id_ID",
    });
    ref.current.appendChild(script);
    return () => { try { script.remove(); } catch {} };
  }, []);

  return <div ref={ref} className="w-full h-[30px]" />;
}
