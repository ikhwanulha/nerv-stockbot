"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "@/providers/ThemeProvider";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import TickerTape from "@/components/TickerTape";
import { formatNumber, formatPercent, formatVolume, formatCurrency, getChangeColor, cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, ChevronDown, ChevronUp, ChevronRight, BookmarkCheck, Search as SearchIcon, MessageSquare, Wallet, Activity, BarChart3, Star, X, ExternalLink, Globe, Newspaper, Loader2, GripHorizontal } from "lucide-react";
import Link from "next/link";
import StockDetailModal from "@/components/StockDetailModal";

// ============================================================
// DATA
// ============================================================

const IHSG_DATA = {
  price: 6177.14, change: 4.80, changePercent: 0.08,
  open: 6172.34, high: 6190.50, low: 6165.20,
  lots: { all: 125000, regular: 98000 },
  value: 8.5e12, freq: 245000
};

const OTHER_INDICES = [
  { symbol: "IDX30", price: 480.50, change: 2.15, changePercent: 0.45 },
  { symbol: "LQ45", price: 920.30, change: 3.80, changePercent: 0.41 },
  { symbol: "SRI-KEHATI", price: 380.25, change: -1.20, changePercent: -0.31 },
];

const SECTORS = [
  "FINANCE","CYCLICAL","ENERGY","NON-CYCLICAL","INDUSTRIAL",
  "INFRASTRUCTURE","PROPERTY","TECHNOLOGY","BASIC-IND","HEALTH","TRANSPORT"
].map(name => ({ name, changePercent: (Math.random() - 0.5) * 2 }));

const MOVERS_DATA: Record<string, any[]> = {
  gainer: [
    { symbol: "SDMU", name: "Sidomulyo Selaras Tbk.", price: 94, change: 24, changePercent: 34.29, volume: 125000000 },
    { symbol: "BCIC", name: "Bumi Citra Indah Tbk.", price: 205, change: 38, changePercent: 22.75, volume: 85000000 },
    { symbol: "ZONE", name: "Zona Bangun Persada Tbk.", price: 156, change: 26, changePercent: 20.00, volume: 65000000 },
    { symbol: "BUMI", name: "Bumi Resources Tbk.", price: 185, change: 22, changePercent: 13.50, volume: 52000000 },
    { symbol: "MEDC", name: "Medco Energi Tbk.", price: 1250, change: 95, changePercent: 8.22, volume: 48000000 },
  ],
  volume: [
    { symbol: "GOTO", name: "GoTo Gojek Tokopedia Tbk.", price: 85, change: 3, changePercent: 3.66, volume: 2500000000 },
    { symbol: "BBCA", name: "Bank Central Asia Tbk.", price: 10250, change: 125, changePercent: 1.23, volume: 850000000 },
    { symbol: "BBRI", name: "Bank Rakyat Indonesia Tbk.", price: 5750, change: -25, changePercent: -0.43, volume: 720000000 },
    { symbol: "BMRI", name: "Bank Mandiri Tbk.", price: 6200, change: 75, changePercent: 1.22, volume: 650000000 },
    { symbol: "ADRO", name: "Adaro Energy Tbk.", price: 2850, change: 45, changePercent: 1.60, volume: 580000000 },
  ],
  frequency: [
    { symbol: "GOTO", name: "GoTo Gojek Tokopedia Tbk.", price: 85, change: 3, changePercent: 3.66, freq: 152000 },
    { symbol: "BBCA", name: "Bank Central Asia Tbk.", price: 10250, change: 125, changePercent: 1.23, freq: 125000 },
    { symbol: "BBRI", name: "Bank Rakyat Indonesia Tbk.", price: 5750, change: -25, changePercent: -0.43, freq: 98000 },
    { symbol: "TLKM", name: "Telkom Indonesia Tbk.", price: 3200, change: -45, changePercent: -1.39, freq: 85000 },
    { symbol: "ASII", name: "Astra International Tbk.", price: 6200, change: 35, changePercent: 0.57, freq: 72000 },
  ],
  netbuy: [
    { symbol: "BBCA", name: "Bank Central Asia Tbk.", price: 10250, change: 125, changePercent: 1.23, net: 850000000000 },
    { symbol: "BMRI", name: "Bank Mandiri Tbk.", price: 6200, change: 75, changePercent: 1.22, net: 450000000000 },
    { symbol: "BBRI", name: "Bank Rakyat Indonesia Tbk.", price: 5750, change: -25, changePercent: -0.43, net: 320000000000 },
    { symbol: "BBNI", name: "Bank Negara Indonesia Tbk.", price: 4800, change: 55, changePercent: 1.16, net: 280000000000 },
    { symbol: "ASII", name: "Astra International Tbk.", price: 6200, change: 35, changePercent: 0.57, net: 195000000000 },
  ],
  netsell: [
    { symbol: "GOTO", name: "GoTo Gojek Tokopedia Tbk.", price: 85, change: -5, changePercent: -5.56, net: -280000000000 },
    { symbol: "TLKM", name: "Telkom Indonesia Tbk.", price: 3200, change: -45, changePercent: -1.39, net: -195000000000 },
    { symbol: "UNVR", name: "Unilever Indonesia Tbk.", price: 2800, change: -35, changePercent: -1.23, net: -150000000000 },
    { symbol: "CPIN", name: "Charoen Pokphand Tbk.", price: 4800, change: -60, changePercent: -1.23, net: -120000000000 },
    { symbol: "INDF", name: "Indofood Sukses Makmur Tbk.", price: 5600, change: -50, changePercent: -0.88, net: -95000000000 },
  ],
};

const UNBOXING_DATA = [
  { symbol: "AMMN", title: "AMMN: When Passive Selling Eases", sector: "MET" },
  { symbol: "BDMN", title: "Integrasi BDMN-MUFG: Asymmetric Risk-Reward", sector: "FIN" },
  { symbol: "BREN", title: "BREN: Energi Baru, Potensi Baru", sector: "ENG" },
  { symbol: "ARTO", title: "ARTO: Fintech Turnaround Story", sector: "TEC" },
  { symbol: "CUAN", title: "CUAN: Nikel Boom & Margin Expansion", sector: "MET" },
];

const NEWS_DATA = [
  { id: "n1", title: "IHSG Ditutup Menguat, Investor Asing Catat Net Buy Rp 1,2 Triliun", source: "CNBC Indonesia", time: "2 jam lalu", summary: "Indeks Harga Saham Gabungan (IHSG) berhasil ditutup di zona hijau pada perdagangan hari ini, menguat 0,85% ke level 7.245 didorong oleh aksi beli investor asing di sektor perbankan dan teknologi.", content: "IHSG berhasil ditutup di zona hijau pada perdagangan hari ini, menguat 0,85% ke level 7.245. Penguatan ini didorong oleh aksi beli investor asing yang mencatatkan net buy sebesar Rp 1,2 triliun. Sektor perbankan menjadi primadona dengan penguatan saham BBCA (+1,2%), BBRI (+0,8%), dan BMRI (+1,5%). Sementara itu, sektor teknologi juga turut mendorong indeks dengan GOTO yang naik 2,1%. Analis memperkirakan IHSG masih berpotensi melanjutkan penguatan dalam jangka pendek, didukung oleh sentimen positif dari data ekonomi domestik dan aliran dana asing yang masih deras masuk ke pasar modal Indonesia.", url: "#", sentiment: "positive" },
  { id: "n2", title: "Bank Indonesia Tahan Suku Bunga di 6,25%", source: "Kontan", time: "3 jam lalu", summary: "BI memutuskan untuk mempertahankan suku bunga acuan di level 6,25% sesuai ekspektasi pasar untuk menjaga stabilitas nilai tukar rupiah.", content: "Bank Indonesia (BI) dalam Rapat Dewan Gubernur memutuskan mempertahankan BI-Rate di 6,25%. Keputusan ini sesuai ekspektasi pasar dan diambil untuk menjaga stabilitas nilai tukar rupiah di tengah ketidakpastian global. Gubernur BI menyatakan inflasi masih terkendali dan pertumbuhan ekonomi stabil. Pasar merespons positif dengan penguatan IHSG dan rupiah.", url: "#", sentiment: "positive" },
  { id: "n3", title: "BBRI Catat Laba Bersih Rp 45 Triliun", source: "Bisnis.com", time: "4 jam lalu", summary: "PT Bank Rakyat Indonesia Tbk membukukan laba bersih Rp 45 triliun sepanjang tahun buku 2023 dengan dividen yield mencapai 6,5%.", content: "PT Bank Rakyat Indonesia Tbk (BBRI) mengumumkan kinerja keuangan yang solid dengan laba bersih Rp 45 triliun. Dividen yield yang ditawarkan mencapai 6,5%, menjadikannya salah satu saham dengan dividen tertinggi di sektor perbankan. Analis merekomendasikan akumulasi saham BBRI dengan target harga jangka panjang mengingat fundamental kuat dan potensi pertumbuhan di segmen mikro.", url: "#", sentiment: "positive" },
  { id: "n4", title: "Harga Batu Bara Turun, Saham ADRO dan BYAN Tertekan", source: "Reuters", time: "5 jam lalu", summary: "Harga saham emiten batu bara seperti ADRO dan BYAN tertekan akibat penurunan harga komoditas batu bara global.", content: "Saham-saham emiten batu bara mengalami tekanan signifikan. ADRO ditutup turun 3,1% sementara BYAN turun 2,8%. Pelemahan ini sejalan dengan penurunan harga batu bara global yang disebabkan melemahnya permintaan dari China dan India. Analis menyarankan investor mencermati perkembangan harga komoditas global.", url: "#", sentiment: "negative" },
  { id: "n5", title: "Pemerintah Umumkan Insentif Properti", source: "CNBC Indonesia", time: "6 jam lalu", summary: "Pemerintah memberikan insentif PPN untuk rumah di bawah Rp 2 miliar, mendorong penguatan saham properti.", content: "Pemerintah melalui Kementerian Keuangan mengumumkan paket insentif pajak untuk sektor properti, termasuk pembebasan PPN untuk rumah di bawah Rp 2 miliar. Saham properti seperti PWON naik 3,5%, CTRA naik 2,8%, dan BSDE naik 2,2%. Insentif ini diharapkan mendorong pertumbuhan sektor properti.", url: "#", sentiment: "positive" },
  { id: "n6", title: "Rupiah Melemah ke Rp 16.200 per USD", source: "Bloomberg", time: "7 jam lalu", summary: "Nilai tukar rupiah melemah ke level terendah dalam beberapa bulan dipicu penguatan dolar AS.", content: "Nilai tukar rupiah terhadap dolar AS melemah ke level Rp 16.200 per USD, terendah dalam beberapa bulan terakhir. Pelemahan dipicu oleh penguatan indeks dolar AS dan ketidakpastian global. Saham-saham importir seperti UNVR dan HMSP tertekan, sementara saham eksportir seperti ADRO dan ITMG diuntungkan.", url: "#", sentiment: "negative" },
  { id: "n7", title: "GOTO Target Profitabilitas Akhir 2024", source: "Kontan", time: "8 jam lalu", summary: "PT GoTo Gojek Tokopedia Tbk optimis mencapai profitabilitas pada akhir tahun fiskal 2024.", content: "PT GoTo Gojek Tokopedia Tbk mengumumkan strategi baru untuk mencapai profitabilitas pada akhir tahun fiskal 2024. Strategi ini mencakup efisiensi biaya operasional dan optimalisasi pendapatan dari ekosistem terintegrasi. Pasar merespons positif dengan harga saham naik 2,1%. Beberapa analis memberikan rekomendasi beli.", url: "#", sentiment: "positive" },
  { id: "n8", title: "ASII Spin Off Bisnis Alat Berat", source: "Bisnis.com", time: "9 jam lalu", summary: "PT Astra International Tbk berencana spin off divisi alat berat untuk meningkatkan nilai pemegang saham.", content: "PT Astra International Tbk (ASII) mengumumkan rencana spin off divisi alat berat. Langkah ini diambil untuk meningkatkan fokus bisnis dan nilai pemegang saham. United Tractors (UNTR) akan menjadi entitas lebih mandiri. Pasar merespons positif dengan saham ASII naik tipis 0,5%.", url: "#", sentiment: "neutral" },
  { id: "n9", title: "IPO BREN Oversubscribed 5 Kali", source: "CNBC Indonesia", time: "10 jam lalu", summary: "IPO BREN (Barito Renewables Energy) mencatatkan oversubscribed 5x lipat dari target.", content: "Barito Renewables Energy (BREN) berhasil melakukan IPO dengan oversubscribed 5 kali lipat. Minat investor yang tinggi menunjukkan optimisme terhadap sektor energi terbarukan di Indonesia. Perusahaan berencana menggunakan dana IPO untuk ekspansi kapasitas PLTS dan PLTA.", url: "#", sentiment: "positive" },
  { id: "n10", title: "TLKM Hadapi Tekanan Persaingan Telekomunikasi", source: "Reuters", time: "11 jam lalu", summary: "TLKM mengalami tekanan akibat persaingan ketat industri telekomunikasi dan penurunan ARPU.", content: "PT Telkom Indonesia Tbk (TLKM) menghadapi tekanan akibat persaingan ketat di industri telekomunikasi. Penurunan ARPU akibat perang tarif antar operator menjadi tantangan utama. Meskipun demikian, fundamental TLKM masih tergolong kuat dengan posisi kas solid dan jaringan infrastruktur luas. Beberapa analis melihat penurunan ini sebagai peluang akumulasi.", url: "#", sentiment: "negative" },
];

const COMMODITIES_DATA = [
  { name: "Crude Oil (OIL)", price: 78.50, change: 1.20, changePercent: 1.55, unit: "USD/bbl" },
  { name: "Brent Oil", price: 82.75, change: 1.05, changePercent: 1.28, unit: "USD/bbl" },
  { name: "Palm Oil (CPO)", price: 3850, change: 45, changePercent: 1.18, unit: "MYR/ton" },
  { name: "Newcastle Coal", price: 135.25, change: -2.50, changePercent: -1.82, unit: "USD/ton" },
  { name: "Gold (XAU)", price: 2350.50, change: 15.80, changePercent: 0.68, unit: "USD/oz" },
  { name: "Silver", price: 28.45, change: 0.35, changePercent: 1.24, unit: "USD/oz" },
  { name: "Nickel", price: 16250, change: -125, changePercent: -0.76, unit: "USD/ton" },
  { name: "Natural Gas", price: 2.85, change: 0.08, changePercent: 2.89, unit: "USD/MMBtu" },
];

const CURRENCIES_DATA = [
  { pair: "USD/IDR", price: 16200, change: -45, changePercent: -0.28 },
  { pair: "SGD/IDR", price: 12100, change: 15, changePercent: 0.12 },
  { pair: "EUR/IDR", price: 17650, change: 85, changePercent: 0.48 },
  { pair: "AUD/IDR", price: 10750, change: -20, changePercent: -0.19 },
  { pair: "CNY/IDR", price: 2250, change: 8, changePercent: 0.36 },
];

// ============================================================
// HOOK: Panel hide/unhide dengan localStorage
// ============================================================
function usePanelState(panelId: string, defaultVisible = true) {
  const storageKey = `nerv-panel-${panelId}`;
  const [visible, setVisible] = useState(defaultVisible);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved !== null) setVisible(JSON.parse(saved));
    } catch {}
  }, []);

  const toggle = useCallback(() => {
    setVisible(prev => {
      const next = !prev;
      try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const set = useCallback((val: boolean) => {
    setVisible(val);
    try { localStorage.setItem(storageKey, JSON.stringify(val)); } catch {}
  }, []);

  return { visible, toggle, set };
}

// ============================================================
// KOMPONEN PANEL
// ============================================================

function CollapsiblePanel({ id, title, icon: Icon, children, defaultVisible = true, className = "" }: {
  id: string; title: string; icon: React.ElementType; children: React.ReactNode; defaultVisible?: boolean; className?: string;
}) {
  const { visible, toggle } = usePanelState(id, defaultVisible);
  return (
    <div className={cn("rounded-xl border border-surface-200 bg-surface/60 overflow-hidden", className)}>
      <button onClick={toggle} className="w-full flex items-center justify-between p-3 hover:bg-surface-100/50 transition-colors text-left">
        <div className="flex items-center gap-2">
          <Icon size={16} className="text-primary-400" />
          <h2 className="text-sm font-bold text-text-primary">{title}</h2>
        </div>
        {visible ? <ChevronUp size={16} className="text-text-muted" /> : <ChevronDown size={16} className="text-text-muted" />}
      </button>
      {visible && <div className="p-3 pt-0">{children}</div>}
    </div>
  );
}

function SparklineChart() {
  const points = Array.from({length: 50}, (_, i) => 6177 + Math.sin(i * 0.3) * 15 + (Math.random() - 0.5) * 5);
  const min = Math.min(...points);
  const max = Math.max(...points);
  const h = 60;
  const w = 300;
  const path = points.map((p, i) => `${(i / (points.length - 1)) * w},${h - ((p - min) / (max - min || 1)) * h}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[60px]" preserveAspectRatio="none">
      <path d={`M0,${h} ${path.split(" ").map((pt, i) => `${i === 0 ? "M" : "L"}${pt}`).join(" ")} L${w},${h} Z`} fill="url(#greenGrad)" opacity="0.2" />
      <path d={path.split(" ").map((pt, i) => `${i === 0 ? "M" : "L"}${pt}`).join(" ")} fill="none" stroke="#22c55e" strokeWidth="1.5" />
      <defs><linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#22c55e" /><stop offset="100%" stopColor="#22c55e" stopOpacity="0" /></linearGradient></defs>
    </svg>
  );
}

// ============================================================
// NEWS MODAL
// ============================================================
function NewsModal({ news, onClose }: { news: typeof NEWS_DATA[0]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-surface-300 bg-surface shadow-2xl animate-fade-in">
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-surface-200 bg-surface/95 backdrop-blur">
          <div className="flex items-center gap-2">
            <Newspaper size={16} className="text-primary-400" />
            <span className="text-xs text-text-muted">{news.source} • {news.time}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded ${
              news.sentiment === "positive" ? "bg-green-500/15 text-green-400" :
              news.sentiment === "negative" ? "bg-red-500/15 text-red-400" : "bg-yellow-500/15 text-yellow-400"
            }`}>{news.sentiment === "positive" ? "Positif" : news.sentiment === "negative" ? "Negatif" : "Netral"}</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-200 text-text-muted hover:text-text-primary"><X size={18} /></button>
        </div>
        <div className="p-6">
          <h2 className="text-lg font-bold text-text-primary mb-4">{news.title}</h2>
          <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">{news.content}</p>
          <div className="mt-6 pt-4 border-t border-surface-200 flex items-center justify-between">
            <span className="text-xs text-text-muted">Sumber: {news.source}</span>
            <a href={news.url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs rounded-lg transition-colors">
              Baca Sumber Asli <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// DASHBOARD CONTENT
// ============================================================
function DashboardContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { sidebarOpen } = useTheme();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("MARKET");
  const [moversTab, setMoversTab] = useState("gainer");
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [expandedNews, setExpandedNews] = useState<string | null>(null);

  // Quotes fetch
  const [quotes, setQuotes] = useState<Record<string, any>>({});
  useEffect(() => {
    const symbols = ["BBCA","BBRI","BMRI","GOTO","TLKM","ADRO","BYAN","UNVR"];
    const fetchQuotes = async () => {
      try {
        const r = await fetch(`/api/stocks?action=quotes&symbols=${symbols.join(",")}`);
        if (r.ok) {
          const d = await r.json();
          const m: Record<string, any> = {};
          d.forEach((q: any) => { m[q.symbol] = q; });
          setQuotes(m);
        }
      } catch {}
    };
    fetchQuotes();
    const interval = setInterval(fetchQuotes, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { if (status === "unauthenticated") router.push("/login"); }, [status]);

  // Tab changes auto-hide panels
  const globalPanelsVisible = activeTab === "GLOBAL";

  if (status === "loading" || !mounted) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-text-muted">Memuat dashboard...</p>
        </div>
      </div>
    );
  }
  if (status === "unauthenticated") return null;

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <TickerTape />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-3 lg:p-4 overflow-x-hidden pb-24 lg:pb-4 space-y-3">
          {/* Tab Navigasi */}
          <div className="flex gap-1 border-b border-surface-200 overflow-x-auto">
            {["MARKET", "GLOBAL", "BONDS", "REKSADANA"].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab ? "border-primary-500 text-primary-400" : "border-transparent text-text-muted hover:text-text-primary"
                }`}>
                {tab}
                {tab === "REKSADANA" && <span className="ml-1 text-[8px] px-1 py-0.5 rounded bg-primary-500 text-white font-bold">NEW</span>}
              </button>
            ))}
          </div>

          {/* ============================================================ */}
          {/* MARKET TAB */}
          {/* ============================================================ */}
          {activeTab === "MARKET" && (
            <>
              {/* PANEL 2: IHSG */}
              <CollapsiblePanel id="ihsg" title="IHSG" icon={BarChart3}>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-bold font-mono text-text-primary">{formatNumber(IHSG_DATA.price, 2)}</span>
                      <span className={`text-sm font-mono ${IHSG_DATA.change >= 0 ? "text-gain" : "text-loss"}`}>
                        {IHSG_DATA.change >= 0 ? "▲" : "▼"} {formatNumber(Math.abs(IHSG_DATA.change), 2)} ({formatPercent(Math.abs(IHSG_DATA.changePercent))})
                      </span>
                    </div>
                    <div className="mt-2">
                      <SparklineChart />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-3 gap-2 text-xs flex-shrink-0">
                    {[
                      { label: "Open", value: formatNumber(IHSG_DATA.open, 2) },
                      { label: "High", value: formatNumber(IHSG_DATA.high, 2) },
                      { label: "Low", value: formatNumber(IHSG_DATA.low, 2) },
                      { label: "Lot Reg", value: formatVolume(IHSG_DATA.lots.regular) },
                      { label: "Lot All", value: formatVolume(IHSG_DATA.lots.all) },
                      { label: "Value", value: formatCurrency(IHSG_DATA.value) },
                      { label: "Freq", value: formatVolume(IHSG_DATA.freq) },
                    ].map(item => (
                      <div key={item.label} className="bg-surface-100 rounded-lg p-1.5 text-center">
                        <p className="text-[9px] text-text-muted">{item.label}</p>
                        <p className="text-xs font-mono font-semibold text-text-primary">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CollapsiblePanel>

              {/* PANEL 3: Indeks Lainnya */}
              <CollapsiblePanel id="indices" title="Indeks Lainnya" icon={Activity}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {OTHER_INDICES.map(idx => (
                    <div key={idx.symbol} className="flex items-center justify-between p-2 rounded-lg bg-surface-100">
                      <span className="text-xs font-semibold text-text-primary">{idx.symbol}</span>
                      <div className="text-right">
                        <span className="text-xs font-mono text-text-primary">{formatNumber(idx.price, 2)}</span>
                        <p className={`text-[10px] font-mono ${idx.change >= 0 ? "text-gain" : "text-loss"}`}>{formatPercent(idx.changePercent)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="/analysis" className="mt-2 text-[10px] text-primary-400 hover:text-primary-300 flex items-center gap-1">Selengkapnya <ChevronRight size={10} /></Link>
              </CollapsiblePanel>

              {/* PANEL 4: Sektor */}
              <CollapsiblePanel id="sectors" title="Sektor" icon={Globe}>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1.5">
                  {SECTORS.map(s => (
                    <div key={s.name} className={`flex items-center justify-between p-1.5 rounded-lg text-[11px] font-medium ${s.changePercent >= 0 ? "bg-green-500/5" : "bg-red-500/5"}`}>
                      <span className="text-text-primary">{s.name}</span>
                      <span className={`font-mono ${s.changePercent >= 0 ? "text-gain" : "text-loss"}`}>{formatPercent(s.changePercent)}</span>
                    </div>
                  ))}
                </div>
              </CollapsiblePanel>

              {/* PANEL 5: Movers */}
              <CollapsiblePanel id="movers" title="Pergerakan Saham" icon={TrendingUp}>
                <div className="flex gap-1 overflow-x-auto pb-2 mb-2">
                  {[
                    { key: "gainer", label: "Top Gainer" },
                    { key: "volume", label: "Top Volume" },
                    { key: "frequency", label: "Top Freq" },
                    { key: "netbuy", label: "Net Foreign Buy" },
                    { key: "netsell", label: "Net Foreign Sell" },
                  ].map(tab => (
                    <button key={tab.key} onClick={() => setMoversTab(tab.key)}
                      className={`px-2.5 py-1 text-[10px] rounded-lg font-medium whitespace-nowrap transition-colors ${
                        moversTab === tab.key ? "bg-primary-900/40 text-primary-400" : "bg-surface-100 text-text-muted hover:text-text-primary"
                      }`}>{tab.label}</button>
                  ))}
                </div>
                <div className="space-y-0.5">
                  {MOVERS_DATA[moversTab]?.map(item => (
                    <button key={item.symbol} onClick={() => setSelectedStock(item.symbol)}
                      className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-surface-100/50 transition-colors">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="text-xs font-bold text-text-primary">{item.symbol}</span>
                        <span className="text-[9px] text-text-muted truncate max-w-[120px] hidden sm:block">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-3 ml-2">
                        <span className="text-xs font-mono text-text-primary">{formatNumber(item.price)}</span>
                        <span className={`text-[10px] font-mono ${item.change >= 0 ? "text-gain" : "text-loss"}`}>
                          {item.change >= 0 ? "+" : ""}{item.change} ({formatPercent(Math.abs(item.changePercent))})
                        </span>
                        {item.net && <span className={`text-[10px] font-mono hidden md:block ${item.net >= 0 ? "text-gain" : "text-loss"}`}>{formatCurrency(item.net)}</span>}
                      </div>
                    </button>
                  ))}
                </div>
                <Link href="/analysis" className="mt-2 text-[10px] text-primary-400 hover:text-primary-300 flex items-center gap-1">Selengkapnya <ChevronRight size={10} /></Link>
              </CollapsiblePanel>

              {/* PANEL 6: Unboxing Saham */}
              <CollapsiblePanel id="unboxing" title="Unboxing Saham" icon={Star}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {UNBOXING_DATA.map(item => (
                    <button key={item.symbol} onClick={() => setSelectedStock(item.symbol)}
                      className="p-3 rounded-lg bg-surface-100 hover:bg-surface-200 transition-colors text-left border border-surface-200 hover:border-surface-300">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-primary-400">{item.symbol}</span>
                        <span className="text-[9px] px-1 py-0.5 rounded bg-surface-200 text-text-muted">{item.sector}</span>
                      </div>
                      <p className="text-xs text-text-secondary leading-snug">{item.title}</p>
                    </button>
                  ))}
                </div>
              </CollapsiblePanel>

              {/* PANEL 7: Insights & News */}
              <CollapsiblePanel id="news" title="Insights & News" icon={Newspaper}>
                <div className="space-y-2">
                  {NEWS_DATA.map(item => (
                    <div key={item.id}>
                      <button onClick={() => setExpandedNews(expandedNews === item.id ? null : item.id)}
                        className="w-full text-left p-3 rounded-lg hover:bg-surface-100/50 transition-colors border border-surface-200 hover:border-surface-300">
                        <div className="flex items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-[9px] px-1.5 py-0.5 rounded ${
                                item.sentiment === "positive" ? "bg-green-500/15 text-green-400" :
                                item.sentiment === "negative" ? "bg-red-500/15 text-red-400" : "bg-yellow-500/15 text-yellow-400"
                              }`}>
                                {item.sentiment === "positive" ? "📈" : item.sentiment === "negative" ? "📉" : "⚖️"}
                              </span>
                              <span className="text-[9px] text-text-muted">{item.source}</span>
                              <span className="text-[9px] text-text-muted">• {item.time}</span>
                            </div>
                            <p className="text-xs font-semibold text-text-primary leading-snug">{item.title}</p>
                            {expandedNews === item.id && (
                              <div className="mt-2 animate-fade-in">
                                <p className="text-[11px] text-text-secondary leading-relaxed">{item.content}</p>
                                <div className="mt-3 flex items-center gap-2">
                                  <a href={item.url} target="_blank" rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-600 hover:bg-primary-700 text-white text-[10px] rounded-lg transition-colors">
                                    Baca Sumber Asli <ExternalLink size={10} />
                                  </a>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              </CollapsiblePanel>
            </>
          )}

          {/* ============================================================ */}
          {/* GLOBAL TAB */}
          {/* ============================================================ */}
          {activeTab === "GLOBAL" && (
            <>
              {/* PANEL 8: Komoditas */}
              <CollapsiblePanel id="commodities" title="Komoditas" icon={Globe} defaultVisible={true}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {COMMODITIES_DATA.map(item => (
                    <div key={item.name} className="flex items-center justify-between p-2 rounded-lg bg-surface-100">
                      <div className="min-w-0 flex-1"><p className="text-xs font-medium text-text-primary truncate">{item.name}</p><p className="text-[9px] text-text-muted">{item.unit}</p></div>
                      <div className="text-right ml-2">
                        <p className="text-xs font-mono text-text-primary">{formatNumber(item.price, 2)}</p>
                        <span className={`text-[10px] font-mono ${item.change >= 0 ? "text-gain" : "text-loss"}`}>
                          {item.change >= 0 ? "+" : ""}{formatNumber(item.change, 2)} ({formatPercent(Math.abs(item.changePercent))})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CollapsiblePanel>

              {/* PANEL: Mata Uang */}
              <CollapsiblePanel id="currencies" title="Mata Uang (Kurs terhadap Rupiah)" icon={TrendingUp} defaultVisible={true}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {CURRENCIES_DATA.map(item => (
                    <div key={item.pair} className="flex items-center justify-between p-2 rounded-lg bg-surface-100">
                      <span className="text-xs font-semibold text-text-primary">{item.pair}</span>
                      <div className="text-right">
                        <span className="text-xs font-mono text-text-primary">{formatNumber(item.price, 2)}</span>
                        <p className={`text-[10px] font-mono ${item.change >= 0 ? "text-gain" : "text-loss"}`}>
                          {item.change >= 0 ? "+" : ""}{formatNumber(item.change, 2)} ({formatPercent(Math.abs(item.changePercent))})
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CollapsiblePanel>
            </>
          )}

          {(activeTab === "BONDS" || activeTab === "REKSADANA") && (
            <div className="flex items-center justify-center py-20 text-text-muted">
              <div className="text-center">
                <Activity size={48} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">Fitur {activeTab} sedang dalam pengembangan</p>
                <p className="text-xs mt-1">Akan segera hadir</p>
              </div>
            </div>
          )}

          {/* Data delay note */}
          <div className="p-2 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
            <p className="text-[10px] text-yellow-400/70 text-center">Data real-time dari TradingView. Data Yahoo Finance tertunda ~15-20 menit.</p>
          </div>
        </main>
      </div>

      {/* Bottom Navigation (Mobile) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur border-t border-surface-200 safe-area-bottom">
        <div className="flex items-center justify-around py-1">
          {[
            { icon: BookmarkCheck, label: "Watchlist", href: "/watchlist" },
            { icon: Activity, label: "Stream", href: "/market" },
            { icon: SearchIcon, label: "Search", href: "/screener" },
            { icon: MessageSquare, label: "Chat", href: "/signals" },
            { icon: Wallet, label: "Portfolio", href: "/portfolio" },
          ].map(item => (
            <button key={item.label} onClick={() => router.push(item.href)}
              className="flex flex-col items-center py-1 px-2 text-text-muted hover:text-primary-400 transition-colors">
              <item.icon size={20} />
              <span className="text-[9px] mt-0.5">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* News Modal */}
      {expandedNews && (
        <NewsModal news={NEWS_DATA.find(n => n.id === expandedNews)!} onClose={() => setExpandedNews(null)} />
      )}

      {/* Stock Detail Modal */}
      {selectedStock && <StockDetailModal symbol={selectedStock} onClose={() => setSelectedStock(null)} />}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface flex items-center justify-center"><div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <DashboardContent />
    </Suspense>
  );
}
