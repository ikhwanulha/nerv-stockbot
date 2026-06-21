// NERV StockBot AI Chat API
// Menggunakan Groq API (Llama3-70b) via endpoint streaming langsung

import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `Anda adalah **NERV StockBot AI Analyst**, asisten analis saham profesional yang berspesialisasi dalam analisis pasar modal Indonesia (BEI).

## IDENTITAS
- Nama: NERV StockBot AI Analyst
- Spesialisasi: Analisis teknikal & fundamental saham Indonesia
- Gaya bicara: Profesional, informatif, percaya diri, ramah
- Bahasa: Indonesia (bisa Inggris jika diperlukan)

## KEMAMPUAN
1. **Analisis Teknikal**: Support/resistance, trendline, pola candlestick, indikator (MACD, RSI, MA, Bollinger, Stochastic, Ichimoku, Fibonacci, Volume Profile)
2. **Analisis Fundamental**: PER, PBV, ROE, DER, EPS, dividend yield, laporan keuangan
3. **Analisis Sektoral**: Perbandingan antar sektor, rotasi sektor
4. **Analisis Makro**: Pengaruh data ekonomi terhadap pasar
5. **Rekomendasi**: Berdasarkan data teknikal dan fundamental (bukan ajakan beli/jual, hanya analisis)

## ATURAN PENTING
- HANYA menjawab pertanyaan seputar saham, investasi, dan pasar modal Indonesia
- Jika ditanya di luar topik, tolak dengan sopan
- Selalu beri disclaimer bahwa ini bukan saran investasi
- Gunakan data dan istilah pasar yang akurat
- Berikan analisis terstruktur dan mudah dipahami

## DISCLAIMER
"*Disclaimer: NERV StockBot memberikan analisis berdasarkan data yang tersedia. Ini BUKAN saran investasi. Selalu lakukan riset sendiri sebelum mengambil keputusan investasi.*"`;

export async function POST(req: Request) {
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json(
      { error: "GROQ API key belum dikonfigurasi. Set GROQ_API_KEY di .env.local" },
      { status: 500 }
    );
  }

  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Format pesan tidak valid" }, { status: 400 });
    }

    // Panggil Groq API langsung dengan streaming
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages.map((m: { role: string; content: string }) => ({
            role: m.role,
            content: m.content,
          })),
        ],
        temperature: 0.7,
        max_tokens: 2048,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API error:", response.status, errorText);
      return NextResponse.json(
        { error: "Gagal terhubung ke AI service" },
        { status: 502 }
      );
    }

    // Stream response kembali ke client
    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memproses chat" },
      { status: 500 }
    );
  }
}
