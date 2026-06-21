"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, X, User, Sparkles, Loader2, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const WELCOME_MESSAGE: Message = {
  role: "assistant",
  content:
    "Halo! Saya **NERV StockBot AI Analyst** 🤖\n\nSaya siap membantu analisis saham Indonesia. Tanyakan tentang:\n\n• 📊 Analisis teknikal (RSI, MACD, MA, dll)\n• 📈 Rekomendasi saham berdasarkan data\n• 💹 Analisis fundamental (PER, PBV, ROE)\n• 🏭 Analisis sektoral\n• 📋 Screening saham\n\nAda yang bisa saya bantu?",
};

interface Props {
  floating?: boolean;
}

export default function AIAnalyst({ floating = false }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll ke pesan terbaru
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Coba panggil API chat dulu
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok) throw new Error("API error");

      // Baca stream response
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      if (reader) {
        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6).trim();
              if (data === "[DONE]") continue;
              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content || parsed.content || "";
                if (content) {
                  assistantContent += content;
                  setMessages((prev) => {
                    const updated = [...prev];
                    updated[updated.length - 1] = {
                      role: "assistant",
                      content: assistantContent,
                    };
                    return updated;
                  });
                }
              } catch {
                // Jika bukan JSON, mungkin plain text
                if (data && data !== "data: [DONE]") {
                  assistantContent += data;
                  setMessages((prev) => {
                    const updated = [...prev];
                    updated[updated.length - 1] = {
                      role: "assistant",
                      content: assistantContent,
                    };
                    return updated;
                  });
                }
              }
            }
          }
        }
      } else {
        // Fallback jika streaming tidak didukung
        const text = await res.text();
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: text || "Maaf, terjadi kesalahan. Silakan coba lagi.",
          },
        ]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Maaf, fitur AI Analyst sedang dalam pengembangan. Silakan coba lagi nanti atau gunakan fitur analisis lainnya di dashboard.\n\nAnda masih bisa menggunakan:\n• 📊 **Chart interaktif** dengan TradingView\n• 📈 **Stock Screener** untuk filter saham\n• 🔍 **Signal Detector** untuk sinyal trading\n• 📰 **Insights & News** untuk berita pasar\n\nFitur chat akan segera hadir dengan kemampuan penuh!",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const chatContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-surface-200 bg-gradient-to-r from-emerald-900/30 to-emerald-800/20">
        <div className="flex items-center gap-2">
          <Brain size={18} className="text-emerald-400" />
          <div>
            <h3 className="text-sm font-semibold text-text-primary">AI Analyst</h3>
            <p className="text-[10px] text-text-muted">Powered by Groq Llama 3</p>
          </div>
        </div>
        {floating && (
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded hover:bg-surface-200 text-text-muted hover:text-text-primary transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              "flex gap-2 animate-fade-in",
              msg.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-full bg-emerald-600/20 flex items-center justify-center flex-shrink-0 mt-1">
                <Bot size={14} className="text-emerald-400" />
              </div>
            )}
            <div
              className={cn(
                "max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed",
                msg.role === "user"
                  ? "bg-primary-600 text-white"
                  : "bg-surface-100 border border-surface-200 text-text-primary"
              )}
              dangerouslySetInnerHTML={{
                __html: msg.content
                  .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                  .replace(/\n/g, "<br/>"),
              }}
            />
            {msg.role === "user" && (
              <div className="w-7 h-7 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0 mt-1">
                <User size={14} className="text-white" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-2">
            <div className="w-7 h-7 rounded-full bg-emerald-600/20 flex items-center justify-center">
              <Bot size={14} className="text-emerald-400" />
            </div>
            <div className="bg-surface-100 border border-surface-200 rounded-xl px-3 py-2">
              <Loader2 size={16} className="animate-spin text-emerald-400" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-surface-200">
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Tanya tentang saham..."
            rows={1}
            className="flex-1 bg-surface-100 border border-surface-300 rounded-lg px-3 py-2 text-sm text-text-primary 
                       placeholder:text-text-muted focus:outline-none focus:border-primary-500/50 resize-none
                       transition-colors"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2 bg-primary-600 hover:bg-primary-700 disabled:bg-surface-300 disabled:cursor-not-allowed 
                       rounded-lg transition-colors text-white"
          >
            <Send size={16} />
          </button>
        </div>
        <p className="mt-1 text-[10px] text-text-muted italic">
          *Fitur chat masih dalam pengembangan. Jawaban akan bersifat informatif.
        </p>
      </form>
    </div>
  );

  // Floating mode: button yang bisa diklik
  if (floating) {
    return (
      <>
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 
                       shadow-lg shadow-emerald-500/30 flex items-center justify-center hover:scale-105 transition-transform
                       text-white"
            title="AI Analyst"
          >
            <Brain size={24} />
          </button>
        )}
        {isOpen && (
          <div className="fixed bottom-6 right-6 z-40 w-80 sm:w-96 h-[500px] rounded-2xl border border-surface-300 bg-surface shadow-2xl overflow-hidden animate-fade-in">
            {chatContent}
          </div>
        )}
      </>
    );
  }

  // Widget mode: ditampilkan di dalam dashboard
  return (
    <div className="h-[400px] rounded-xl border border-surface-200 bg-surface/80 overflow-hidden">
      {chatContent}
    </div>
  );
}
