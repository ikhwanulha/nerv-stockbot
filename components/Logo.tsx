"use client";

// NERV StockBot Logo - SVG component with green/emerald theme
// Modern design with subtle tech/stock market elements

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { icon: 28, text: "text-lg" },
  md: { icon: 36, text: "text-xl" },
  lg: { icon: 48, text: "text-2xl" },
};

export default function Logo({ size = "md", showText = true, className = "" }: LogoProps) {
  const { icon, text } = sizeMap[size];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Icon - candlestick chart shape with green gradient */}
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="50%" stopColor="#059669" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
        </defs>

        {/* Candlesticks */}
        {/* First candle (green) */}
        <rect x="4" y="14" width="8" height="26" rx="1" fill="url(#logoGrad)" />
        <rect x="7" y="6" width="2" height="40" rx="1" fill="#10b981" opacity="0.6" />

        {/* Second candle (red) */}
        <rect x="16" y="22" width="8" height="18" rx="1" fill="#ef4444" />
        <rect x="19" y="18" width="2" height="30" rx="1" fill="#ef4444" opacity="0.6" />

        {/* Third candle (green, longer) */}
        <rect x="28" y="10" width="8" height="30" rx="1" fill="url(#logoGrad)" />
        <rect x="31" y="2" width="2" height="44" rx="1" fill="#10b981" opacity="0.6" />

        {/* Fourth candle (red) */}
        <rect x="40" y="26" width="6" height="14" rx="1" fill="#ef4444" />
        <rect x="42" y="20" width="2" height="24" rx="1" fill="#ef4444" opacity="0.6" />

        {/* Scan line overlay */}
        <line x1="0" y1="38" x2="48" y2="38" stroke="#10b981" strokeWidth="1" opacity="0.3" />
        <line x1="0" y1="30" x2="48" y2="30" stroke="#10b981" strokeWidth="1" opacity="0.3" />
        <line x1="0" y1="22" x2="48" y2="22" stroke="#10b981" strokeWidth="1" opacity="0.3" />

        {/* Pulse dot */}
        <circle cx="46" cy="4" r="2" fill="#10b981" opacity="0.8">
          <animate
            attributeName="opacity"
            values="0.8;0.3;0.8"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>

      {/* Text */}
      {showText && (
        <div className="flex flex-col">
          <span
            className={`font-bold tracking-tight ${text} leading-none`}
            style={{
              background: "linear-gradient(135deg, #10b981, #059669, #047857)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            NERV
          </span>
          <span
            className={`${size === "sm" ? "text-[10px]" : "text-xs"} tracking-[0.2em] text-emerald-400/70 uppercase leading-tight`}
          >
            StockBot
          </span>
        </div>
      )}
    </div>
  );
}
