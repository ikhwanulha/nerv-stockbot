import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "NERV StockBot - Analisis Saham Indonesia Real-Time",
  description:
    "Platform analisis saham Indonesia dengan data real-time, AI Analyst, chart interaktif, dan tools screening lengkap. Gratis untuk semua.",
  keywords: [
    "saham Indonesia",
    "analisis saham",
    "BEI",
    "IHSG",
    "stock screener",
    "AI analyst",
    "chart saham",
  ],
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark text-base" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
