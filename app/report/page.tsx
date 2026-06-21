"use client";

import { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import TickerTape from "@/components/TickerTape";
import { formatNumber, formatPercent, formatCurrency } from "@/lib/utils";
import { FileText, Download, TrendingUp, TrendingDown, AlertTriangle, BarChart3, Activity, Globe } from "lucide-react";

// ============================================================
// RESEARCH REPORT DATA
// ============================================================
const REPORT = {
  date: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
  ihsg: { price: 6245, change: 18, changePercent: 0.29, s2: 5700, s1: 5780, r1: 5950, r2: 6010 },
  bias: "Cautiously Bullish" as const,
  biasScore: { fear: 25, neutral: 25, greed: 50 },
  strategyAlloc: [
    { name: "Swing Trade (20 stocks)", pct: 50, hold: "3-10 days" },
    { name: "Day Trade (10 stocks)", pct: 25, hold: "Intraday" },
    { name: "Scalping (10 stocks)", pct: 25, hold: "Minutes-Hours" },
  ],
  signals: [
    { symbol: "TPIA", score: 92, rec: "BUY", entry: "1,650-1,800", tgt: 2200, sl: 1650, reason: "Divestasi free float 25.7%, PE 6x, MSCI re-entry", nfb: 97.2, sector: "Basic Industry", hold: "5-10 days" },
    { symbol: "BUMI", score: 88, rec: "BUY", entry: "135-142", tgt: 180, sl: 125, reason: "Coal HBA $121.83, energy supercycle, YTD +238%", nfb: 28.7, sector: "Mining", hold: "5-10 days" },
    { symbol: "ADRO", score: 86, rec: "BUY", entry: "2,200-2,340", tgt: 2650, sl: 2080, reason: "Coal price surge, dividend play, analyst TP 2,550", nfb: -8.2, sector: "Mining", hold: "7-10 days" },
    { symbol: "MEDC", score: 85, rec: "BUY", entry: "1,200-1,250", tgt: 1600, sl: 1100, reason: "Oil $90/bbl, corridor acquisition, TP Rp 1,800-2,600", nfb: 18.3, sector: "Energy", hold: "7-10 days" },
    { symbol: "TLKM", score: 84, rec: "BUY", entry: "2,800-2,900", tgt: 3300, sl: 2700, reason: "Buyback Rp 1T, defensive play, div yield ~4%", nfb: 72.8, sector: "Telecom", hold: "5-7 days" },
    { symbol: "ANTM", score: 83, rec: "BUY", entry: "2,650-2,750", tgt: 3200, sl: 2500, reason: "Gold $4,096, nickel recovery, energy transition", nfb: 55.9, sector: "Mining", hold: "5-7 days" },
  ],
  macro: {
    biRate: "5.50% ▲",
    inflasi: "3.08% YoY",
    rupiah: "Rp 17,738/USD",
    pdb: "5.61%",
    sp500: "7,600 ATH",
    oil: "$78.97/bbl",
    gold: "$2,340/oz",
    cpo: "MYR 4,493",
  },
  riskFactors: [
    { level: "ELEVATED", text: "AS-Iran peace deal gagal → market crash potensial" },
    { level: "HIGH", text: "Fed hawkish FOMC → capital flight EM" },
    { level: "HIGH", text: "BREN continued breakdown → drag IHSG >50pts" },
    { level: "MOD", text: "Rupiah depreciasi ke Rp19,000/USD → BI rate hike" },
    { level: "MOD", text: "Foreign net sell sustain >Rp1T/hari" },
  ],
};

export default function ReportPage() {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  const exportPDF = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <TickerTape />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 lg:p-6">
          {/* Export Controls */}
          <div className="flex items-center justify-between mb-4 print:hidden">
            <h1 className="text-lg font-bold text-text-primary flex items-center gap-2">
              <FileText size={18} className="text-primary-400" /> Research Report
            </h1>
            <button onClick={exportPDF} disabled={isPrinting}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white text-sm rounded-lg flex items-center gap-2 transition-colors">
              <Download size={16} /> {isPrinting ? "Menyiapkan..." : "Download PDF"}
            </button>
          </div>

          {/* Report Content */}
          <div ref={reportRef} className="max-w-4xl mx-auto space-y-4 bg-surface rounded-xl border border-surface-200 p-4 lg:p-8 print:border-0 print:p-0 print:bg-white print:text-black">
            {/* HEADER */}
            <div className="text-center border-b-2 border-primary-500 pb-4">
              <h1 className="text-xl font-bold text-text-primary print:text-black">NERV STOCKBOT</h1>
              <h2 className="text-lg font-semibold text-primary-400 print:text-primary-600">AI RESEARCH REPORT</h2>
              <p className="text-xs text-text-muted print:text-gray-600">Indonesia Equity • Multi-Strategy Portfolio Analysis</p>
              <p className="text-xs text-text-muted print:text-gray-600">{REPORT.date}</p>
            </div>

            {/* EXECUTIVE SUMMARY */}
            <div className="border rounded-lg p-3">
              <h3 className="text-sm font-bold mb-2 text-text-primary print:text-black">Executive Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-2xl font-bold font-mono text-text-primary print:text-black">{formatNumber(REPORT.ihsg.price)}</span>
                    <span className={`text-sm ${REPORT.ihsg.change >= 0 ? "text-gain print:text-green-600" : "text-loss print:text-red-600"}`}>
                      {REPORT.ihsg.change >= 0 ? "▲" : "▼"} {REPORT.ihsg.change} ({formatPercent(REPORT.ihsg.changePercent)})
                    </span>
                  </div>
                  <p className="text-xs text-text-muted mb-2">IHSG • {REPORT.date}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold">Bias:</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400 print:bg-yellow-100 print:text-yellow-800">{REPORT.bias}</span>
                  </div>
                  {/* Gauge Meter */}
                  <div className="flex items-center gap-0 mt-2 h-2 rounded-full overflow-hidden">
                    <div className="bg-red-500 h-full" style={{ width: `${REPORT.biasScore.fear}%` }} />
                    <div className="bg-yellow-500 h-full" style={{ width: `${REPORT.biasScore.neutral}%` }} />
                    <div className="bg-green-500 h-full" style={{ width: `${REPORT.biasScore.greed}%` }} />
                  </div>
                  <div className="flex justify-between text-[9px] text-text-muted mt-0.5">
                    <span>Fear 25%</span>
                    <span>Neutral 25%</span>
                    <span>Greed 50%</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded bg-surface-100 print:bg-gray-100">
                    <span className="text-text-muted print:text-gray-500">S2</span>
                    <p className="font-mono font-bold text-loss">{formatNumber(REPORT.ihsg.s2)}</p>
                  </div>
                  <div className="p-2 rounded bg-surface-100 print:bg-gray-100">
                    <span className="text-text-muted print:text-gray-500">S1</span>
                    <p className="font-mono font-bold text-loss">{formatNumber(REPORT.ihsg.s1)}</p>
                  </div>
                  <div className="p-2 rounded bg-surface-100 print:bg-gray-100">
                    <span className="text-text-muted print:text-gray-500">R1</span>
                    <p className="font-mono font-bold text-gain print:text-green-600">{formatNumber(REPORT.ihsg.r1)}</p>
                  </div>
                  <div className="p-2 rounded bg-surface-100 print:bg-gray-100">
                    <span className="text-text-muted print:text-gray-500">R2</span>
                    <p className="font-mono font-bold text-gain print:text-green-600">{formatNumber(REPORT.ihsg.r2)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* STRATEGY ALLOCATION */}
            <div className="border rounded-lg p-3">
              <h3 className="text-sm font-bold mb-2 text-text-primary print:text-black">Strategy Allocation</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {REPORT.strategyAlloc.map(s => (
                  <div key={s.name} className="p-2 rounded bg-surface-100 print:bg-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-text-primary print:text-black">{s.name.split("(")[0].trim()}</span>
                      <span className="text-lg font-bold text-primary-400">{s.pct}%</span>
                    </div>
                    <p className="text-[10px] text-text-muted">{s.hold}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* TOP SIGNALS */}
            <div className="border rounded-lg p-3">
              <h3 className="text-sm font-bold mb-2 text-text-primary print:text-black">Top Swing Trade Signals</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-surface-200 print:border-gray-300 text-text-muted print:text-gray-500">
                      <th className="text-left py-1 pr-2">Stock</th>
                      <th className="text-center py-1 px-1">Score</th>
                      <th className="text-center py-1 px-1">Rec</th>
                      <th className="text-right py-1 px-1">Entry</th>
                      <th className="text-right py-1 px-1">Target</th>
                      <th className="text-right py-1 px-1">SL</th>
                      <th className="text-right py-1 px-2">NFB</th>
                      <th className="text-left py-1 pl-2 hidden md:table-cell">Reason</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-100 print:divide-gray-200">
                    {REPORT.signals.map(s => (
                      <tr key={s.symbol}>
                        <td className="py-1.5 pr-2 font-bold text-text-primary print:text-black">{s.symbol}</td>
                        <td className="py-1.5 px-1 text-center text-primary-400">{s.score}/100</td>
                        <td className="py-1.5 px-1 text-center">
                          <span className={`px-1 py-0.5 rounded text-[9px] font-bold ${
                            s.rec === "BUY" ? "bg-green-500/15 text-green-600" : "bg-red-500/15 text-red-600"
                          } print:bg-green-100 print:text-green-700`}>{s.rec}</span>
                        </td>
                        <td className="py-1.5 px-1 text-right font-mono">{s.entry}</td>
                        <td className="py-1.5 px-1 text-right font-mono text-gain print:text-green-600">{formatNumber(s.tgt)}</td>
                        <td className="py-1.5 px-1 text-right font-mono text-loss print:text-red-600">{formatNumber(s.sl)}</td>
                        <td className="py-1.5 px-2 text-right font-mono">{s.nfb > 0 ? `+Rp${s.nfb}B` : `-Rp${Math.abs(s.nfb)}B`}</td>
                        <td className="py-1.5 pl-2 text-text-muted text-[9px] hidden md:table-cell">{s.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* MACRO DASHBOARD */}
            <div className="border rounded-lg p-3">
              <h3 className="text-sm font-bold mb-2 flex items-center gap-2 text-text-primary print:text-black">
                <Globe size={14} /> Macro Dashboard
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 text-xs">
                {Object.entries(REPORT.macro).map(([key, val]) => (
                  <div key={key} className="p-2 rounded bg-surface-100 print:bg-gray-100">
                    <p className="text-[9px] text-text-muted print:text-gray-500 capitalize">{key.replace(/([A-Z])/g, " $1")}</p>
                    <p className="font-mono font-bold text-text-primary print:text-black">{val}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* RISK FACTORS */}
            <div className="border rounded-lg p-3">
              <h3 className="text-sm font-bold mb-2 flex items-center gap-2 text-text-primary print:text-black">
                <AlertTriangle size={14} className="text-yellow-400" /> Risk Factors
              </h3>
              <div className="space-y-1">
                {REPORT.riskFactors.map(r => (
                  <div key={r.text} className="flex items-start gap-2 text-xs">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold whitespace-nowrap ${
                      r.level === "ELEVATED" ? "bg-red-500/20 text-red-400 print:bg-red-100 print:text-red-700" :
                      r.level === "HIGH" ? "bg-orange-500/20 text-orange-400 print:bg-orange-100 print:text-orange-700" :
                      "bg-yellow-500/20 text-yellow-400 print:bg-yellow-100 print:text-yellow-700"
                    }`}>{r.level}</span>
                    <span className="text-text-secondary print:text-gray-600">{r.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* FOOTER */}
            <div className="text-center text-[9px] text-text-muted pt-2 border-t border-surface-200 print:border-gray-300 print:text-gray-400">
              <p>NERV StockBot AI Research Report • {REPORT.date}</p>
              <p>Data sources: IDX • BEI • TradingView • Yahoo Finance</p>
              <p className="italic">Bukan saran investasi. Selalu lakukan riset sendiri.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
