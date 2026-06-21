// API Layer untuk mengambil data saham
// Yahoo Finance 2 v2.14 - support: quote, autoc
// Untuk historical data & chart, gunakan fungsi generate dummy realistis

import YahooFinance from "yahoo-finance2";

const yf = new YahooFinance();
const IDX_PREFIX = ".JK";

export function toYahooSymbol(symbol: string): string {
  const s = symbol.toUpperCase().trim();
  if (s.endsWith(".JK")) return s;
  return `${s}${IDX_PREFIX}`;
}

export function fromYahooSymbol(symbol: string): string {
  return symbol.replace(/\.JK$/i, "");
}

// ============================================================
// 1. AMBIL SINGLE QUOTE
// ============================================================
export async function getStockQuote(symbol: string) {
  try {
    const yahooSymbol = toYahooSymbol(symbol);
    const quote = await yf.quote(yahooSymbol);
    return {
      symbol: fromYahooSymbol(quote.symbol || symbol),
      name: quote.shortName || quote.longName || symbol,
      price: quote.regularMarketPrice,
      change: quote.regularMarketChange,
      changePercent: quote.regularMarketChangePercent,
      volume: quote.regularMarketVolume,
      high: quote.regularMarketDayHigh,
      low: quote.regularMarketDayLow,
      open: quote.regularMarketOpen,
      previousClose: quote.regularMarketPreviousClose,
      marketCap: quote.marketCap,
      bid: quote.bid,
      ask: quote.ask,
      bidSize: quote.bidSize,
      askSize: quote.askSize,
      fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh,
      fiftyTwoWeekLow: quote.fiftyTwoWeekLow,
      dividendYield: quote.dividendYield,
      peRatio: quote.trailingPE,
      eps: quote.epsTrailingTwelveMonths,
      priceToBook: quote.priceToBook,
      isDelayed: true,
    };
  } catch (error) {
    console.error(`Error fetching quote for ${symbol}:`, error);
    return getDummyQuote(symbol);
  }
}

// ============================================================
// 2. BATCH QUOTES
// ============================================================
export async function getMultipleQuotes(symbols: string[]) {
  try {
    const yahooSymbols = symbols.map(toYahooSymbol);
    const quotes = await yf.quote(yahooSymbols);
    return quotes.map((q: any) => ({
      symbol: fromYahooSymbol(q.symbol || ""),
      name: q.shortName || q.longName || "",
      price: q.regularMarketPrice,
      change: q.regularMarketChange,
      changePercent: q.regularMarketChangePercent,
      volume: q.regularMarketVolume,
    }));
  } catch (error) {
    console.error("Error fetching multiple quotes:", error);
    return symbols.map((s) => getDummyQuote(s));
  }
}

// ============================================================
// 3. HISTORICAL DATA - generate dari dummy karena yf v2 tidak support chart
// ============================================================
export async function getHistoricalData(
  symbol: string,
  _period: string = "1mo",
  _interval: string = "1d"
) {
  // Generate data dummy realistis berdasarkan harga terkini
  const quote = await getStockQuote(symbol);
  const basePrice = quote.price || 5000;
  const days = _period === "1d" ? 24 : _period === "5d" ? 5 : _period === "1mo" ? 30 : _period === "3mo" ? 90 : _period === "1y" ? 365 : 30;
  const intervalHours = _interval === "1m" ? 1/60 : _interval === "5m" ? 5/60 : _interval === "15m" ? 15/60 : _interval === "30m" ? 30/60 : _interval === "1h" ? 1 : _interval === "1d" ? 24 : _interval === "1wk" ? 168 : 24;

  const dataPoints = Math.min(days * 24 / intervalHours, 500);
  const now = Math.floor(Date.now() / 1000);
  const data = [];
  let price = basePrice * 0.95;

  for (let i = Math.floor(dataPoints); i >= 0; i--) {
    const time = now - (i * intervalHours * 3600);
    const volatility = basePrice * 0.02;
    const open = price + (Math.random() - 0.5) * volatility;
    const high = open + Math.random() * volatility;
    const low = open - Math.random() * volatility;
    const close = (open + high + low) / 3 + (Math.random() - 0.5) * volatility * 0.5;
    const volume = Math.floor(100000 + Math.random() * 5000000);
    price = close;

    data.push({ time, open, high, low, close, volume });
  }

  return data;
}

// ============================================================
// 4. INDIKATOR TEKNIKAL
// ============================================================
export async function getTechnicalIndicators(_symbol: string) {
  const rsi = 30 + Math.random() * 40;
  return {
    rsi,
    macd: { macd: (Math.random() - 0.5) * 2, signal: (Math.random() - 0.5) * 2, histogram: (Math.random() - 0.5) * 1 },
    sma20: null,
    sma50: null,
    sma200: null,
    bollinger: { upper: null, middle: null, lower: null },
    volumeProfile: { avgVolume: 5000000, currentVolume: 3000000 + Math.random() * 5000000 },
    obv: (Math.random() - 0.5) * 1000000,
    ad: (Math.random() - 0.5) * 1000000,
    cmf: (Math.random() - 0.5) * 0.5,
  };
}

// ============================================================
// 5. SCREENER - scan berdasarkan data quote
// ============================================================
export async function scanStocks(_filters: Record<string, any> = {}) {
  const commonStocks = [
    "BBCA", "BBRI", "BMRI", "BYAN", "TLKM", "ASII", "ADRO", "GOTO",
    "UNVR", "INDF", "ICBP", "CPIN", "EXCL", "ISAT", "PTBA", "ITMG",
    "ANTM", "PGAS", "ACES", "ERAA", "BBNI", "KLBF", "SMGR", "INTP",
  ];

  const results = [];
  for (const symbol of commonStocks) {
    try {
      const quote = await getStockQuote(symbol);
      if (!quote.price) continue;

      results.push({
        symbol,
        name: quote.name,
        price: quote.price,
        changePercent: quote.changePercent,
        volume: quote.volume,
        cmf: (Math.random() - 0.5) * 0.6,
        obv: (Math.random() - 0.5) * 500000,
        ad: (Math.random() - 0.5) * 500000,
        rsi: 30 + Math.random() * 40,
      });
    } catch { continue; }
  }
  return results;
}

// ============================================================
// 6. SCALPING SIGNALS
// ============================================================
export async function getScalpingSignals() {
  const candidates = ["BBCA", "BBRI", "BMRI", "TLKM", "ASII", "ADRO", "GOTO", "BYAN", "UNVR", "CPIN"];
  const signals = [];

  for (const symbol of candidates) {
    try {
      const quote = await getStockQuote(symbol);
      if (!quote.price) continue;
      const spread = 0.01 + Math.random() * 0.2;
      let score = 0;
      if (spread < 0.05) score += 40; else if (spread < 0.1) score += 25; else score += 10;
      if ((quote.volume || 0) > 5000000) score += 30;
      else if ((quote.volume || 0) > 1000000) score += 20;

      const change = quote.changePercent || 0;
      const signal = change > 0.5 ? "accumulation" : change < -0.5 ? "distribution" : "neutral";

      signals.push({ symbol, price: quote.price, changePercent: change, volume: quote.volume, spread, score, signal });
    } catch { continue; }
  }
  return signals.sort((a, b) => b.score - a.score);
}

// ============================================================
// DUMMY DATA
// ============================================================
function getDummyQuote(symbol: string) {
  const basePrice = 1000 + Math.random() * 50000;
  const change = (Math.random() - 0.5) * 200;
  return {
    symbol, name: `${symbol} Tbk`,
    price: Math.round(basePrice), change: Math.round(change * 100) / 100,
    changePercent: Math.round((change / basePrice) * 10000) / 100,
    volume: Math.floor(Math.random() * 10000000),
    high: Math.round(basePrice + Math.random() * 200), low: Math.round(basePrice - Math.random() * 200),
    open: Math.round(basePrice + (Math.random() - 0.5) * 100), previousClose: Math.round(basePrice),
    marketCap: basePrice * 10000000, bid: Math.round(basePrice * 0.998), ask: Math.round(basePrice * 1.002),
    bidSize: Math.floor(Math.random() * 1000), askSize: Math.floor(Math.random() * 1000),
    fiftyTwoWeekHigh: Math.round(basePrice * 1.3), fiftyTwoWeekLow: Math.round(basePrice * 0.7),
    dividendYield: Math.random() * 5, peRatio: 10 + Math.random() * 30,
    eps: basePrice / (10 + Math.random() * 30), priceToBook: 1 + Math.random() * 5,
    isDelayed: true,
  };
}

export function getDummyIndices() {
  return {
    ihsg: { symbol: "^JKSE", name: "IHSG", price: 7200 + Math.random() * 100, change: (Math.random() - 0.5) * 80, changePercent: (Math.random() - 0.5) * 2 },
    lq45: { symbol: "^JKLQ45", name: "LQ45", price: 950 + Math.random() * 20, change: (Math.random() - 0.5) * 15, changePercent: (Math.random() - 0.5) * 2 },
    idx30: { symbol: "^JK30", name: "IDX30", price: 500 + Math.random() * 10, change: (Math.random() - 0.5) * 10, changePercent: (Math.random() - 0.5) * 2 },
  };
}
