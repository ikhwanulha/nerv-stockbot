// API untuk mengambil data saham dari Yahoo Finance
import { NextRequest, NextResponse } from "next/server";
import {
  getStockQuote,
  getMultipleQuotes,
  getHistoricalData,
  getTechnicalIndicators,
  scanStocks,
  getScalpingSignals,
  getDummyIndices,
} from "@/lib/stock-api";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const action = searchParams.get("action") || "quote";
  const symbol = searchParams.get("symbol") || "";
  const symbols = searchParams.get("symbols") || "";
  const period = searchParams.get("period") as any || "1mo";
  const interval = searchParams.get("interval") as any || "1d";

  try {
    switch (action) {
      // ============================================================
      // SINGLE QUOTE
      // ============================================================
      case "quote": {
        if (!symbol) {
          return NextResponse.json({ error: "Symbol diperlukan" }, { status: 400 });
        }
        const data = await getStockQuote(symbol);
        return NextResponse.json(data);
      }

      // ============================================================
      // MULTIPLE QUOTES (batch)
      // ============================================================
      case "quotes": {
        const symbolList = symbols.split(",").filter(Boolean);
        if (symbolList.length === 0) {
          return NextResponse.json(
            { error: "Minimal 1 symbol diperlukan" },
            { status: 400 }
          );
        }
        const data = await getMultipleQuotes(symbolList);
        return NextResponse.json(data);
      }

      // ============================================================
      // HISTORICAL DATA
      // ============================================================
      case "history": {
        if (!symbol) {
          return NextResponse.json({ error: "Symbol diperlukan" }, { status: 400 });
        }
        const data = await getHistoricalData(symbol, period, interval);
        return NextResponse.json(data);
      }

      // ============================================================
      // TECHNICAL INDICATORS
      // ============================================================
      case "technical": {
        if (!symbol) {
          return NextResponse.json({ error: "Symbol diperlukan" }, { status: 400 });
        }
        const data = await getTechnicalIndicators(symbol);
        return NextResponse.json(data);
      }

      // ============================================================
      // INDEKS (IHSG, LQ45, IDX30)
      // ============================================================
      case "indices": {
        const indices = getDummyIndices();
        return NextResponse.json(indices);
      }

      // ============================================================
      // SCREENER
      // ============================================================
      case "screener": {
        const filters: any = {};
        const cmfOp = searchParams.get("cmf_op");
        const cmfVal = searchParams.get("cmf_val");
        const obvOp = searchParams.get("obv_op");
        const obvVal = searchParams.get("obv_val");
        const adOp = searchParams.get("ad_op");
        const adVal = searchParams.get("ad_val");

        if (cmfOp && cmfVal) filters.cmf = { operator: cmfOp, value: parseFloat(cmfVal) };
        if (obvOp && obvVal) filters.obv = { operator: obvOp, value: parseFloat(obvVal) };
        if (adOp && adVal) filters.ad = { operator: adOp, value: parseFloat(adVal) };

        const data = await scanStocks(filters);
        return NextResponse.json(data);
      }

      // ============================================================
      // SCALPING SIGNALS
      // ============================================================
      case "signals": {
        const data = await getScalpingSignals();
        return NextResponse.json(data);
      }

      default:
        return NextResponse.json({ error: "Action tidak dikenal" }, { status: 400 });
    }
  } catch (error) {
    console.error(`Stock API error (${action}):`, error);
    return NextResponse.json(
      { error: "Gagal mengambil data saham" },
      { status: 500 }
    );
  }
}
