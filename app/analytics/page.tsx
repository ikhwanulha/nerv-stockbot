"use client";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import TickerTape from "@/components/TickerTape";
import { TVScreener, TVHeatmap, TVMarketOverview } from "@/components/TradingViewWidgets";
import { BarChart3, TrendingUp, TrendingDown, PieChart, Activity } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <TickerTape />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 lg:p-6 space-y-4">
          <h1 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <BarChart3 size={18} className="text-primary-400" /> Analytics & Market Overview
          </h1>

          {/* Market Heatmap */}
          <div className="rounded-xl border border-surface-200 bg-surface/60 overflow-hidden">
            <div className="p-3 border-b border-surface-200">
              <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                <Activity size={14} className="text-primary-400" /> Market Heatmap
              </h2>
            </div>
            <TVHeatmap height={500} />
          </div>

          {/* Market Overview */}
          <div className="rounded-xl border border-surface-200 bg-surface/60 overflow-hidden">
            <div className="p-3 border-b border-surface-200">
              <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                <PieChart size={14} className="text-primary-400" /> Market Overview (Global)
              </h2>
            </div>
            <TVMarketOverview height={400} />
          </div>

          {/* Market Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Saham Naik", value: "245", color: "text-green-400", icon: TrendingUp },
              { label: "Saham Turun", value: "187", color: "text-red-400", icon: TrendingDown },
              { label: "Volume Total", value: "Rp 12.5T", color: "text-blue-400", icon: Activity },
              { label: "Net Asing", value: "+Rp 450M", color: "text-green-400", icon: TrendingUp },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-surface-200 bg-surface/60 p-4 text-center">
                <item.icon size={20} className={`mx-auto mb-2 ${item.color}`} />
                <p className="text-lg font-bold text-text-primary">{item.value}</p>
                <p className="text-[10px] text-text-muted">{item.label}</p>
              </div>
            ))}
          </div>

          {/* Screener */}
          <div className="rounded-xl border border-surface-200 bg-surface/60 overflow-hidden">
            <div className="p-3 border-b border-surface-200">
              <h2 className="text-sm font-semibold text-text-primary">Stock Screener (TradingView)</h2>
              <p className="text-[10px] text-text-muted">Filter saham berdasarkan harga, volume, indikator teknikal & fundamental</p>
            </div>
            <TVScreener height={550} />
          </div>

          <p className="text-xs text-text-muted italic">*Data real-time dari TradingView. Update otomatis setiap detik.</p>
        </main>
      </div>
    </div>
  );
}
