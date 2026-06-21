# NERV StockBot 🚀

**Platform Analisis Saham Indonesia Real-Time - Gratis 100%**

NERV StockBot adalah platform analisis saham Indonesia yang powerful dengan fitur lengkap - **tanpa biaya premium**. Clone dari stockbot.web.id dengan fitur tambahan.

## ✨ Fitur Utama

### 📊 Dashboard Interaktif
- Widget drag-and-drop (Market Overview, Gainers/Losers, News, Chart, dll)
- Ticker tape berjalan (real-time price updates)
- Widget resizable dengan tombol expand

### 📈 Chart & Analisis Teknikal
- Chart interaktif dengan lightweight-charts
- Timeframe: 1D, 5D, 1M, 3M, 1Y, 5Y
- Indikator: SMA, EMA, RSI, MACD, Bollinger Bands
- Drawing tools: Trendline, Support/Resistance, Fibonacci

### 🔍 Stock Screener
- Filter berdasarkan CMF, OBV, A/D Line
- Sortable table dengan data real-time
- Export analysis ready

### ⚡ Signal Detector
- Deteksi akumulasi/distribusi
- Scalping signal (score-based)
- Buy/Sell signal detection

### 🤖 AI Analyst (Chatbot)
- Powered by Groq Llama 3 70B
- Analisis teknikal & fundamental
- Rekomendasi berbasis data
- **Tanpa batasan kuota!**

### 📋 Fitur Lainnya
- Watchlist multi-tab
- Virtual Portfolio (Rp 100 juta saldo awal)
- IPO Tracker
- Kalender Aksi Korporasi
- Kalkulator Lot & Fee
- Pattern Scanner
- Status Emiten (Suspensi/UMA)
- Berita dengan sentimen analysis

### 🎨 Kustomisasi
- Multi-tema: Default Emerald, Bloomberg, Retro 8-bit
- Ukuran font adjustable (small/medium/large)
- Toggle ticker & sidebar
- Layout widget customizable

## 🛠️ Teknologi

| Stack | Teknologi |
|-------|-----------|
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| **Backend** | Next.js API Routes, NextAuth.js v5 |
| **Database** | PostgreSQL + Prisma ORM |
| **Auth** | NextAuth.js Credentials Provider, bcryptjs |
| **AI** | Groq API (Llama3-70b) |
| **Data Saham** | Yahoo Finance 2 (gratis) |
| **Chart** | Lightweight Charts (TradingView) |
| **UI** | React, Lucide Icons, Framer Motion |
| **Email** | Nodemailer (reset password) |

## 📦 Instalasi

### 1. Clone & Install Dependencies
```bash
cd nerv-stockbot
npm install
```

### 2. Setup Database (PostgreSQL)
```bash
# Buat database PostgreSQL
createdb nerv_stockbot

# Copy .env.example ke .env.local
cp .env.local.example .env.local
# Edit DATABASE_URL, GROQ_API_KEY, dan SMTP config di .env.local
```

### 3. Setup Environment Variables
Edit `.env.local`:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/nerv_stockbot"
AUTH_SECRET="generate-secret-with-openssl-rand-base64-32"
GROQ_API_KEY="your-groq-api-key"  # Daftar di console.groq.com
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
EMAIL_FROM="nerv-stockbot@noreply.com"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Migrate Database
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Seed Data (Optional)
```bash
npm run db:seed
# User: admin@nerv.com / admin123
```

### 6. Run Development Server
```bash
npm run dev
# Buka http://localhost:3000
```

## 🚀 Deployment

### Build Production
```bash
npm run build
npm start
```

### Vercel Deployment
1. Push to GitHub
2. Import project ke Vercel
3. Set environment variables di Vercel dashboard
4. Deploy!

## 👨‍💻 Struktur Proyek

```
nerv-stockbot/
├── app/              # Next.js App Router pages & API
│   ├── api/          # API Routes
│   ├── dashboard/    # Dashboard page
│   ├── login/        # Auth pages
│   └── ...
├── components/       # React components
├── lib/              # Utility functions & API clients
├── providers/        # Context providers
├── prisma/           # Database schema & migrations
├── types/            # TypeScript type definitions
├── public/           # Static assets
└── ...
```

## ⚠️ Disclaimer

- **BUKAN saran investasi.** Semua analisis bersifat informatif.
- Data saham dari Yahoo Finance tertunda ~15-20 menit.
- Tidak ada jaminan keakuratan data 100%.
- Gunakan untuk edukasi dan analisis, bukan untuk transaksi real-time.

## 📝 Lisensi

MIT - Gunakan, modifikasi, dan distribusikan dengan bebas.

---

**NERV StockBot** &copy; 2024 - *Analisis saham untuk semua, gratis selamanya.*
