"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Eye, EyeOff, LogIn, TrendingUp, Shield, Zap, MessageSquare, BarChart3, Bell, Smartphone, CheckCircle, Star, ArrowRight, Menu, X } from "lucide-react";
import Logo from "@/components/Logo";

// TradingView Ticker tape
function TVTicker() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [
        { proName: "FOREXCOM:SPXUSD", title: "S&P 500" },
        { proName: "BITSTAMP:BTCUSD", title: "Bitcoin" },
        { proName: "BITSTAMP:ETHUSD", title: "Ethereum" },
        { description: "Apple", proName: "NASDAQ:AAPL" },
        { description: "Tesla", proName: "NASDAQ:TSLA" },
        { description: "BBCA", proName: "IDX:BBCA" },
        { description: "BBRI", proName: "IDX:BBRI" },
        { description: "BMRI", proName: "IDX:BMRI" },
        { description: "GOTO", proName: "IDX:GOTO" },
        { description: "BYAN", proName: "IDX:BYAN" },
      ],
      showSymbolLogo: true,
      colorTheme: "dark",
      isTransparent: true,
      displayMode: "adaptive",
      locale: "id_ID",
    });
    document.getElementById("tv-ticker")?.appendChild(script);
    return () => { try { script.remove(); } catch {} };
  }, []);

  return <div id="tv-ticker" className="w-full h-[50px]" />;
}

export default function LandingPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const features = [
    { icon: Zap, title: "Akurasi Tinggi", desc: "Data real-time dari TradingView & Yahoo Finance dengan akurasi 99.9%", color: "text-emerald-400" },
    { icon: BarChart3, title: "Analisis Real-time", desc: "Chart interaktif dengan 20+ indikator teknikal & fundamental", color: "text-blue-400" },
    { icon: Bell, title: "Peringatan Dini", desc: "Deteksi sinyal akumulasi/distribusi sebelum pergerakan besar", color: "text-orange-400" },
    { icon: Smartphone, title: "Mudah Digunakan", desc: "Akses dari mana saja, kapan saja. Desktop, tablet, & mobile", color: "text-purple-400" },
  ];

  const whyUs = [
    { icon: CheckCircle, text: "100% Gratis — Tidak Ada Biaya Tersembunyi" },
    { icon: CheckCircle, text: "AI Analyst — Analisis dengan Kecerdasan Buatan" },
    { icon: CheckCircle, text: "Data Real-time — Yahoo Finance & TradingView" },
    { icon: CheckCircle, text: "Multi-Tema — Dark, Bloomberg, Retro 8-bit" },
    { icon: CheckCircle, text: "Portofolio Virtual — Latihan Tanpa Risiko" },
    { icon: CheckCircle, text: "Screener & Signal Detector — Cari Peluang Trading" },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error("Email dan password wajib diisi"); return; }
    setIsLoading(true);

    const result = await signIn("credentials", { email, password, redirect: false });
    if (result?.error) { toast.error("Email atau password salah"); setIsLoading(false); return; }

    toast.success("Login berhasil!");
    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen bg-surface text-text-primary">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-surface-200 bg-surface/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <Logo size="md" />
          <div className="hidden md:flex items-center gap-6 text-sm">
            <a href="#fitur" className="text-text-secondary hover:text-text-primary transition-colors">Fitur</a>
            <a href="#mengapa" className="text-text-secondary hover:text-text-primary transition-colors">Mengapa NERV?</a>
            <a href="#news" className="text-text-secondary hover:text-text-primary transition-colors">Berita</a>
            <Link href="/register" className="px-4 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors">Daftar</Link>
            <button onClick={() => setShowLoginModal(true)} className="px-4 py-1.5 border border-surface-300 hover:border-primary-500 text-text-primary rounded-lg text-sm font-medium transition-colors">Masuk</button>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-text-secondary">
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-surface-200 p-4 space-y-3">
            <a href="#fitur" className="block text-sm text-text-secondary">Fitur</a>
            <a href="#mengapa" className="block text-sm text-text-secondary">Mengapa NERV?</a>
            <Link href="/register" className="block text-sm text-primary-400">Daftar</Link>
            <button onClick={() => { setShowLoginModal(true); setMobileMenuOpen(false); }} className="block text-sm text-text-secondary">Masuk</button>
          </div>
        )}
      </nav>

      {/* TICKER TAPE */}
      <TVTicker />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden border-b border-surface-200">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs mb-6">
                <TrendingUp size={12} /> Platform Analisis Saham No. 1
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Analisis Saham{" "}
                <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">Real-Time</span>
                <br />Untuk Semua
              </h1>
              <p className="text-lg text-text-secondary leading-relaxed mb-8 max-w-lg">
                Platform analisis saham Indonesia dengan data real-time, AI Analyst, 
                dan tools profesional — <strong className="text-emerald-400">gratis selamanya</strong>, tanpa biaya premium.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/register"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-semibold 
                             hover:from-emerald-500 hover:to-emerald-400 transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-2"
                >
                  Mulai Uji Coba Gratis <ArrowRight size={16} />
                </Link>
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="px-6 py-3 rounded-xl border border-surface-300 text-text-primary font-semibold 
                             hover:border-primary-500 hover:bg-surface-100 transition-all flex items-center gap-2"
                >
                  <LogIn size={16} /> Masuk
                </button>
              </div>
              <div className="flex items-center gap-4 mt-8 text-xs text-text-muted">
                <div className="flex items-center gap-1"><Shield size={12} className="text-emerald-400" /> Data Terenkripsi</div>
                <div className="flex items-center gap-1"><Star size={12} className="text-yellow-400" /> 100% Gratis</div>
                <div className="flex items-center gap-1"><CheckCircle size={12} className="text-emerald-400" /> Tanpa Premium</div>
              </div>
            </div>
            <div className="hidden md:block">
              {/* Login Card */}
              <div className="rounded-2xl border border-surface-200 bg-surface/80 p-6 backdrop-blur shadow-2xl">
                <h2 className="text-lg font-bold text-center mb-4">Masuk ke Akun Anda</h2>
                <form onSubmit={handleLogin} className="space-y-3">
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="nama@email.com"
                    className="w-full px-3 py-2.5 rounded-lg bg-surface-100 border border-surface-300 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-500/50" />
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                      placeholder="Password" className="w-full px-3 py-2.5 pr-10 rounded-lg bg-surface-100 border border-surface-300 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-500/50" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <label className="flex items-center gap-1.5 text-text-muted cursor-pointer">
                      <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} className="rounded border-surface-300 bg-surface-100 text-primary-500" />
                      Ingat Saya
                    </label>
                    <Link href="/forgot-password" className="text-primary-400 hover:text-primary-300">Lupa Password?</Link>
                  </div>
                  <button type="submit" disabled={isLoading}
                    className="w-full py-2.5 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-medium hover:from-emerald-500 hover:to-emerald-400 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
                    {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><LogIn size={18} /> Masuk</>}
                  </button>
                </form>
                <p className="text-center text-xs text-text-muted mt-4">
                  Belum punya akun? <Link href="/register" className="text-primary-400 hover:text-primary-300 font-medium">Daftar Gratis</Link>
                </p>
                <div className="flex items-center justify-center gap-3 mt-4 pt-4 border-t border-surface-200 text-[10px] text-text-muted">
                  <span>🔒 SSL Secure</span>
                  <span>✓ Data Terlindungi</span>
                  <span>🛡️ 256-bit Encryption</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="fitur" className="py-20 border-b border-surface-200">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-3">Fitur Unggulan</h2>
          <p className="text-text-muted text-center mb-12 max-w-2xl mx-auto">
            Tools analisis profesional yang biasanya berbayar, kini gratis untuk semua pengguna NERV StockBot.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="rounded-xl border border-surface-200 bg-surface/60 p-6 hover:border-surface-300 hover:bg-surface-100/50 transition-all group">
                  <div className={`w-12 h-12 rounded-xl bg-current/10 flex items-center justify-center mb-4 ${f.color}`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY NERV SECTION */}
      <section id="mengapa" className="py-20 border-b border-surface-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Mengapa Memilih NERV?</h2>
              <p className="text-text-secondary mb-8 leading-relaxed">
                NERV StockBot dibangun untuk mendemokratisasi akses ke alat analisis saham profesional. 
                Kami percaya setiap investor berhak mendapatkan data dan tools terbaik — tanpa harus membayar mahal.
              </p>
              <div className="space-y-3">
                {whyUs.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <item.icon size={18} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-text-secondary">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { val: "10K+", label: "Pengguna Aktif" },
                { val: "900+", label: "Saham Terpantau" },
                { val: "99.9%", label: "Uptime Server" },
                { val: "Rp 0", label: "Biaya Berlangganan" },
              ].map((s, i) => (
                <div key={i} className="rounded-xl border border-surface-200 bg-surface/60 p-6 text-center hover:border-surface-300 transition-all">
                  <p className="text-2xl md:text-3xl font-bold text-emerald-400">{s.val}</p>
                  <p className="text-xs text-text-muted mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* NEWS PREVIEW SECTION */}
      <section id="news" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-3">Berita Pasar Terkini</h2>
          <p className="text-text-muted text-center mb-8 max-w-2xl mx-auto">
            Pantau berita ekonomi dan aksi korporasi terbaru yang mempengaruhi pergerakan saham.
          </p>
          <div className="rounded-xl border border-surface-200 bg-surface/60 p-1">
            <NewsPreview />
          </div>
          <div className="text-center mt-6">
            <Link href="/news" className="text-sm text-primary-400 hover:text-primary-300 inline-flex items-center gap-1">
              Lihat Semua Berita <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-surface-200 py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo size="sm" />
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} NERV StockBot. 100% Gratis. Bukan saran investasi.
          </p>
          <div className="flex items-center gap-4 text-xs text-text-muted">
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
            <Link href="/settings">Pengaturan</Link>
          </div>
        </div>
      </footer>

      {/* LOGIN MODAL (mobile) */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowLoginModal(false)} />
          <div className="relative w-full max-w-md rounded-2xl border border-surface-300 bg-surface shadow-2xl p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Masuk</h2>
              <button onClick={() => setShowLoginModal(false)} className="p-1 text-text-muted hover:text-text-primary"><X size={20} /></button>
            </div>
            <form onSubmit={(e) => { setShowLoginModal(false); handleLogin(e); }} className="space-y-3">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email"
                className="w-full px-3 py-2.5 rounded-lg bg-surface-100 border border-surface-300 text-text-primary" />
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Password" className="w-full px-3 py-2.5 pr-10 rounded-lg bg-surface-100 border border-surface-300 text-text-primary" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-1.5 text-text-muted cursor-pointer">
                  <input type="checkbox" className="rounded border-surface-300 bg-surface-100 text-primary-500" />
                  Ingat Saya
                </label>
                <Link href="/forgot-password" className="text-primary-400 hover:text-primary-300">Lupa Password?</Link>
              </div>
              <button type="submit" disabled={isLoading}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-medium disabled:opacity-50 flex items-center justify-center gap-2">
                {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><LogIn size={18} /> Masuk</>}
              </button>
            </form>
            <p className="text-center text-xs text-text-muted mt-4">
              Belum punya akun? <Link href="/register" className="text-primary-400 hover:text-primary-300 font-medium">Daftar Gratis</Link>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// News Preview Component
function NewsPreview() {
  const [news, setNews] = useState<any[]>([]);
  useEffect(() => {
    fetch("/api/news?limit=5").then(r => r.json()).then(setNews).catch(() => {});
  }, []);

  if (news.length === 0) return <div className="p-8 text-center text-text-muted text-sm">Memuat berita...</div>;

  return (
    <div className="divide-y divide-surface-200">
      {news.map((item: any) => (
        <div key={item.id} className="p-3 hover:bg-surface-100/50 transition-colors">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                  item.sentiment === "positive" ? "bg-green-500/15 text-green-400" :
                  item.sentiment === "negative" ? "bg-red-500/15 text-red-400" : "bg-yellow-500/15 text-yellow-400"
                }`}>
                  {item.sentiment === "positive" ? "📈" : item.sentiment === "negative" ? "📉" : "⚖️"}
                </span>
                {item.relatedStocks?.slice(0, 2).map((s: string) => (
                  <span key={s} className="text-[10px] px-1 py-0.5 rounded bg-surface-200 text-primary-400 font-mono">{s}</span>
                ))}
              </div>
              <p className="text-xs text-text-primary font-medium line-clamp-1">{item.title}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
