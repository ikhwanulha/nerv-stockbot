"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/providers/ThemeProvider";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Search,
  Signal,
  BookmarkCheck,
  AlertTriangle,
  Newspaper,
  PieChart,
  Calendar,
  Rocket,
  Calculator,
  BarChart3,
  Wallet,
  Activity,
  Brain,
} from "lucide-react";

const sidebarLinks = [
  {
    section: "Analisis",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/screener", label: "Stock Screener", icon: Search },
      { href: "/signals", label: "Signal Detector", icon: Signal },
      { href: "/watchlist", label: "Watchlist", icon: BookmarkCheck },
    ],
  },
  {
    section: "Data & News",
    items: [
      { href: "/news", label: "Insights & News", icon: Newspaper },
      { href: "/status", label: "Status Emiten", icon: AlertTriangle },
      { href: "/ipo-tracker", label: "IPO Tracker", icon: Rocket },
    ],
  },
  {
    section: "Portofolio",
    items: [
      { href: "/portfolio", label: "Portfolio", icon: Wallet },
      { href: "/calendar", label: "Kalender Aksi", icon: Calendar },
      { href: "/calculator", label: "Kalkulator Lot", icon: Calculator },
    ],
  },
  {
    section: "Analytics",
    items: [
      { href: "/chart", label: "Chart Analysis", icon: BarChart3 },
      { href: "/analytics", label: "Analytics & Heatmap", icon: Activity },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen } = useTheme();

  return (
    <aside
      className={cn(
        "h-[calc(100vh-3.5rem)] border-r border-surface-200 bg-surface/50 overflow-y-auto transition-all duration-300 flex-shrink-0",
        sidebarOpen ? "w-56" : "w-0 overflow-hidden border-r-0"
      )}
    >
      <div className={cn("p-3 space-y-1", !sidebarOpen && "hidden")}>
        {sidebarLinks.map((section) => (
          <div key={section.section}>
            <p className="px-3 py-2 text-[10px] uppercase tracking-widest text-text-muted font-semibold">
              {section.section}
            </p>
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all",
                    isActive
                      ? "bg-primary-900/30 text-primary-400 font-medium border-l-2 border-primary-500"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-200 border-l-2 border-transparent"
                  )}
                >
                  <Icon size={16} className="flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
            <div className="my-2 border-t border-surface-200" />
          </div>
        ))}

        {/* AI Analyst shortcut */}
        <Link
          href="/dashboard?chat=true"
          className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gradient-to-r from-emerald-900/40 to-emerald-800/20 
                     border border-emerald-700/30 text-sm text-emerald-300 hover:from-emerald-900/60 hover:to-emerald-800/30 
                     transition-all mt-2"
        >
          <Brain size={16} />
          <span>AI Analyst</span>
        </Link>

        {/* Data delay note */}
        <div className="px-3 py-3 mt-4">
          <div className="p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <p className="text-[10px] text-yellow-400/70 leading-relaxed">
              Data tertunda ~15 menit. Sumber: Yahoo Finance
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
