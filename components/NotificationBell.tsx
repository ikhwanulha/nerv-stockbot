"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, BellDot, X } from "lucide-react";
import { SIGNALS } from "@/app/signals/page";
import { formatNumber } from "@/lib/utils";

export default function NotificationBell() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  // Generate notifications from signals
  useEffect(() => {
    const notifs = [
      { id: "n1", title: "Sinyal BUY Baru: BBCA", desc: "Entry 9.850, SL 9.750, TP 10.150", time: "5 menit lalu", type: "signal", read: false },
      { id: "n2", title: "Sinyal SELL Baru: GOTO", desc: "Entry 1.200, SL 1.150, TP 1.300", time: "15 menit lalu", type: "signal", read: false },
      { id: "n3", title: "IHSG Menguat 0.85%", desc: "Net asing catat buy Rp 1.2T", time: "30 menit lalu", type: "market", read: false },
      { id: "n4", title: "BBCA Cetak Laba Rp 45T", desc: "Laporan keuangan solid", time: "1 jam lalu", type: "news", read: true },
      { id: "n5", title: "BMRI Target Price Rp 6.750", desc: "Analyst rekomendasi BUY", time: "2 jam lalu", type: "analyst", read: true },
    ];
    setNotifications(notifs);
    setUnreadCount(notifs.filter(n => !n.read).length);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setShowDropdown(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markAllRead = () => {
    setNotifications(n => n.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setShowDropdown(!showDropdown)} className="relative p-2 rounded-lg hover:bg-surface-200 transition-colors text-text-secondary" title="Notifikasi">
        {unreadCount > 0 ? <BellDot size={18} className="text-primary-400" /> : <Bell size={18} />}
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary-500 text-white text-[9px] font-bold flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 top-full mt-1 w-80 z-50 rounded-xl border border-surface-300 bg-surface shadow-2xl overflow-hidden animate-fade-in">
          <div className="p-3 border-b border-surface-200 flex items-center justify-between">
            <h3 className="text-xs font-semibold text-text-primary">Notifikasi</h3>
            <button onClick={markAllRead} className="text-[10px] text-primary-400 hover:text-primary-300">Tandai dibaca</button>
          </div>
          <div className="max-h-[320px] overflow-y-auto divide-y divide-surface-200">
            {notifications.map((n) => (
              <div key={n.id} className={`p-3 hover:bg-surface-100/50 transition-colors ${!n.read ? "bg-primary-900/10" : ""}`}>
                <div className="flex items-start gap-2">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!n.read ? "bg-primary-400" : "bg-transparent"}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs ${!n.read ? "font-semibold text-text-primary" : "text-text-secondary"}`}>{n.title}</p>
                    <p className="text-[10px] text-text-muted mt-0.5">{n.desc}</p>
                  </div>
                  <span className="text-[9px] text-text-muted whitespace-nowrap">{n.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
