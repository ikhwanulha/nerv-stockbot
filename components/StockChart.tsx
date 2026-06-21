"use client";

import { useEffect, useRef, useState } from "react";
import { createChart, ColorType, IChartApi, ISeriesApi, CandlestickData, LineData } from "lightweight-charts";
import { Maximize2, Minimize2 } from "lucide-react";
import { formatNumber } from "@/lib/utils";

interface Props {
  symbol: string;
  height?: number;
  showControls?: boolean;
  fullWidth?: boolean;
}

const timeframes = [
  { label: "1D", period: "1d", interval: "5m" },
  { label: "5D", period: "5d", interval: "15m" },
  { label: "1M", period: "1mo", interval: "1h" },
  { label: "3M", period: "3mo", interval: "1d" },
  { label: "1Y", period: "1y", interval: "1d" },
  { label: "5Y", period: "5y", interval: "1wk" },
];

export default function StockChart({ symbol, height = 300, showControls = false, fullWidth = false }: Props) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const [activeTimeframe, setActiveTimeframe] = useState(timeframes[2]);
  const [expanded, setExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const chartHeight = expanded ? Math.max(500, height * 2) : height;

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Buat chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#9ca3af",
        fontSize: 11,
      },
      grid: {
        vertLines: { color: "#1f2937" },
        horzLines: { color: "#1f2937" },
      },
      width: chartContainerRef.current.clientWidth,
      height: chartHeight,
      crosshair: {
        mode: 0,
        vertLine: {
          color: "#10b981",
          width: 1,
          style: 2,
          labelBackgroundColor: "#10b981",
        },
        horzLine: {
          color: "#10b981",
          width: 1,
          style: 2,
          labelBackgroundColor: "#10b981",
        },
      },
      timeScale: {
        borderColor: "#1f2937",
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderColor: "#1f2937",
      },
    });

    chartRef.current = chart;

    // Candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: "#22c55e",
      downColor: "#ef4444",
      borderDownColor: "#ef4444",
      borderUpColor: "#22c55e",
      wickDownColor: "#ef4444",
      wickUpColor: "#22c55e",
    });
    candlestickRef.current = candlestickSeries;

    // Volume series
    const volumeSeries = chart.addHistogramSeries({
      priceFormat: { type: "volume" },
      priceScaleId: "volume",
    });
    chart.priceScale("volume").applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 },
    });

    // Fetch data
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/stocks?action=history&symbol=${symbol}&period=${activeTimeframe.period}&interval=${activeTimeframe.interval}`
        );
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) {
            const candleData: CandlestickData[] = data.map((d: any) => ({
              time: d.time as any,
              open: d.open,
              high: d.high,
              low: d.low,
              close: d.close,
            }));
            candlestickSeries.setData(candleData);

            const volData = data.map((d: any) => ({
              time: d.time as any,
              value: d.volume || 0,
              color: d.close >= d.open ? "rgba(34, 197, 94, 0.3)" : "rgba(239, 68, 68, 0.3)",
            }));
            volumeSeries.setData(volData);

            chart.timeScale().fitContent();
          }
        }
      } catch (err) {
        console.error("Chart data fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Resize handler
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [symbol, activeTimeframe, chartHeight]);

  return (
    <div className={`${fullWidth ? "w-full" : ""}`}>
      {/* Controls */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1">
          {timeframes.map((tf) => (
            <button
              key={tf.label}
              onClick={() => setActiveTimeframe(tf)}
              className={`px-2 py-1 text-xs rounded-md font-medium transition-colors ${
                activeTimeframe.label === tf.label
                  ? "bg-primary-900/40 text-primary-400"
                  : "text-text-muted hover:text-text-primary hover:bg-surface-200"
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
        {showControls && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 rounded hover:bg-surface-200 text-text-muted hover:text-text-primary transition-colors"
          >
            {expanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        )}
      </div>

      {/* Chart container */}
      <div
        ref={chartContainerRef}
        className="relative rounded-lg overflow-hidden"
        style={{ height: chartHeight }}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface/50 z-10">
            <div className="flex items-center gap-2 text-text-muted text-sm">
              <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
              Memuat chart...
            </div>
          </div>
        )}
      </div>

      {/* Note */}
      {!isLoading && (
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-3 text-[10px] text-text-muted">
            <span>💚 Bullish</span>
            <span>❤️ Bearish</span>
          </div>
          <span className="text-[10px] text-text-muted italic">{symbol}</span>
        </div>
      )}
    </div>
  );
}
