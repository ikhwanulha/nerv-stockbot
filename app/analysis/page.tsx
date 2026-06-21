"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import TickerTape from "@/components/TickerTape";
import { TVAdvancedChart, TVMarketOverview, TVTechnicalAnalysis } from "@/components/TradingViewWidgets";
import { formatNumber, formatPercent, cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, BarChart3, Activity, ChevronDown, ChevronUp, Shield, Target, AlertTriangle, Brain, Clock, Layers, CheckCircle, XCircle } from "lucide-react";

// ============================================================
// DETAILED SIGNAL DATA - Alasan Sinyal Lengkap
// ============================================================

const WYCKOFF_DATA = {
  status: true,
  lines: [
    { icon: "📊", text: "Volume spike 2.3x rata-rata pada support 6,180", ok: true },
    { icon: "🛡️", text: "Harga bertahan di atas support setelah pengujian (successful test)", ok: true },
    { icon: "📈", text: "Fase: Akumulasi (accumulation) mulai terkonfirmasi", ok: true },
    { icon: "📋", text: "Volume 15.2M vs Avg 6.6M | Close 6,245 > Support 6,180", ok: true },
  ],
};

const GANN_DATA = {
  status: true,
  lines: [
    { icon: "📉", text: "Swing Low terbentuk di 6,110 (4 hari lalu)", ok: true },
    { icon: "📈", text: "3 hari berturut-turut naik: +1.2%, +0.8%, +1.5%", ok: true },
    { icon: "✅", text: "Konfirmasi Daily bullish, 4H bullish", ok: true },
    { icon: "📋", text: "Swing Low: 6,110 | Close 6,245 | 3-day return: +3.5%", ok: true },
  ],
};

const MACD_DATA = {
  status: true,
  lines: [
    { icon: "⚡", text: "Garis MACD menyilang ke atas signal line (bullish crossover)", ok: true },
    { icon: "📊", text: "Histogram mulai membesar (momentum meningkat)", ok: true },
    { icon: "📋", text: "MACD: 12.5 | Signal: 8.3 | Histogram: +4.2", ok: true },
  ],
};

const RSI_DATA = {
  status: true,
  lines: [
    { icon: "📊", text: "RSI 54.8 (naik dari 42.3)", ok: true },
    { icon: "🟢", text: "Belum overbought (di bawah 70)", ok: true },
    { icon: "📈", text: "Divergence bullish: Harga turun tapi RSI naik", ok: true },
  ],
};

const VOLUME_DATA = {
  status: true,
  lines: [
    { icon: "🔥", text: "Volume meningkat 142% dari rata-rata 20 hari", ok: true },
    { icon: "📊", text: "On-balance volume (OBV) naik 3.2% hari ini", ok: true },
    { icon: "📋", text: "Volume 15.2M | Avg 6.6M | OBV Trend: Up", ok: true },
  ],
};

const SR_DATA = {
  status: true,
  lines: [
    { icon: "🛡️", text: "Support kuat: 6,180 (konfirmasi 3x test)", ok: true },
    { icon: "🎯", text: "Resistance terdekat: 6,450 (swing high sebelumnya)", ok: true },
    { icon: "✅", text: "Jarak ke TP1 masih aman", ok: true },
    { icon: "📋", text: "S: 6,180 | R1: 6,450 | R2: 6,600", ok: true },
  ],
};

const TIMEFRAME_DATA = {
  status: true,
  lines: [
    { icon: "📈", text: "Daily: BULLISH (di atas MA20, MA50)", ok: true },
    { icon: "📈", text: "4-Hour: BULLISH (breakout dari resistance)", ok: true },
    { icon: "📈", text: "1-Hour: BULLISH (trend up, MACD positif)", ok: true },
    { icon: "✅", text: "Konfirmasi: 3/3 timeframe bullish", ok: true },
  ],
};

const SIGNAL_REASONS = [
  { id: "wyckoff", label: "WYCKOFF METHOD", data: WYCKOFF_DATA },
  { id: "gann", label: "GANN SWING", data: GANN_DATA },
  { id: "macd", label: "MACD", data: MACD_DATA },
  { id: "rsi", label: "RSI", data: RSI_DATA },
  { id: "volume", label: "VOLUME", data: VOLUME_DATA },
  { id: "sr", label: "SUPPORT & RESISTANCE", data: SR_DATA },
  { id: "timeframe", label: "TIMEFRAME CONFLUENCE", data: TIMEFRAME_DATA },
];

const SIGNALS = {
  ihsg: {
    daily: {
      signal: "BUY", confidence: 78, price: 6245,
      entry: { min: 6200, max: 6250 },
      sl: 6120, slPercent: -2.0,
      tp1: 6420, tp1Percent: 3.2,
      tp2: 6600, tp2Percent: 6.1,
      rr: "1:2.6",
      reasons: SIGNAL_REASONS,
    },
    h4: {
      signal: "BUY", confidence: 65, price: 6240,
      entry: { min: 6200, max: 6240 },
      sl: 6150, slPercent: -1.4,
      tp1: 6350, tp1Percent: 1.8,
      tp2: 6450, tp2Percent: 3.4,
      rr: "1:2.0",
      reasons: SIGNAL_REASONS.map(r => ({ ...r, data: { ...r.data, status: r.id !== "timeframe" } })),
    },
    h1: {
      signal: "NEUTRAL", confidence: 45, price: 6238,
      entry: { min: 0, max: 0 },
      sl: 6190, slPercent: -0.8,
      tp1: 6280, tp1Percent: 0.7,
      tp2: 0, tp2Percent: 0,
      rr: "1:1.1",
      reasons: SIGNAL_REASONS.map(r => ({ ...r, data: { ...r.data, status: false } })),
    },
  },
  stocks: [
    { symbol: "BBCA", signal: "BUY", conf: 82, price: 10250, entry: "10200-10250", sl: 10050, tp1: 10500, tp2: 10700, rr: "1:2.5", reason: "Breakout resistance 10.200 dengan volume tinggi. Accumulation Wyckoff. Support di MA50." },
    { symbol: "BBRI", signal: "HOLD", conf: 55, price: 5750, entry: "5650-5700", sl: 5550, tp1: 5900, tp2: 6050, rr: "1:1.5", reason: "Konsolidasi di dekat support. Tunggu konfirmasi breakout. RSI netral." },
    { symbol: "BMRI", signal: "BUY", conf: 75, price: 6200, entry: "6150-6200", sl: 6050, tp1: 6400, tp2: 6600, rr: "1:2.3", reason: "Golden Cross MA50 & MA200. Volume akumulasi. Support teruji di 6.100." },
    { symbol: "TLKM", signal: "SELL", conf: 68, price: 3200, entry: "3180-3220", sl: 3300, tp1: 3050, tp2: 2950, rr: "1:2.1", reason: "Bearish divergence RSI. Resistance di 3.250. Volume distribusi meningkat." },
    { symbol: "GOTO", signal: "BUY", conf: 60, price: 85, entry: "82-86", sl: 78, tp1: 95, tp2: 105, rr: "1:2.4", reason: "Double bottom pattern. Oversold RSI. Sentimen positif dari strategi profitabilitas." },
    { symbol: "ADRO", signal: "HOLD", conf: 50, price: 2850, entry: "2750-2850", sl: 2680, tp1: 3000, tp2: 3150, rr: "1:1.5", reason: "Koreksi wajar setelah kenaikan. Support di 2.750. Harga batu bara fluktuatif." },
  ],
};

const PAIR_TRADES = [
  { pair: "BBCA / BBRI", ratio: 1.78, zscore: -1.2, entry: "Long BBCA, Short BBRI", sl: "Ratio > 1.85", tp: "Ratio < 1.70", conf: 72 },
  { pair: "BMRI / BBNI", ratio: 1.35, zscore: -0.8, entry: "Long BMRI, Short BBNI", sl: "Ratio > 1.42", tp: "Ratio < 1.28", conf: 65 },
  { pair: "ADRO / ITMG", ratio: 1.12, zscore: 1.5, entry: "Long ITMG, Short ADRO", sl: "Ratio > 1.20", tp: "Ratio < 1.05", conf: 70 },
];

// ============================================================
// COMPONENTS
// ============================================================

function SignalReasonSection({ label, data }: { label: string; data: typeof WYCKOFF_DATA }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border border-surface-200 rounded-lg overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-2.5 bg-surface-100 hover:bg-surface-200 transition-colors">
        <div className="flex items-center gap-2">
          {data.status ? <CheckCircle size={14} className="text-green-400" /> : <XCircle size={14} className="text-red-400" />}
          <span className="text-xs font-bold text-text-primary">{label}</span>
        </div>
        {open ? <ChevronUp size={14} className="text-text-muted" /> : <ChevronDown size={14} className="text-text-muted" />}
      </button>
      {open && (
        <div className="p-2.5 space-y-1">
          {data.lines.map((line, i) => (
            <div key={i} className="flex items-start gap-2 text-[11px]">
              <span className="mt-0.5">{line.ok ? "✅" : "❌"}</span>
              <span className={`${line.ok ? "text-text-secondary" : "text-text-muted"}`}>{line.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SignalCard({ title, data, timeframe }: { title: string; data: typeof SIGNALS.ihsg.daily; timeframe: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    BUY: { bg: "bg-green-500/10 border-green-500/30 text-green-400", text: "BUY ▲" },
    SELL: { bg: "bg-red-500/10 border-red-500/30 text-red-400", text: "SELL ▼" },
    NEUTRAL: { bg: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400", text: "NEUTRAL ◆" },
    HOLD: { bg: "bg-blue-500/10 border-blue-500/30 text-blue-400", text: "HOLD ●" },
  };
  const c = colors[data.signal] || colors.NEUTRAL;
  const [showReasons, setShowReasons] = useState(true);

  return (
    <div className="rounded-xl border border-surface-200 bg-surface/60 overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-surface-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-primary-400" />
          <h3 className="text-sm font-bold text-text-primary">{title}</h3>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-surface-200 text-text-muted font-mono">{timeframe}</span>
        </div>
        <div className={`px-2.5 py-1 rounded-lg border text-xs font-bold ${c.bg}`}>{c.text}</div>
      </div>

      {/* Price & Confidence */}
      <div className="p-3 border-b border-surface-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold font-mono text-text-primary">{formatNumber(data.price)}</span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-text-muted">Confidence:</span>
            <div className="w-24 h-2.5 rounded-full bg-surface-200 overflow-hidden">
              <div className={`h-full rounded-full ${data.confidence >= 70 ? "bg-green-500" : data.confidence >= 50 ? "bg-yellow-500" : "bg-red-500"}`}
                style={{ width: `${data.confidence}%` }} />
            </div>
            <span className="text-xs font-bold font-mono" style={{ color: data.confidence >= 70 ? "#22c55e" : data.confidence >= 50 ? "#eab308" : "#ef4444" }}>
              {data.confidence}%
            </span>
          </div>
        </div>

        {/* Levels Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="p-2 rounded-lg bg-surface-100">
            <p className="text-[9px] text-text-muted">Entry Range</p>
            <p className="text-xs font-bold font-mono text-text-primary">
              {data.entry.min > 0 ? `${formatNumber(data.entry.min)} - ${formatNumber(data.entry.max)}` : "Menunggu"}
            </p>
          </div>
          <div className="p-2 rounded-lg bg-surface-100">
            <p className="text-[9px] text-text-muted">Stop Loss</p>
            <p className="text-xs font-bold font-mono text-loss">{formatNumber(data.sl)} <span className="text-[9px] font-normal">({data.slPercent}%)</span></p>
          </div>
          <div className="p-2 rounded-lg bg-surface-100">
            <p className="text-[9px] text-text-muted">Take Profit 1</p>
            <p className="text-xs font-bold font-mono text-gain">{data.tp1 > 0 ? formatNumber(data.tp1) : "-"} <span className="text-[9px] font-normal">({data.tp1Percent}%)</span></p>
          </div>
          <div className="p-2 rounded-lg bg-surface-100">
            <p className="text-[9px] text-text-muted">TP 2 / R:R</p>
            <p className="text-xs font-bold font-mono text-gain">{data.tp2 > 0 ? formatNumber(data.tp2) : "-"} <span className="text-text-primary">| R:R {data.rr}</span></p>
          </div>
        </div>
      </div>

      {/* ALASAN SINYAL */}
      <div className="p-3">
        <button onClick={() => setShowReasons(!showReasons)}
          className="flex items-center gap-2 mb-2">
          <Brain size={14} className="text-primary-400" />
          <span className="text-xs font-bold text-text-primary">📋 ALASAN SINYAL {data.signal}</span>
          {showReasons ? <ChevronUp size={14} className="text-text-muted" /> : <ChevronDown size={14} className="text-text-muted" />}
        </button>

        {showReasons && (
          <div className="space-y-1.5 animate-fade-in">
            {data.reasons.map((reason) => (
              <SignalReasonSection key={reason.id} label={reason.label} data={reason.data} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AnalysisPage() {
  const [activeTimeframe, setActiveTimeframe] = useState("daily");
  const [chartSymbol] = useState("IDX:COMPOSITE");
  const tf = activeTimeframe as keyof typeof SIGNALS.ihsg;
  const data = SIGNALS.ihsg[tf];

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <TickerTape />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-3 lg:p-4 space-y-3 overflow-x-hidden">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-text-primary flex items-center gap-2">
              <Brain size={18} className="text-primary-400" /> Technical Analysis
            </h1>
          </div>

          {/* Timeframe Selector */}
          <div className="flex gap-1 border-b border-surface-200">
            {[
              { key: "daily", label: "Daily", desc: "Swing" },
              { key: "h4", label: "4-Hour", desc: "Intraday" },
              { key: "h1", label: "1-Hour", desc: "Scalping" },
            ].map(t => (
              <button key={t.key} onClick={() => setActiveTimeframe(t.key)}
                className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                  activeTimeframe === t.key ? "border-primary-500 text-primary-400" : "border-transparent text-text-muted hover:text-text-primary"
                }`}>
                {t.label} <span className="text-[9px] opacity-70">({t.desc})</span>
              </button>
            ))}
          </div>

          {/* IHSG Chart + Signal */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div className="rounded-xl border border-surface-200 bg-surface/60 overflow-hidden" style={{ height: 500 }}>
              <TVAdvancedChart symbol={chartSymbol}
                studies={["RSI@tv-basicstudies", "MACD@tv-basicstudies", "MASimple@tv-basicstudies", "BollingerBands@tv-basicstudies", "StochasticRSI@tv-basicstudies"]} />
            </div>
            <SignalCard title="IHSG Signal" data={data} timeframe={activeTimeframe.toUpperCase()} />
          </div>

          {/* Stock Signals Table */}
          <div className="rounded-xl border border-surface-200 bg-surface/60 overflow-hidden">
            <div className="p-3 border-b border-surface-200 flex items-center justify-between">
              <h2 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <TrendingUp size={14} className="text-primary-400" /> Top Signals - LQ45 Stocks
              </h2>
              <span className="text-[10px] text-text-muted">Wyckoff • Gann • Risk Management</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead><tr className="border-b border-surface-100 text-text-muted">
                  <th className="text-left px-2 py-1.5">Stock</th>
                  <th className="text-center px-2 py-1.5">Signal</th>
                  <th className="text-center px-2 py-1.5">Conf</th>
                  <th className="text-right px-2 py-1.5">Price</th>
                  <th className="text-right px-2 py-1.5">Entry</th>
                  <th className="text-right px-2 py-1.5">SL</th>
                  <th className="text-right px-2 py-1.5">TP1</th>
                  <th className="text-right px-2 py-1.5">TP2</th>
                  <th className="text-center px-2 py-1.5">R:R</th>
                  <th className="text-left px-2 py-1.5 hidden lg:table-cell">Reason</th>
                </tr></thead>
                <tbody className="divide-y divide-surface-100">
                  {SIGNALS.stocks.map(s => (
                    <tr key={s.symbol} className="hover:bg-surface-100/50">
                      <td className="px-2 py-2 font-bold text-text-primary">{s.symbol}</td>
                      <td className="px-2 py-2 text-center">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                          s.signal === "BUY" ? "bg-green-500/15 text-green-400" :
                          s.signal === "SELL" ? "bg-red-500/15 text-red-400" : "bg-yellow-500/15 text-yellow-400"
                        }`}>{s.signal === "BUY" ? "▲ BUY" : s.signal === "SELL" ? "▼ SELL" : "● HOLD"}</span>
                      </td>
                      <td className="px-2 py-2 text-center font-mono">{s.conf}%</td>
                      <td className="px-2 py-2 text-right font-mono text-text-primary">{s.price}</td>
                      <td className="px-2 py-2 text-right font-mono text-text-primary">{s.entry}</td>
                      <td className="px-2 py-2 text-right font-mono text-loss">{s.sl}</td>
                      <td className="px-2 py-2 text-right font-mono text-gain">{s.tp1}</td>
                      <td className="px-2 py-2 text-right font-mono text-gain">{s.tp2}</td>
                      <td className="px-2 py-2 text-center font-mono text-text-primary">{s.rr}</td>
                      <td className="px-2 py-2 text-text-muted text-[9px] hidden lg:table-cell max-w-[200px] truncate">{s.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pair Trading */}
          <div className="rounded-xl border border-surface-200 bg-surface/60 overflow-hidden">
            <div className="p-3 border-b border-surface-200">
              <h2 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <Activity size={14} className="text-orange-400" /> Pair Trading Analysis
              </h2>
              <p className="text-[10px] text-text-muted">Saham berkorelasi tinggi • Z-score based • Mean-reversion</p>
            </div>
            <div className="p-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {PAIR_TRADES.map(p => (
                  <div key={p.pair} className="p-3 rounded-lg bg-surface-100 border border-surface-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-text-primary">{p.pair}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-200 text-text-muted">Z: {p.zscore.toFixed(1)}</span>
                    </div>
                    <p className="text-xs font-semibold text-primary-400 mb-1">{p.entry}</p>
                    <div className="flex justify-between text-[10px] text-text-muted">
                      <span>SL: {p.sl}</span>
                      <span>TP: {p.tp}</span>
                      <span>Conf: {p.conf}%</span>
                    </div>
                    <div className="mt-1.5 h-1.5 rounded-full bg-surface-200 overflow-hidden">
                      <div className={`h-full rounded-full ${p.conf >= 70 ? "bg-green-500" : p.conf >= 60 ? "bg-yellow-500" : "bg-red-500"}`}
                        style={{ width: `${p.conf}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* TV Widgets */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div className="rounded-xl border border-surface-200 bg-surface/60 overflow-hidden">
              <div className="p-3 border-b border-surface-200"><h2 className="text-sm font-bold text-text-primary">Technicals Summary</h2></div>
              <TVTechnicalAnalysis symbol="IDX:COMPOSITE" />
            </div>
            <div className="rounded-xl border border-surface-200 bg-surface/60 overflow-hidden">
              <TVMarketOverview height={450} />
            </div>
          </div>

          <p className="text-xs text-text-muted italic">*Analisis berdasarkan Wyckoff, Gann, MACD, RSI, Volume, S/R, Timeframe Confluence. Bukan saran investasi.</p>
        </main>
      </div>
    </div>
  );
}
