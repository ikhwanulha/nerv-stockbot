"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, CheckCircle, XCircle, Brain } from "lucide-react";

// Tipe data untuk alasan sinyal
export interface SignalReasonLine {
  icon: string;
  text: string;
  ok: boolean;
}

export interface SignalReasonGroup {
  id: string;
  label: string;
  data: {
    status: boolean;
    lines: SignalReasonLine[];
  };
}

export const DEFAULT_SIGNAL_REASONS: SignalReasonGroup[] = [
  {
    id: "wyckoff", label: "WYCKOFF METHOD",
    data: { status: true, lines: [
      { icon: "📊", text: "Volume spike 2.3x rata-rata pada support 6,180", ok: true },
      { icon: "🛡️", text: "Harga bertahan di atas support setelah pengujian", ok: true },
      { icon: "📈", text: "Fase: Akumulasi (accumulation) mulai terkonfirmasi", ok: true },
      { icon: "📋", text: "Volume 15.2M vs Avg 6.6M | Close 6,245 > Support 6,180", ok: true },
    ]}
  },
  {
    id: "gann", label: "GANN SWING",
    data: { status: true, lines: [
      { icon: "📉", text: "Swing Low terbentuk di 6,110 (4 hari lalu)", ok: true },
      { icon: "📈", text: "3 hari berturut-turut naik: +1.2%, +0.8%, +1.5%", ok: true },
      { icon: "✅", text: "Konfirmasi Daily bullish, 4H bullish", ok: true },
      { icon: "📋", text: "Swing Low: 6,110 | Close 6,245 | 3-day return: +3.5%", ok: true },
    ]}
  },
  {
    id: "macd", label: "MACD",
    data: { status: true, lines: [
      { icon: "⚡", text: "Garis MACD menyilang ke atas signal line (bullish crossover)", ok: true },
      { icon: "📊", text: "Histogram mulai membesar (momentum meningkat)", ok: true },
      { icon: "📋", text: "MACD: 12.5 | Signal: 8.3 | Histogram: +4.2", ok: true },
    ]}
  },
  {
    id: "rsi", label: "RSI",
    data: { status: true, lines: [
      { icon: "📊", text: "RSI 54.8 (naik dari 42.3)", ok: true },
      { icon: "🟢", text: "Belum overbought (di bawah 70)", ok: true },
      { icon: "📈", text: "Divergence bullish: Harga turun tapi RSI naik", ok: true },
    ]}
  },
  {
    id: "volume", label: "VOLUME",
    data: { status: true, lines: [
      { icon: "🔥", text: "Volume meningkat 142% dari rata-rata 20 hari", ok: true },
      { icon: "📊", text: "On-balance volume (OBV) naik 3.2% hari ini", ok: true },
      { icon: "📋", text: "Volume 15.2M | Avg 6.6M | OBV Trend: Up", ok: true },
    ]}
  },
  {
    id: "sr", label: "SUPPORT & RESISTANCE",
    data: { status: true, lines: [
      { icon: "🛡️", text: "Support kuat: 6,180 (konfirmasi 3x test)", ok: true },
      { icon: "🎯", text: "Resistance terdekat: 6,450 (swing high sebelumnya)", ok: true },
      { icon: "✅", text: "Jarak ke TP1 masih aman", ok: true },
      { icon: "📋", text: "S: 6,180 | R1: 6,450 | R2: 6,600", ok: true },
    ]}
  },
  {
    id: "timeframe", label: "TIMEFRAME CONFLUENCE",
    data: { status: true, lines: [
      { icon: "📈", text: "Daily: BULLISH (di atas MA20, MA50)", ok: true },
      { icon: "📈", text: "4-Hour: BULLISH (breakout dari resistance)", ok: true },
      { icon: "📈", text: "1-Hour: BULLISH (trend up, MACD positif)", ok: true },
      { icon: "✅", text: "Konfirmasi: 3/3 timeframe bullish", ok: true },
    ]}
  },
];

export function SignalReasonCard({ label, data }: { label: string; data: { status: boolean; lines: SignalReasonLine[] } }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border border-surface-200 rounded-lg overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-2 bg-surface-100 hover:bg-surface-200 transition-colors">
        <div className="flex items-center gap-1.5">
          {data.status ? <CheckCircle size={12} className="text-green-400" /> : <XCircle size={12} className="text-red-400" />}
          <span className="text-[10px] font-bold text-text-primary">{label}</span>
        </div>
        {open ? <ChevronUp size={12} className="text-text-muted" /> : <ChevronDown size={12} className="text-text-muted" />}
      </button>
      {open && (
        <div className="p-2 space-y-0.5">
          {data.lines.map((line, i) => (
            <div key={i} className="flex items-start gap-1.5 text-[10px]">
              <span>{line.ok ? "✅" : "❌"}</span>
              <span className={line.ok ? "text-text-secondary" : "text-text-muted"}>{line.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function SignalReasonsPanel({ reasons, signal }: { reasons: SignalReasonGroup[]; signal: string }) {
  const [show, setShow] = useState(true);
  return (
    <div>
      <button onClick={() => setShow(!show)} className="flex items-center gap-1.5 mb-1.5">
        <Brain size={12} className="text-primary-400" />
        <span className="text-[10px] font-bold text-text-primary">📋 ALASAN SINYAL {signal}</span>
        {show ? <ChevronUp size={12} className="text-text-muted" /> : <ChevronDown size={12} className="text-text-muted" />}
      </button>
      {show && (
        <div className="space-y-1">
          {reasons.map((r) => (
            <SignalReasonCard key={r.id} label={r.label} data={r.data} />
          ))}
        </div>
      )}
    </div>
  );
}
