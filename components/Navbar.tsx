"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import TickerAutocomplete from "./TickerAutocomplete";
import NotificationBell from "./NotificationBell";
import { useTheme } from "@/providers/ThemeProvider";
import {
  Menu,
  X,
  Bell,
  Settings,
  LogOut,
  Search,
  TrendingUp,
} from "lucide-react";
import Logo from "./Logo";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { sidebarOpen, setSidebarOpen } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/screener", label: "Screener" },
    { href: "/signals", label: "Signals" },
    { href: "/news", label: "News" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-surface-200 bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80">
      <div className="flex h-14 items-center px-4 gap-3">
        {/* Sidebar Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-surface-200 transition-colors text-text-secondary"
          title="Toggle sidebar"
        >
          <Menu size={18} />
        </button>

        {/* Logo */}
        <Link href="/dashboard" className="flex-shrink-0">
          <Logo size="sm" />
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 ml-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-primary-900/30 text-primary-400"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-200"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Search dengan Autocomplete */}
        <div className="hidden sm:block w-44 lg:w-60">
          <TickerAutocomplete
            onSelect={(symbol) => {
              window.location.href = `/dashboard?s=${encodeURIComponent(symbol)}`;
            }}
            placeholder="Cari saham (BBCA, AAPL, BTC)..."
          />
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1">
          {/* NotificationBell */}
          <NotificationBell />
          {/* Quick links */}
          <Link
            href="/watchlist"
            className="p-2 rounded-lg hover:bg-surface-200 transition-colors text-text-secondary"
            title="Watchlist"
          >
            <TrendingUp size={18} />
          </Link>

          <Link
            href="/settings"
            className="p-2 rounded-lg hover:bg-surface-200 transition-colors text-text-secondary"
            title="Pengaturan"
          >
            <Settings size={18} />
          </Link>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-surface-200 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold">
                {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            </button>

            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 top-full mt-1 w-56 z-50 rounded-xl border border-surface-300 bg-surface shadow-xl animate-fade-in">
                  <div className="p-3 border-b border-surface-200">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {session?.user?.name || "User"}
                    </p>
                    <p className="text-xs text-text-muted truncate">
                      {session?.user?.email}
                    </p>
                  </div>
                  <div className="p-1">
                    <Link
                      href="/settings"
                      className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-200 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings size={16} />
                      Pengaturan
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: "/login" })}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut size={16} />
                      Keluar
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
