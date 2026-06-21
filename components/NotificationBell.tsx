"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Bell, BellDot, X, ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function NotificationBell() {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  // Generate notifications from news + signals (auto-update)
  useEffect(() => {
    const generateNotifs = async () => {
      try {
        // Ambil berita terbaru untuk notifikasi
        const res = await fetch("/api/news?limit=5");
        const news = await res.json();
        const notifs = news.map((n: any, i: number) => ({
          id: `news-${n.id}`,
          type: "news",
          title: n.title,
          desc: `${n.source} • ${n.relatedStocks?.slice(0, 3).join(", ") || "Umum"}`,
          time: formatDate(n.publishedAt),
          sentiment: n.sentiment,
          link: `/news?highlight=${n.id}`,
          read: i > 1, // 2 berita terbaru belum dibaca
        }));
        setNotifications(notifs);
        setUnreadCount(notifs.filter((n: any) => !n.read).length);
      } catch {}
    };
    generateNotifs();
    const interval = setInterval(generateNotifs, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setShowDropdown(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleClick = (notif: any) => {
    // Tandai sudah dibaca
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
    setShowDropdown(false);
    if (notif.link) router.push(notif.link);
  };

  const clearRead = () => {
    setNotifications(prev => prev.filter(n => !n.read));
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
            <div className="flex items-center gap-2">
              {notifications.some(n => !n.read) && (
                <button onClick={clearRead} className="text-[10px] text-primary-400 hover:text-primary-300">Hapus dibaca</button>
              )}
            </div>
          </div>
          <div className="max-h-[350px] overflow-y-auto divide-y divide-surface-200">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-text-muted text-xs">Belum ada notifikasi</div>
            ) : (
              notifications.map((n) => (
                <button key={n.id} onClick={() => handleClick(n)}
                  className={`w-full text-left p-3 hover:bg-surface-100/50 transition-colors ${!n.read ? "bg-primary-900/10" : ""}`}>
                  <div className="flex items-start gap-2">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!n.read ? "bg-primary-400" : "bg-transparent"}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        {n.sentiment && (
                          <span className={`text-[9px] px-1 rounded ${
                            n.sentiment === "positive" ? "bg-green-500/15 text-green-400" :
                            n.sentiment === "negative" ? "bg-red-500/15 text-red-400" : "bg-yellow-500/15 text-yellow-400"
                          }`}>{n.sentiment === "positive" ? "📈" : n.sentiment === "negative" ? "📉" : "⚖️"}</span>
                        )}
                        <span className="text-[9px] text-text-muted">{n.time}</span>
                      </div>
                      <p className={`text-xs leading-snug ${!n.read ? "font-semibold text-text-primary" : "text-text-secondary"}`}>{n.title}</p>
                      <p className="text-[9px] text-text-muted mt-0.5">{n.desc}</p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
          {notifications.length > 0 && (
            <div className="p-2 border-t border-surface-200 text-center">
              <button onClick={() => { setShowDropdown(false); router.push("/news"); }} className="text-[10px] text-primary-400 hover:text-primary-300">Lihat Semua Berita</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
