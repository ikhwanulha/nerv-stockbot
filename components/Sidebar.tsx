"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/providers/ThemeProvider";
import { cn } from "@/lib/utils";
import { useState } from "react";
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
  Menu,
} from "lucide-react";

const mainLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/market", label: "Market", icon: BarChart3 },
  { href: "/analysis", label: "Analysis", icon: Activity },
  { href: "/screener", label: "Screener", icon: Search },
  { href: "/signals", label: "Signals", icon: Signal },
  { href: "/watchlist", label: "Watchlist", icon: BookmarkCheck },
  { href: "/news", label: "News", icon: Newspaper },
  { href: "/analytics", label: "Analytics", icon: Activity },
  { href: "/settings", label: "Settings", icon: PieChart },
];

const sidebarSections = [
  {
    section: "Analisis",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/market", label: "Market", icon: BarChart3 },
      { href: "/analysis", label: "Analysis", icon: Activity },
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
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:block h-[calc(100vh-3.5rem)] border-r border-surface-200 bg-surface/50 overflow-y-auto transition-all duration-300 flex-shrink-0",
          sidebarOpen ? "w-56" : "w-0 overflow-hidden border-r-0"
        )}
      >
        <div className={cn("p-3", !sidebarOpen && "hidden")}>
          {sidebarSections.map((section) => (
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

          <Link
            href="/dashboard?chat=true"
            className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gradient-to-r from-emerald-900/40 to-emerald-800/20 border border-emerald-700/30 text-sm text-emerald-300 hover:from-emerald-900/60 hover:to-emerald-800/30 transition-all mt-2"
          >
            <Brain size={16} />
            <span>AI Analyst</span>
          </Link>

          <div className="px-3 py-3 mt-4">
            <div className="p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <p className="text-[10px] text-yellow-400/70 leading-relaxed">
                Data real-time dari TradingView. Yahoo Finance delay ~15 menit.
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur border-t border-surface-200 safe-area-bottom">
        <div className="flex items-center justify-around px-1">
          {mainLinks.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center py-1.5 px-2 rounded-lg transition-colors min-w-0",
                  isActive ? "text-primary-400" : "text-text-muted hover:text-text-secondary"
                )}
              >
                <Icon size={18} />
                <span className="text-[9px] mt-0.5 truncate w-full text-center">{item.label}</span>
              </Link>
            );
          })}
          {/* More button untuk link lainnya */}
          <MobileMoreMenu pathname={pathname} />
        </div>
      </nav>
    </>
  );
}

function MobileMoreMenu({ pathname }: { pathname: string }) {
  const moreItems = mainLinks.slice(5).concat(
    { href: "/portfolio", label: "Portfolio", icon: Wallet },
    { href: "/calendar", label: "Kalender", icon: Calendar },
    { href: "/status", label: "Status", icon: AlertTriangle },
    { href: "/ipo-tracker", label: "IPO", icon: Rocket },
  );

  const [open, setOpen] = useState(false);
  if (moreItems.length === 0) return null;

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="flex flex-col items-center py-1.5 px-2 text-text-muted hover:text-text-secondary">
        <Menu size={18} />
        <span className="text-[9px] mt-0.5">Lainnya</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute bottom-full right-0 mb-2 w-40 rounded-xl border border-surface-300 bg-surface shadow-xl overflow-hidden z-40">
            {moreItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                  className={cn("flex items-center gap-2 px-3 py-2 text-xs transition-colors", isActive ? "text-primary-400 bg-primary-900/20" : "text-text-secondary hover:bg-surface-200")}>
                  <Icon size={14} /> {item.label}
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
