"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import TickerTape from "@/components/TickerTape";
import { useTheme } from "@/providers/ThemeProvider";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { Settings, Palette, Type, Eye, EyeOff, Save } from "lucide-react";

const themeOptions = [
  { id: "default" as const, name: "Default Emerald", desc: "Tema gelap dengan aksen hijau emerald", preview: "bg-gradient-to-br from-emerald-900 to-slate-900" },
  { id: "bloomberg" as const, name: "Bloomberg", desc: "Biru tua dengan aksen kuning khas Bloomberg", preview: "bg-gradient-to-br from-blue-950 to-yellow-900" },
  { id: "retro" as const, name: "Retro 8-bit", desc: "Font pixel dengan border tebal dan warna cerah", preview: "bg-gradient-to-br from-purple-950 to-green-950" },
];

export default function SettingsPage() {
  const { data: session } = useSession();
  const { theme, setTheme, fontSize, setFontSize, tickerEnabled, setTickerEnabled, sidebarOpen, setSidebarOpen } = useTheme();
  const [saving, setSaving] = useState(false);

  const saveSettings = async () => {
    setSaving(true);
    try {
      // Save to database
      await fetch("/api/user-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme, fontSize, tickerEnabled, sidebarOpen }),
      });
      toast.success("Pengaturan disimpan");
    } catch {
      toast.error("Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <TickerTape />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 lg:p-6 max-w-3xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-lg font-bold text-text-primary">Pengaturan</h1>
              <p className="text-xs text-text-muted">Sesuaikan tampilan NERV StockBot sesuai preferensi Anda</p>
            </div>
            <button
              onClick={saveSettings}
              disabled={saving}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white text-sm rounded-lg transition-colors flex items-center gap-2"
            >
              <Save size={14} />
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>

          {/* Theme */}
          <section className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Palette size={16} className="text-primary-400" />
              <h2 className="text-sm font-semibold text-text-primary">Tema Tampilan</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {themeOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setTheme(opt.id)}
                  className={`rounded-xl border p-3 text-left transition-all ${
                    theme === opt.id
                      ? "border-primary-500 ring-1 ring-primary-500/50"
                      : "border-surface-200 hover:border-surface-300"
                  }`}
                >
                  <div className={`h-20 rounded-lg mb-2 ${opt.preview} flex items-center justify-center`}>
                    {theme === opt.id && <span className="text-2xl">✓</span>}
                  </div>
                  <p className="text-sm font-semibold text-text-primary">{opt.name}</p>
                  <p className="text-[10px] text-text-muted mt-0.5">{opt.desc}</p>
                </button>
              ))}
            </div>
          </section>

          {/* Font Size */}
          <section className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Type size={16} className="text-primary-400" />
              <h2 className="text-sm font-semibold text-text-primary">Ukuran Font</h2>
            </div>
            <div className="flex gap-2">
              {(["small", "medium", "large"] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => setFontSize(size)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                    fontSize === size
                      ? "border-primary-500 bg-primary-900/20 text-primary-400"
                      : "border-surface-200 text-text-muted hover:text-text-primary hover:border-surface-300"
                  }`}
                >
                  <span className={size === "small" ? "text-xs" : size === "medium" ? "text-sm" : "text-base"}>
                    {size === "small" ? "Kecil" : size === "medium" ? "Sedang" : "Besar"}
                  </span>
                </button>
              ))}
            </div>
            <div className="mt-3">
              <input
                type="range"
                min={0}
                max={2}
                value={["small", "medium", "large"].indexOf(fontSize)}
                onChange={(e) => setFontSize(["small", "medium", "large"][parseInt(e.target.value)] as any)}
                className="w-full accent-primary-500"
              />
              <div className="flex justify-between text-[10px] text-text-muted mt-1">
                <span>Aa</span>
                <span>Aa</span>
                <span>Aa</span>
              </div>
            </div>
          </section>

          {/* Preferences */}
          <section className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Eye size={16} className="text-primary-400" />
              <h2 className="text-sm font-semibold text-text-primary">Preferensi Lainnya</h2>
            </div>
            <div className="space-y-3 rounded-xl border border-surface-200 bg-surface/60 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-primary">Ticker Tape</p>
                  <p className="text-xs text-text-muted">Tampilkan ticker berjalan di atas halaman</p>
                </div>
                <button
                  onClick={() => setTickerEnabled(!tickerEnabled)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${tickerEnabled ? "bg-primary-600" : "bg-surface-300"}`}
                >
                  <div className={`absolute w-5 h-5 rounded-full bg-white top-0.5 transition-transform ${tickerEnabled ? "translate-x-5.5" : "translate-x-0.5"}`} style={{ transform: tickerEnabled ? "translateX(22px)" : "translateX(2px)" }} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-primary">Sidebar</p>
                  <p className="text-xs text-text-muted">Tampilkan sidebar navigasi</p>
                </div>
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${sidebarOpen ? "bg-primary-600" : "bg-surface-300"}`}
                >
                  <div className={`absolute w-5 h-5 rounded-full bg-white top-0.5 transition-transform ${sidebarOpen ? "translate-x-5.5" : "translate-x-0.5"}`} style={{ transform: sidebarOpen ? "translateX(22px)" : "translateX(2px)" }} />
                </button>
              </div>
            </div>
          </section>

          {/* Account info */}
          <section>
            <h2 className="text-sm font-semibold text-text-primary mb-3">Informasi Akun</h2>
            <div className="rounded-xl border border-surface-200 bg-surface/60 p-3 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-text-muted">Email</span>
                <span className="text-sm text-text-primary">{session?.user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-text-muted">Nama</span>
                <span className="text-sm text-text-primary">{session?.user?.name || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-text-muted">Status</span>
                <span className="text-sm text-green-400">Premium ✨ (Akses Penuh)</span>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
