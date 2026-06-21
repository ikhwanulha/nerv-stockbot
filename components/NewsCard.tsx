"use client";

import { useState } from "react";
import { NewsItem } from "@/types";
import { formatDate, getChangeColor } from "@/lib/utils";
import { ChevronDown, ChevronUp, ExternalLink, Newspaper } from "lucide-react";

const sentimentConfig = {
  positive: { emoji: "📈", label: "Positif", color: "text-green-400 bg-green-500/10 border-green-500/30" },
  negative: { emoji: "📉", label: "Negatif", color: "text-red-400 bg-red-500/10 border-red-500/30" },
  neutral: { emoji: "⚖️", label: "Netral", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30" },
};

interface Props {
  news: NewsItem;
}

export default function NewsCard({ news }: Props) {
  const [expanded, setExpanded] = useState(false);
  const config = sentimentConfig[news.sentiment];

  return (
    <div className="rounded-xl border border-surface-200 bg-surface/60 overflow-hidden transition-all hover:border-surface-300">
      {/* Header */}
      <div
        className="p-3 cursor-pointer hover:bg-surface-100/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-text-primary leading-snug mb-1.5 line-clamp-2">
              {news.title}
            </h3>
            <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
              {news.summary}
            </p>
          </div>
          {expanded ? (
            <ChevronUp size={16} className="flex-shrink-0 mt-1 text-text-muted" />
          ) : (
            <ChevronDown size={16} className="flex-shrink-0 mt-1 text-text-muted" />
          )}
        </div>

        {/* Meta info */}
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${config.color}`}>
            {config.emoji} {config.label}
          </span>
          {news.relatedStocks.map((stock) => (
            <span
              key={stock}
              className="text-[10px] px-1.5 py-0.5 rounded bg-surface-200 text-primary-400 font-mono"
            >
              {stock}
            </span>
          ))}
          <span className="text-[10px] text-text-muted ml-auto">{formatDate(news.publishedAt)}</span>
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="px-3 pb-3 border-t border-surface-200 animate-fade-in">
          <div className="pt-3">
            <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">
              {news.content}
            </p>
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-surface-100">
              <span className="text-[10px] text-text-muted">
                Sumber: {news.source}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
