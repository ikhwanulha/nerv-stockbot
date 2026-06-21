"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import Logo from "@/components/Logo";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Masukkan email Anda");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Gagal mengirim email");
        return;
      }

      setSent(true);
    } catch (error) {
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-surface">
      <div className="fixed inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <Logo size="lg" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Lupa Password</h1>
          <p className="text-sm text-text-muted mt-1">
            Masukkan email Anda untuk mendapatkan link reset password
          </p>
        </div>

        <div className="rounded-2xl border border-surface-200 bg-surface/80 p-6 backdrop-blur">
          {sent ? (
            <div className="text-center py-6">
              <CheckCircle size={48} className="mx-auto text-green-400 mb-4" />
              <h2 className="text-lg font-semibold text-text-primary mb-2">Cek Email Anda</h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                Jika email <strong className="text-primary-400">{email}</strong> terdaftar,
                Anda akan menerima link reset password dalam beberapa menit.
              </p>
              <p className="text-xs text-text-muted mt-4">
                Tidak menerima email? Cek folder spam atau{" "}
                <button
                  onClick={() => setSent(false)}
                  className="text-primary-400 hover:text-primary-300"
                >
                  coba lagi
                </button>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full px-3 py-2.5 rounded-lg bg-surface-100 border border-surface-300 text-text-primary 
                             placeholder:text-text-muted focus:outline-none focus:border-primary-500/50 transition-all"
                  autoComplete="email"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-medium
                           hover:from-emerald-500 hover:to-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed
                           transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Mail size={18} />
                    Kirim Link Reset
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text-primary transition-colors"
            >
              <ArrowLeft size={14} />
              Kembali ke login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
