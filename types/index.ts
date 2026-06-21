// ============================================================
// TYPES untuk NERV StockBot
// ============================================================



// Extend NextAuth session type
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
    };
  }
  
  interface User {
    id: string;
    email: string;
    name?: string | null;
  }
}

// ============================================================
// TYPE UNTUK DATA SAHAM
// ============================================================

export interface StockQuote {
  symbol: string;
  name: string;
  price: number | null;
  change: number | null;
  changePercent: number | null;
  volume: number | null;
  high?: number | null;
  low?: number | null;
  open?: number | null;
  previousClose?: number | null;
  marketCap?: number | null;
  bid?: number | null;
  ask?: number | null;
  bidSize?: number | null;
  askSize?: number | null;
  fiftyTwoWeekHigh?: number | null;
  fiftyTwoWeekLow?: number | null;
  dividendYield?: number | null;
  peRatio?: number | null;
  eps?: number | null;
  priceToBook?: number | null;
  isDelayed?: boolean;
}

export interface HistoricalDataPoint {
  time: number;
  open: number | null;
  high: number | null;
  low: number | null;
  close: number | null;
  volume: number | null;
}

export interface TechnicalIndicators {
  rsi: number | null;
  macd: {
    macd: number | null;
    signal: number | null;
    histogram: number | null;
  };
  sma20: number | null;
  sma50: number | null;
  sma200: number | null;
  bollinger: {
    upper: number | null;
    middle: number | null;
    lower: number | null;
  };
  volumeProfile: {
    avgVolume: number;
    currentVolume: number;
  };
  obv: number;
  ad: number;
  cmf: number;
}

export interface ScreenerResult {
  symbol: string;
  name: string;
  price: number | null;
  changePercent: number | null;
  volume: number | null;
  cmf: number;
  obv: number;
  ad: number;
  rsi: number | null;
}

export interface ScalpingSignal {
  symbol: string;
  price: number;
  changePercent: number;
  volume: number;
  spread: number;
  score: number;
  signal: "accumulation" | "distribution" | "neutral";
}

export interface IndexData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

// ============================================================
// TYPE UNTUK NEWS
// ============================================================

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  source: string;
  url: string;
  imageUrl?: string;
  sentiment: "positive" | "negative" | "neutral";
  relatedStocks: string[];
  publishedAt: string;
}

// ============================================================
// TYPE UNTUK USER SETTINGS
// ============================================================

export interface UserSettings {
  theme: "default" | "bloomberg" | "retro";
  fontSize: "small" | "medium" | "large";
  tickerEnabled: boolean;
  sidebarOpen: boolean;
  layout?: Record<string, unknown>;
  enabledWidgets?: string[];
  widgetOrder?: string[];
}

// ============================================================
// TYPE UNTUK PORTOFOLIO
// ============================================================

export interface PortfolioHolding {
  symbol: string;
  shares: number;
  avgPrice: number;
  currentPrice?: number;
  totalValue?: number;
  pnl?: number;
  pnlPercent?: number;
}

// ============================================================
// TYPE UNTUK IPO
// ============================================================

export interface IPOItem {
  symbol: string;
  name: string;
  sector: string;
  offeringPrice: number;
  currentPrice?: number;
  sharesOffered: number;
  listingDate: string;
  status: "upcoming" | "listed" | "cancelled";
}

// ============================================================
// TYPE UNTUK KALENDER
// ============================================================

export interface CalendarEvent {
  id: string;
  date: string;
  title: string;
  type: "dividend" | "rups" | "financial_report" | "ipo" | "economic";
  symbol?: string;
  description?: string;
}
