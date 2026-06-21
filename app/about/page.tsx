"use client";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import TickerTape from "@/components/TickerTape";
import { Github, Mail, Globe, ExternalLink, Code, Zap } from "lucide-react";
import Logo from "@/components/Logo";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <TickerTape />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 lg:p-6">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Logo & Header */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Logo size="lg" />
              </div>
              <h1 className="text-2xl font-bold text-text-primary">NERV StockBot</h1>
              <p className="text-sm text-text-muted mt-1">Platform Analisis Saham Indonesia Real-Time</p>
              <p className="text-xs text-text-muted">100% Gratis — Tanpa Premium</p>
            </div>

            {/* Developer Card */}
            <div className="rounded-xl border border-surface-200 bg-surface/60 p-6 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                IH
              </div>
              <h2 className="text-lg font-bold text-text-primary">Ikhwanul Hakim</h2>
              <p className="text-sm text-text-muted">Pengembang & Analis</p>
              <div className="flex items-center justify-center gap-3 mt-4">
                <a href="mailto:ikhwanulha@gmail.com"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-100 hover:bg-surface-200 border border-surface-300 text-text-secondary hover:text-text-primary text-xs transition-colors">
                  <Mail size={14} /> ikhwanulha@gmail.com
                </a>
                <a href="https://github.com/ikhwanulha" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-100 hover:bg-surface-200 border border-surface-300 text-text-secondary hover:text-text-primary text-xs transition-colors">
                  <Github size={14} /> ikhwanulha
                </a>
              </div>
            </div>

            {/* About the Project */}
            <div className="rounded-xl border border-surface-200 bg-surface/60 p-6">
              <h2 className="text-sm font-bold text-text-primary mb-3 flex items-center gap-2">
                <Code size={16} className="text-primary-400" /> Tentang Proyek
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                NERV StockBot adalah platform analisis saham Indonesia yang dibangun untuk 
                mendemokratisasi akses ke alat analisis profesional. Dengan data real-time dari 
                TradingView dan Yahoo Finance, pengguna dapat mengakses chart interaktif, 
                analisis teknikal, screening saham, dan berbagai fitur lainnya — 
                <strong className="text-emerald-400"> gratis selamanya</strong>.
              </p>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="p-3 rounded-lg bg-surface-100">
                  <p className="text-xs font-semibold text-text-primary">Teknologi</p>
                  <p className="text-[10px] text-text-muted mt-1">Next.js 14 • TypeScript • Tailwind CSS • Prisma • PostgreSQL</p>
                </div>
                <div className="p-3 rounded-lg bg-surface-100">
                  <p className="text-xs font-semibold text-text-primary">Data</p>
                  <p className="text-[10px] text-text-muted mt-1">TradingView • Yahoo Finance • Groq AI</p>
                </div>
                <div className="p-3 rounded-lg bg-surface-100">
                  <p className="text-xs font-semibold text-text-primary">Hosting</p>
                  <p className="text-[10px] text-text-muted mt-1">Vercel • Neon PostgreSQL</p>
                </div>
                <div className="p-3 rounded-lg bg-surface-100">
                  <p className="text-xs font-semibold text-text-primary">Repository</p>
                  <a href="https://github.com/ikhwanulha/nerv-stockbot" target="_blank" rel="noopener noreferrer"
                    className="text-[10px] text-primary-400 hover:text-primary-300 flex items-center gap-1 mt-1">
                    github.com/ikhwanulha/nerv-stockbot <ExternalLink size={10} />
                  </a>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="rounded-xl border border-surface-200 bg-surface/60 p-6">
              <h2 className="text-sm font-bold text-text-primary mb-3 flex items-center gap-2">
                <Zap size={16} className="text-primary-400" /> Fitur Unggulan
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  "Chart interaktif TradingView",
                  "Analisis Wyckoff & Gann",
                  "Signal Detector (Entry/SL/TP)",
                  "Stock Screener multi-filter",
                  "Pair Trading Analysis",
                  "Research Report PDF",
                  "Watchlist & Portfolio Virtual",
                  "AI Analyst Chatbot",
                  "News & Sentiment Analysis",
                  "Multi-tema (Dark/Bloomberg)",
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-text-secondary">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                    {f}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-text-muted pt-2">
              <p>&copy; {new Date().getFullYear()} NERV StockBot. All rights reserved.</p>
              <p className="mt-1">Dikembangkan dengan ❤️ oleh <a href="mailto:ikhwanulha@gmail.com" className="text-primary-400 hover:text-primary-300">Ikhwanul Hakim</a></p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
