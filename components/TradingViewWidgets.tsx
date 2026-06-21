"use client";

import { useEffect, useRef, useState } from "react";

// ============================================================
// TRADINGVIEW WIDGETS - Komponen reusable
// Semua widget menggunakan embed resmi dari TradingView
// ============================================================

// ============================================================
// 1. TICKER TAPE WIDGET
// Scrolling otomatis, real-time price & change %
// ============================================================
export function TVTickerTape({ symbols }: { symbols?: Array<{ proName: string; title?: string; description?: string }> }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = "";
    const s = document.createElement("script");
    s.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    s.async = true;
    s.innerHTML = JSON.stringify({
      symbols: symbols || [
        { proName: "FOREXCOM:SPXUSD", title: "S&P 500" },
        { proName: "FOREXCOM:NSXUSD", title: "Nasdaq 100" },
        { proName: "BITSTAMP:BTCUSD", title: "Bitcoin" },
        { proName: "BITSTAMP:ETHUSD", title: "Ethereum" },
        { description: "BBCA", proName: "IDX:BBCA" },
        { description: "BBRI", proName: "IDX:BBRI" },
        { description: "BMRI", proName: "IDX:BMRI" },
        { description: "BYAN", proName: "IDX:BYAN" },
        { description: "GOTO", proName: "IDX:GOTO" },
        { description: "TLKM", proName: "IDX:TLKM" },
        { description: "ASII", proName: "IDX:ASII" },
        { description: "ADRO", proName: "IDX:ADRO" },
      ],
      showSymbolLogo: true,
      colorTheme: "dark",
      isTransparent: true,
      displayMode: "adaptive",
      locale: "id_ID",
    });
    ref.current.appendChild(s);
    return () => { try { s.remove(); } catch {} };
  }, []);

  return <div ref={ref} className="w-full h-[50px]" />;
}

// ============================================================
// 2. ADVANCED CHART WIDGET
// Full featured: zoom, pan, indicators, drawing tools
// ============================================================
export function TVAdvancedChart({
  symbol = "IDX:BBCA",
  containerId = "tv-chart",
  studies = ["RSI@tv-basicstudies", "MACD@tv-basicstudies", "MASimple@tv-basicstudies"],
  interval = "D",
  autosize = true,
}: {
  symbol?: string;
  containerId?: string;
  studies?: string[];
  interval?: string;
  autosize?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [widget, setWidget] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ref.current || widget) return;
    setLoading(true);

    // Pastikan TradingView library sudah ada
    const checkTV = () => {
      if ((window as any).TradingView) {
        createWidget();
      } else {
        // Load TradingView library
        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/tv.js";
        script.async = true;
        script.onload = createWidget;
        script.onerror = () => {
          // Fallback: inject embed widget instead
          createEmbedWidget();
        };
        document.head.appendChild(script);
      }
    };

    const createWidget = () => {
      try {
        const tvWidget = new (window as any).TradingView.widget({
          container_id: containerId,
          autosize: autosize,
          symbol: symbol,
          interval: interval,
          timezone: "Asia/Jakarta",
          theme: "dark",
          style: "1", // Candlestick
          locale: "id_ID",
          toolbar_bg: "#0a0a0f",
          enable_publishing: false,
          allow_symbol_change: true,
          hide_top_toolbar: false,
          save_image: true,
          studies: studies,
          studies_overrides: {},
          overrides: {
            "paneProperties.background": "#0a0a0f",
            "paneProperties.vertGridProperties.color": "#1a1a2e",
            "paneProperties.horzGridProperties.color": "#1a1a2e",
          },
        });
        setWidget(tvWidget);
        setLoading(false);
      } catch (e) {
        console.error("Failed to create TradingView widget:", e);
        createEmbedWidget();
      }
    };

    const createEmbedWidget = () => {
      const s = document.createElement("script");
      s.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      s.async = true;
      s.innerHTML = JSON.stringify({
        autosize: true,
        symbol: symbol,
        interval: interval,
        timezone: "Asia/Jakarta",
        theme: "dark",
        style: "1",
        locale: "id_ID",
        hide_top_toolbar: false,
        save_image: true,
        studies: studies,
        support_host: "https://www.tradingview.com",
      });
      ref.current?.appendChild(s);
      setLoading(false);
    };

    checkTV();

    return () => {
      if (widget) {
        try { widget.remove(); } catch {}
      }
    };
  }, [symbol, containerId]);

  // Reload widget when symbol changes
  useEffect(() => {
    if (widget) {
      try {
        widget.setSymbol(symbol, () => {});
      } catch {}
    }
  }, [symbol, widget]);

  return (
    <div className="relative w-full h-full min-h-[400px]">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface/80 z-10 rounded-lg">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-text-muted">Memuat chart...</p>
          </div>
        </div>
      )}
      <div id={containerId} ref={ref} className="w-full h-full min-h-[400px] rounded-lg overflow-hidden" />
    </div>
  );
}

// ============================================================
// 3. SYMBOL INFO WIDGET
// Informasi ringkas saham: harga, perubahan, volume
// ============================================================
export function TVSymbolInfo({ symbol = "IDX:BBCA" }: { symbol?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = "";
    const s = document.createElement("script");
    s.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js";
    s.async = true;
    s.innerHTML = JSON.stringify({
      symbol: symbol,
      width: "100%",
      locale: "id_ID",
      colorTheme: "dark",
      isTransparent: true,
      autosize: true,
      largeChartUrl: "",
    });
    ref.current.appendChild(s);
    return () => { try { s.remove(); } catch {} };
  }, [symbol]);

  return <div ref={ref} className="w-full min-h-[100px]" />;
}

// ============================================================
// 4. FUNDAMENTAL DATA WIDGET
// Data fundamental: PER, PBV, EPS, Market Cap, Dividen
// ============================================================
export function TVFundamentalData({ symbol = "IDX:BBCA" }: { symbol?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = "";
    const s = document.createElement("script");
    s.src = "https://s3.tradingview.com/external-embedding/embed-widget-fundamental-data.js";
    s.async = true;
    s.innerHTML = JSON.stringify({
      symbol: symbol,
      width: "100%",
      height: "550",
      locale: "id_ID",
      colorTheme: "dark",
      isTransparent: true,
      autosize: true,
      largeChartUrl: "",
    });
    ref.current.appendChild(s);
    return () => { try { s.remove(); } catch {} };
  }, [symbol]);

  return <div ref={ref} className="w-full min-h-[200px]" />;
}

// ============================================================
// 5. TECHNICAL ANALYSIS WIDGET
// Ringkasan indikator teknikal: RSI, MACD, MA, dll
// ============================================================
export function TVTechnicalAnalysis({ symbol = "IDX:BBCA" }: { symbol?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = "";
    const s = document.createElement("script");
    s.src = "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
    s.async = true;
    s.innerHTML = JSON.stringify({
      symbol: symbol,
      width: "100%",
      height: "450",
      locale: "id_ID",
      colorTheme: "dark",
      isTransparent: true,
      autosize: true,
      showIntervalTabs: true,
      interval: "1D",
      largeChartUrl: "",
    });
    ref.current.appendChild(s);
    return () => { try { s.remove(); } catch {} };
  }, [symbol]);

  return <div ref={ref} className="w-full min-h-[200px]" />;
}

// ============================================================
// 6. MARKET HEATMAP WIDGET
// Heatmap sektor untuk gambaran makro pasar
// ============================================================
export function TVHeatmap({ exchange = "IDX", height = 450 }: { exchange?: string; height?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = "";
    const s = document.createElement("script");
    s.src = "https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js";
    s.async = true;
    s.innerHTML = JSON.stringify({
      exchanges: [exchange],
      dataSource: "SPX500",
      grouping: "sector",
      blockSize: "market_cap_basic",
      blockColor: "change|1D",
      locale: "id_ID",
      colorTheme: "dark",
      isTransparent: true,
      width: "100%",
      height: height,
    });
    ref.current.appendChild(s);
    return () => { try { s.remove(); } catch {} };
  }, [exchange, height]);

  return <div ref={ref} className="w-full" style={{ height }} />;
}

// ============================================================
// 7. MARKET OVERVIEW WIDGET (Multi-tab)
// ============================================================
export function TVMarketOverview({ height = 400 }: { height?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = "";
    const s = document.createElement("script");
    s.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js";
    s.async = true;
    s.innerHTML = JSON.stringify({
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
      tabs: [
        { title: "Indeks", symbols: [{ s: "IDX:COMPOSITE", d: "IHSG" }, { s: "IDX:LQ45", d: "LQ45" }, { s: "IDX:IDX30", d: "IDX30" }, { s: "FOREXCOM:SPXUSD", d: "S&P 500" }, { s: "FOREXCOM:NSXUSD", d: "Nasdaq" }] },
        { title: "Saham IDX", symbols: [{ s: "IDX:BBCA", d: "BBCA" }, { s: "IDX:BBRI", d: "BBRI" }, { s: "IDX:BMRI", d: "BMRI" }, { s: "IDX:BYAN", d: "BYAN" }, { s: "IDX:GOTO", d: "GOTO" }] },
        { title: "Komoditas", symbols: [{ s: "NYMEX:CL1!", d: "Minyak" }, { s: "COMEX:GC1!", d: "Emas" }, { s: "NYMEX:NG1!", d: "Gas" }] },
        { title: "Kripto", symbols: [{ s: "BITSTAMP:BTCUSD", d: "Bitcoin" }, { s: "BITSTAMP:ETHUSD", d: "Ethereum" }] },
      ],
    });
    ref.current.appendChild(s);
    return () => { try { s.remove(); } catch {} };
  }, [height]);

  return <div ref={ref} className="w-full" style={{ height }} />;
}

// ============================================================
// 8. SCREENER WIDGET
// ============================================================
export function TVScreener({ height = 500 }: { height?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = "";
    const s = document.createElement("script");
    s.src = "https://s3.tradingview.com/external-embedding/embed-widget-screener.js";
    s.async = true;
    s.innerHTML = JSON.stringify({
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
    ref.current.appendChild(s);
    return () => { try { s.remove(); } catch {} };
  }, [height]);

  return <div ref={ref} className="w-full" style={{ height }} />;
}
