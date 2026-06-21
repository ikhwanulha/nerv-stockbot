// API Layer untuk mengambil data saham dari Yahoo Finance
// Menggunakan yahoo-finance2 - gratis dan tanpa API key

import YahooFinance from "yahoo-finance2";

// Inisialisasi instance yahoo-finance
const yahooFinance = new YahooFinance();

// Peta kode saham Indonesia ke Yahoo Finance symbol
// Yahoo Finance menggunakan akhiran .JK untuk bursa Indonesia
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
// 1. AMBIL DATA HARGA REAL-TIME
// ============================================================
export async function getStockQuote(symbol: string) {
  try {
    const yahooSymbol = toYahooSymbol(symbol);
    const quote = await yahooFinance.quote(yahooSymbol);
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
      // Delay indicator
      isDelayed: true, // Yahoo Finance data is delayed by ~15 minutes
    };
  } catch (error) {
    console.error(`Error fetching quote for ${symbol}:`, error);
    // Return dummy data sebagai fallback
    return getDummyQuote(symbol);
  }
}

// ============================================================
// 2. AMBIL MULTIPLE QUOTES (BATCH)
// ============================================================
export async function getMultipleQuotes(symbols: string[]) {
  try {
    const yahooSymbols = symbols.map(toYahooSymbol);
    const quotes = await yahooFinance.quote(yahooSymbols);
    return quotes.map((q) => ({
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
// 3. DATA HISTORIS UNTUK CHART
// ============================================================
export async function getHistoricalData(
  symbol: string,
  period: "1d" | "5d" | "1mo" | "3mo" | "6mo" | "1y" | "5y" | "max" = "1mo",
  interval: "1m" | "5m" | "15m" | "30m" | "1h" | "1d" | "1wk" | "1mo" = "1d"
) {
  try {
    const yahooSymbol = toYahooSymbol(symbol);
    const result = await yahooFinance.chart(yahooSymbol, {
      period1: getPeriodStart(period),
      interval,
    });
    return result.quotes?.map((q) => ({
      time: q.date
        ? Math.floor(new Date(q.date).getTime() / 1000)
        : Date.now() / 1000,
      open: q.open,
      high: q.high,
      low: q.low,
      close: q.close,
      volume: q.volume,
    })) || [];
  } catch (error) {
    console.error(`Error fetching historical data for ${symbol}:`, error);
    return [];
  }
}

// ============================================================
// 4. INDIKATOR TEKNIKAL (via yahoo-finance2)
// ============================================================
export async function getTechnicalIndicators(symbol: string) {
  try {
    const yahooSymbol = toYahooSymbol(symbol);
    // Ambil data historis 6 bulan untuk kalkulasi indikator
    const hist = await yahooFinance.chart(yahooSymbol, {
      period1: getPeriodStart("1y"),
      interval: "1d",
    });

    const quotes = hist.quotes?.filter((q) => q.close != null) || [];
    const closes = quotes.map((q) => q.close as number);
    const volumes = quotes.map((q) => q.volume || 0);
    const highs = quotes.map((q) => q.high || 0);
    const lows = quotes.map((q) => q.low || 0);

    return {
      rsi: calculateRSI(closes, 14),
      macd: calculateMACD(closes),
      sma20: calculateSMA(closes, 20),
      sma50: calculateSMA(closes, 50),
      sma200: calculateSMA(closes, 200),
      bollinger: calculateBollingerBands(closes, 20),
      volumeProfile: {
        avgVolume: closes.length > 0
          ? volumes.reduce((a, b) => a + b, 0) / volumes.length
          : 0,
        currentVolume: volumes[volumes.length - 1] || 0,
      },
      obv: calculateOBV(closes, volumes),
      ad: calculateAccumulationDistribution(highs, lows, closes, volumes),
      cmf: calculateCMF(highs, lows, closes, volumes),
    };
  } catch (error) {
    console.error("Error fetching technical indicators:", error);
    return null;
  }
}

// ============================================================
// 5. SCREENER - SCAN SAHAM BERDASARKAN FILTER
// ============================================================
export async function scanStocks(filters: {
  cmf?: { operator: "gt" | "lt" | "eq"; value: number };
  obv?: { operator: "gt" | "lt" | "eq"; value: number };
  ad?: { operator: "gt" | "lt" | "eq"; value: number };
  priceChange?: { operator: "gt" | "lt"; value: number };
  volume?: { operator: "gt"; value: number };
}) {
  // Daftar saham yang umum di BEI
  const commonStocks = [
    "BBCA", "BBRI", "BMRI", "BYAN", "TLKM", "ASII", "ADRO", "MDKA",
    "UNVR", "INDF", "ICBP", "GOTO", "CPIN", "JPFA", "EXCL", "ISAT",
    "PTBA", "ITMG", "HRUM", "ANTM", "PGAS", "PGEO", "ACES", "ERAA",
    "BBNI", "BDMN", "KRAS", "WSKT", "ADHI", "PTPP", "SMGR", "SMBR",
    "KLBF", "KAEF", "DVLA", "TURI", "PWON", "BSDE", "CTRA", "LPKR",
    "GGRM", "HMSP", "WIIM", "BATA", "INTP", "TKIM", "INKP", "ALKA",
    "MBMA", "BREN", "CASH", "AMMN", "CUAN", "DOID", "ARTO", "HKMU",
    "FIRE", "PANI", "MTEL", "TBIG", "TOWR", "CENT", "NIKL", "BRMS",
  ];

  const results = [];

  for (const symbol of commonStocks) {
    try {
      const yahooSymbol = toYahooSymbol(symbol);
      const quote = await yahooFinance.quote(yahooSymbol);
      const price = quote.regularMarketPrice;
      const change = quote.regularMarketChangePercent;

      if (!price) continue;

      // Filter harga
      if (
        filters.priceChange &&
        !applyFilter(change || 0, filters.priceChange.operator, filters.priceChange.value)
      )
        continue;

      if (filters.volume && (quote.regularMarketVolume || 0) <= filters.volume.value)
        continue;

      // Ambil data historis untuk indikator
      const hist = await yahooFinance.chart(yahooSymbol, {
        period1: getPeriodStart("3mo"),
        interval: "1d",
      });
      const quotes = hist.quotes?.filter((q) => q.close != null) || [];
      const closes = quotes.map((q) => q.close as number);
      const volumes = quotes.map((q) => q.volume || 0);
      const highs = quotes.map((q) => q.high || 0);
      const lows = quotes.map((q) => q.low || 0);

      if (closes.length < 30) continue;

      const currentCmf = calculateCMF(highs, lows, closes, volumes);
      const currentObv = calculateOBV(closes, volumes);
      const currentAd = calculateAccumulationDistribution(highs, lows, closes, volumes);
      const currentRsi = calculateRSI(closes, 14);

      // Apply filters
      if (filters.cmf && !applyFilter(currentCmf, filters.cmf.operator, filters.cmf.value))
        continue;
      if (filters.obv && !applyFilter(currentObv, filters.obv.operator, filters.obv.value))
        continue;
      if (filters.ad && !applyFilter(currentAd, filters.ad.operator, filters.ad.value))
        continue;

      results.push({
        symbol,
        name: quote.shortName || quote.longName || symbol,
        price,
        changePercent: change,
        volume: quote.regularMarketVolume,
        cmf: currentCmf,
        obv: currentObv,
        ad: currentAd,
        rsi: currentRsi,
      });
    } catch {
      continue;
    }
  }

  return results;
}

// ============================================================
// 6. DETEKSI SINYAL SCALPING
// ============================================================
export async function getScalpingSignals() {
  const scalpingCandidates = [
    "BBCA", "BBRI", "BMRI", "TLKM", "ASII", "ADRO", "GOTO", "BYAN",
    "UNVR", "CPIN", "ANTM", "PGAS", "EXCL", "ISAT", "ACES",
  ];

  const signals: Array<{
    symbol: string;
    price: number;
    changePercent: number;
    volume: number;
    spread: number;
    score: number; // 0-100, semakin tinggi semakin cocok scalping
    signal: "accumulation" | "distribution" | "neutral";
  }> = [];

  for (const symbol of scalpingCandidates) {
    try {
      const yahooSymbol = toYahooSymbol(symbol);
      const quote = await yahooFinance.quote(yahooSymbol);
      const price = quote.regularMarketPrice;
      if (!price) continue;

      const bid = quote.bid || price * 0.998;
      const ask = quote.ask || price * 1.002;
      const spread = ((ask - bid) / price) * 100;
      const volume = quote.regularMarketVolume || 0;

      // Hitung skor scalping: spread rendah + volume tinggi + likuiditas
      let score = 0;
      if (spread < 0.05) score += 40;
      else if (spread < 0.1) score += 25;
      else if (spread < 0.2) score += 10;

      if (volume > 5000000) score += 30;
      else if (volume > 1000000) score += 20;
      else if (volume > 500000) score += 10;

      const change = quote.regularMarketChangePercent || 0;
      const isAccumulation = change > 0 && volume > 2000000;
      const isDistribution = change < -1 && volume > 3000000;

      signals.push({
        symbol: fromYahooSymbol(quote.symbol || symbol),
        price,
        changePercent: change,
        volume,
        spread,
        score,
        signal: isAccumulation
          ? "accumulation"
          : isDistribution
          ? "distribution"
          : "neutral",
      });
    } catch {
      continue;
    }
  }

  return signals.sort((a, b) => b.score - a.score);
}

// ============================================================
// FUNGSI BANTU
// ============================================================

function getPeriodStart(period: string): Date {
  const now = new Date();
  switch (period) {
    case "1d": return new Date(now.getTime() - 24 * 60 * 60 * 1000);
    case "5d": return new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
    case "1mo": return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    case "3mo": return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    case "6mo": return new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
    case "1y": return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    case "5y": return new Date(now.getTime() - 5 * 365 * 24 * 60 * 60 * 1000);
    default: return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }
}

function applyFilter(value: number, operator: string, target: number): boolean {
  switch (operator) {
    case "gt": return value > target;
    case "lt": return value < target;
    case "eq": return Math.abs(value - target) < 0.001;
    default: return true;
  }
}

// --- INDIKATOR TEKNIKAL ---

function calculateSMA(data: number[], period: number): number | null {
  if (data.length < period) return null;
  const slice = data.slice(data.length - period);
  return slice.reduce((a, b) => a + b, 0) / period;
}

function calculateRSI(data: number[], period: number): number | null {
  if (data.length < period + 1) return null;
  const changes = [];
  for (let i = 1; i < data.length; i++) {
    changes.push(data[i] - data[i - 1]);
  }
  const recentChanges = changes.slice(changes.length - period);
  let gains = 0, losses = 0;
  for (const change of recentChanges) {
    if (change > 0) gains += change;
    else losses -= change;
  }
  if (losses === 0) return 100;
  const rs = gains / losses;
  return 100 - 100 / (1 + rs);
}

function calculateMACD(data: number[]): {
  macd: number | null;
  signal: number | null;
  histogram: number | null;
} {
  if (data.length < 26) {
    return { macd: null, signal: null, histogram: null };
  }
  const ema12 = calculateEMA(data, 12);
  const ema26 = calculateEMA(data, 26);
  if (ema12 === null || ema26 === null) {
    return { macd: null, signal: null, histogram: null };
  }
  const macdLine = ema12 - ema26;
  const signal = calculateEMA([macdLine], 9);
  return {
    macd: macdLine,
    signal: signal,
    histogram: signal !== null ? macdLine - signal : null,
  };
}

function calculateEMA(data: number[], period: number): number | null {
  if (data.length < period) return null;
  const k = 2 / (period + 1);
  let ema = data.slice(0, period).reduce((a, b) => a + b, 0) / period;
  for (let i = period; i < data.length; i++) {
    ema = data[i] * k + ema * (1 - k);
  }
  return ema;
}

function calculateBollingerBands(data: number[], period: number): {
  upper: number | null;
  middle: number | null;
  lower: number | null;
} {
  const middle = calculateSMA(data, period);
  if (middle === null || data.length < period) {
    return { upper: null, middle: null, lower: null };
  }
  const slice = data.slice(data.length - period);
  const variance = slice.reduce((sum, val) => sum + Math.pow(val - middle, 2), 0) / period;
  const stdDev = Math.sqrt(variance);
  return {
    upper: middle + 2 * stdDev,
    middle,
    lower: middle - 2 * stdDev,
  };
}

function calculateOBV(closes: number[], volumes: number[]): number {
  let obv = 0;
  for (let i = 1; i < closes.length; i++) {
    if (closes[i] > closes[i - 1]) obv += volumes[i];
    else if (closes[i] < closes[i - 1]) obv -= volumes[i];
  }
  return obv;
}

function calculateAccumulationDistribution(
  highs: number[],
  lows: number[],
  closes: number[],
  volumes: number[]
): number {
  let ad = 0;
  for (let i = 0; i < closes.length; i++) {
    const hl = highs[i] - lows[i];
    if (hl === 0) continue;
    const mfm = (closes[i] - lows[i] - (highs[i] - closes[i])) / hl;
    ad += mfm * volumes[i];
  }
  return ad;
}

function calculateCMF(
  highs: number[],
  lows: number[],
  closes: number[],
  volumes: number[],
  period: number = 20
): number {
  if (closes.length < period) return 0;
  const slice = closes.slice(closes.length - period);
  const volSlice = volumes.slice(volumes.length - period);
  const highSlice = highs.slice(highs.length - period);
  const lowSlice = lows.slice(lows.length - period);

  let volumeSum = 0;
  let cmfSum = 0;

  for (let i = 0; i < slice.length; i++) {
    const hl = highSlice[i] - lowSlice[i];
    if (hl === 0) continue;
    const mfm = (slice[i] - lowSlice[i] - (highSlice[i] - slice[i])) / hl;
    cmfSum += mfm * volSlice[i];
    volumeSum += volSlice[i];
  }

  return volumeSum > 0 ? cmfSum / volumeSum : 0;
}

// ============================================================
// DATA DUMMY UNTUK FALLBACK
// ============================================================
function getDummyQuote(symbol: string) {
  const basePrice = 1000 + Math.random() * 50000;
  const change = (Math.random() - 0.5) * 200;
  const changePercent = (change / basePrice) * 100;
  const volume = Math.floor(Math.random() * 10000000);

  return {
    symbol,
    name: `${symbol} Tbk`,
    price: Math.round(basePrice),
    change: Math.round(change * 100) / 100,
    changePercent: Math.round(changePercent * 100) / 100,
    volume,
    high: Math.round(basePrice + Math.random() * 200),
    low: Math.round(basePrice - Math.random() * 200),
    open: Math.round(basePrice + (Math.random() - 0.5) * 100),
    previousClose: Math.round(basePrice),
    marketCap: basePrice * 10000000,
    bid: Math.round(basePrice * 0.998),
    ask: Math.round(basePrice * 1.002),
    bidSize: Math.floor(Math.random() * 1000),
    askSize: Math.floor(Math.random() * 1000),
    fiftyTwoWeekHigh: Math.round(basePrice * 1.3),
    fiftyTwoWeekLow: Math.round(basePrice * 0.7),
    dividendYield: Math.random() * 5,
    peRatio: 10 + Math.random() * 30,
    eps: basePrice / (10 + Math.random() * 30),
    priceToBook: 1 + Math.random() * 5,
    isDelayed: true,
  };
}

// Dummy indices data
export function getDummyIndices() {
  return {
    ihsg: { symbol: "^JKSE", name: "IHSG", price: 7200 + Math.random() * 100, change: (Math.random() - 0.5) * 80, changePercent: (Math.random() - 0.5) * 2 },
    lq45: { symbol: "^JKLQ45", name: "LQ45", price: 950 + Math.random() * 20, change: (Math.random() - 0.5) * 15, changePercent: (Math.random() - 0.5) * 2 },
    idx30: { symbol: "^JK30", name: "IDX30", price: 500 + Math.random() * 10, change: (Math.random() - 0.5) * 10, changePercent: (Math.random() - 0.5) * 2 },
  };
}
