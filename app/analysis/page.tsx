"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import TickerTape from "@/components/TickerTape";
import { TVAdvancedChart, TVMarketOverview, TVTechnicalAnalysis } from "@/components/TradingViewWidgets";
import { formatNumber, formatPercent, cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, BarChart3, Activity, ChevronDown, ChevronUp, Shield, Target, AlertTriangle, Brain, Clock, Layers } from "lucide-react";

// ============================================================
// DATA SINYAL TEKNIKAL
// ============================================================

const SIGNALS = {
  ihsg: {
    daily: {
      signal: "BUY", confidence: 78, price: 6245,
      entry: { min: 6200, max: 6250 },
      sl: 6120, slPercent: -2.0,
      tp1: 6420, tp1Percent: 3.2,
      tp2: 6600, tp2Percent: 6.1,
      rr: "1:2.6",
      wyckoff: "Phase C (Spring) terkonfirmasi. Volume meningkat saat harga menguji support 6.150 dan memantul. Accumulation terdeteksi.",
      gann: "Gann Square of 9 menunjukkan support di 6.120. Cycle time 45 hari dari swing low terakhir. Resistance di 6.420.",
      pair: "BBRI/BBCA rasio mendekati support historis. Posisi long BBCA vs short BBRI disarankan.",
      risk: "Jika IHSG turun di bawah 6.120, tren berbalik bearish. Target berikutnya 6.000.",
    },
    h4: {
      signal: "BUY", confidence: 65, price: 6240,
      entry: { min: 6200, max: 6240 },
      sl: 6150, slPercent: -1.4,
      tp1: 6350, tp1Percent: 1.8,
      tp2: 6450, tp2Percent: 3.4,
      rr: "1:2.0",
      wyckoff: "UTAD (Upthrust After Distribution) terbentuk. Waspada potensi reversal.",
      gann: "Gann Fan 1x1 support di 6.150. Break di atas 6.300 konfirmasi uptrend.",
      pair: null,
      risk: "Volume menurun. Konfirmasi diperlukan untuk entry.",
    },
    h1: {
      signal: "NEUTRAL", confidence: 45, price: 6238,
      entry: { min: 0, max: 0 },
      sl: 6190, slPercent: -0.8,
      tp1: 6280, tp1Percent: 0.7,
      tp2: 0, tp2Percent: 0,
      rr: "1:1.1",
      wyckoff: "Range-bound. Tidak ada sinyal clear. Tunggu breakout di atas 6.280 atau breakdown di bawah 6.190.",
      gann: "Gann angle 2x1 resistance di 6.280. Sideways konsolidasi.",
      pair: null,
      risk: "Range sempit. Tunggu konfirmasi breakout.",
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

function SignalCard({ title, data, timeframe }: { title: string; data: typeof SIGNALS.ihsg.daily | typeof SIGNALS.ihsg.h4; timeframe: string }) {
  const colors = {
    BUY: { bg: "bg-green-500/10 border-green-500/30 text-green-400", text: "BUY ▲" },
    SELL: { bg: "bg-red-500/10 border-red-500/30 text-red-400", text: "SELL ▼" },
    NEUTRAL: { bg: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400", text: "NEUTRAL ◆" },
    HOLD: { bg: "bg-blue-500/10 border-blue-500/30 text-blue-400", text: "HOLD ●" },
  };
  const c = colors[data.signal as keyof typeof colors] || colors.NEUTRAL;

  return (
    <div className="rounded-xl border border-surface-200 bg-surface/60 overflow-hidden">
      <div className="p-3 border-b border-surface-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-primary-400" />
          <h3 className="text-sm font-bold text-text-primary">{title}</h3>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-surface-200 text-text-muted font-mono">{timeframe}</span>
        </div>
        <div className={`px-2.5 py-1 rounded-lg border text-xs font-bold ${c.bg}`}>{c.text}</div>
      </div>
      <div className="p-3 space-y-3">
        {/* Main Signal */}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold font-mono text-text-primary">{formatNumber(data.price)}</span>
          <div className="flex items-center gap-1">
            <span className="text-xs text-text-muted">Confidence:</span>
            <div className="w-20 h-2 rounded-full bg-surface-200 overflow-hidden">
              <div className={`h-full rounded-full ${data.confidence >= 70 ? "bg-green-500" : data.confidence >= 50 ? "bg-yellow-500" : "bg-red-500"}`}
                style={{ width: `${data.confidence}%` }} />
            </div>
            <span className="text-xs font-bold font-mono" style={{ color: data.confidence >= 70 ? "#22c55e" : data.confidence >= 50 ? "#eab308" : "#ef4444" }}>
              {data.confidence}%
            </span>
          </div>
        </div>

        {/* Levels */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="p-2 rounded-lg bg-surface-100">
            <p className="text-[9px] text-text-muted">Entry</p>
            <p className="text-xs font-bold font-mono text-text-primary">
              {data.entry.min > 0 ? `${formatNumber(data.entry.min)} - ${formatNumber(data.entry.max)}` : "Menunggu"}
            </p>
          </div>
          <div className="p-2 rounded-lg bg-surface-100">
            <p className="text-[9px] text-text-muted">Stop Loss</p>
            <p className="text-xs font-bold font-mono text-loss">{formatNumber(data.sl)}<span className="text-[9px] ml-1">({data.slPercent}%)</span></p>
          </div>
          <div className="p-2 rounded-lg bg-surface-100">
            <p className="text-[9px] text-text-muted">TP1</p>
            <p className="text-xs font-bold font-mono text-gain">{data.tp1 > 0 ? formatNumber(data.tp1) : "-"}<span className="text-[9px] ml-1">({data.tp1Percent}%)</span></p>
          </div>
          <div className="p-2 rounded-lg bg-surface-100">
            <p className="text-[9px] text-text-muted">TP2 / R:R</p>
            <p className="text-xs font-bold font-mono text-gain">{data.tp2 > 0 ? formatNumber(data.tp2) : "-"} / <span className="text-text-primary">{data.rr}</span></p>
          </div>
        </div>

        {/* Analysis Methods */}
        <div className="space-y-2">
          <MethodCard icon={Target} title="Wyckoff Analysis" content={data.wyckoff} color="text-blue-400" />
          <MethodCard icon={Layers} title="Gann Analysis" content={data.gann} color="text-purple-400" />
          {data.pair && <MethodCard icon={Activity} title="Pair Trading Signal" content={data.pair} color="text-orange-400" />}
          <MethodCard icon={AlertTriangle} title="Risk Management" content={data.risk} color="text-yellow-400" />
        </div>
      </div>
    </div>
  );
}

function MethodCard({ icon: Icon, title, content, color }: { icon: React.ElementType; title: string; content: string; color: string }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="rounded-lg bg-surface-100 border border-surface-200 overflow-hidden">
      <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center justify-between p-2 text-left">
        <div className="flex items-center gap-1.5">
          <Icon size={12} className={color} />
          <span className="text-[10px] font-semibold text-text-primary">{title}</span>
        </div>
        {expanded ? <ChevronUp size={12} className="text-text-muted" /> : <ChevronDown size={12} className="text-text-muted" />}
      </button>
      {expanded && <div className="px-2 pb-2"><p className="text-[10px] text-text-secondary leading-relaxed">{content}</p></div>}
    </div>
  );
}

export default function AnalysisPage() {
  const [activeTimeframe, setActiveTimeframe] = useState("daily");
  const [chartSymbol, setChartSymbol] = useState("IDX:COMPOSITE");
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
              { key: "daily", label: "Daily", desc: "Swing Trading" },
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
            {/* Chart */}
            <div className="rounded-xl border border-surface-200 bg-surface/60 overflow-hidden" style={{ height: 500 }}>
              <TVAdvancedChart symbol={chartSymbol} studies={["RSI@tv-basicstudies", "MACD@tv-basicstudies", "MASimple@tv-basicstudies", "BollingerBands@tv-basicstudies", "StochasticRSI@tv-basicstudies"]} />
            </div>
            {/* Signal Card */}
            <SignalCard title="IHSG Signal" data={data} timeframe={activeTimeframe.toUpperCase()} />
          </div>

          {/* Stock Signals */}
          <div className="rounded-xl border border-surface-200 bg-surface/60 overflow-hidden">
            <div className="p-3 border-b border-surface-200 flex items-center justify-between">
              <h2 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <TrendingUp size={14} className="text-primary-400" /> Top Signals - LQ45 Stocks
              </h2>
              <span className="text-[10px] text-text-muted">Multi-method analysis: Wyckoff • Gann • Risk Mgmt</span>
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
                    <tr key={s.symbol} className="hover:bg-surface-100/50 transition-colors">
                      <td className="px-2 py-2 font-bold text-text-primary">{s.symbol}</td>
                      <td className="px-2 py-2 text-center">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                          s.signal === "BUY" ? "bg-green-500/15 text-green-400" :
                          s.signal === "SELL" ? "bg-red-500/15 text-red-400" :
                          "bg-yellow-500/15 text-yellow-400"
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
              <p className="text-[10px] text-text-muted">Saham berkorelasi tinggi • Z-score based • Mean-reversion strategy</p>
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

          {/* TV Technical Analysis + Market Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div className="rounded-xl border border-surface-200 bg-surface/60 overflow-hidden">
              <div className="p-3 border-b border-surface-200"><h2 className="text-sm font-bold text-text-primary">Technical Analysis Summary</h2></div>
              <TVTechnicalAnalysis symbol="IDX:COMPOSITE" />
            </div>
            <div className="rounded-xl border border-surface-200 bg-surface/60 overflow-hidden">
              <TVMarketOverview height={450} />
            </div>
          </div>

          <p className="text-xs text-text-muted italic">*Analisis berdasarkan Wyckoff, Gann, Pair Trading, dan Risk Management. Bukan saran investasi.</p>
        </main>
      </div>
    </div>
  );
}
