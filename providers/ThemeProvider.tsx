"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { UserSettings } from "@/types";

type Theme = "default" | "bloomberg";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  fontSize: "small" | "medium" | "large";
  setFontSize: (size: "small" | "medium" | "large") => void;
  tickerEnabled: boolean;
  setTickerEnabled: (enabled: boolean) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  settings: UserSettings;
  updateSettings: (settings: Partial<UserSettings>) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const FONT_SIZE_MAP = {
  small: "text-sm",
  medium: "text-base",
  large: "text-lg",
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("default");
  const [fontSize, setFontSizeState] = useState<"small" | "medium" | "large">("medium");
  const [tickerEnabled, setTickerEnabledState] = useState(true);
  const [sidebarOpen, setSidebarOpenState] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("nerv-settings");
    if (saved) {
      try {
        const settings: UserSettings = JSON.parse(saved);
        setThemeState(settings.theme || "default");
        setFontSizeState(settings.fontSize || "medium");
        setTickerEnabledState(settings.tickerEnabled !== false);
        setSidebarOpenState(settings.sidebarOpen !== false);
      } catch {}
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;

    // Remove all theme classes
    root.classList.remove("theme-default", "theme-bloomberg", "theme-retro");

    // Add current theme class
    root.classList.add(`theme-${theme}`);

    // Font size
    Object.values(FONT_SIZE_MAP).forEach((cls) => root.classList.remove(cls));
    root.classList.add(FONT_SIZE_MAP[fontSize]);

    // Save to localStorage
    const currentSettings: UserSettings = {
      theme,
      fontSize,
      tickerEnabled,
      sidebarOpen,
    };
    localStorage.setItem("nerv-settings", JSON.stringify(currentSettings));
  }, [theme, fontSize, tickerEnabled, sidebarOpen, mounted]);

  const setTheme = (t: Theme) => setThemeState(t);
  const setFontSize = (s: "small" | "medium" | "large") => setFontSizeState(s);
  const setTickerEnabled = (e: boolean) => setTickerEnabledState(e);
  const setSidebarOpen = (o: boolean) => setSidebarOpenState(o);

  const updateSettings = (partial: Partial<UserSettings>) => {
    if (partial.theme !== undefined) setTheme(partial.theme);
    if (partial.fontSize !== undefined) setFontSize(partial.fontSize);
    if (partial.tickerEnabled !== undefined) setTickerEnabled(partial.tickerEnabled);
    if (partial.sidebarOpen !== undefined) setSidebarOpen(partial.sidebarOpen);
  };

  const settings: UserSettings = {
    theme,
    fontSize,
    tickerEnabled,
    sidebarOpen,
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        fontSize,
        setFontSize,
        tickerEnabled,
        setTickerEnabled,
        sidebarOpen,
        setSidebarOpen,
        settings,
        updateSettings,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
