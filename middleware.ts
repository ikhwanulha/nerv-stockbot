// Middleware untuk melindungi halaman yang memerlukan autentikasi
// Halaman publik: /login, /register, /forgot-password, /reset-password, /api/auth/*
export { auth as middleware } from "@/lib/auth";

export const config = {
  // Matcher: semua kecuali halaman auth, api auth, dan file statis
  matcher: [
    "/((?!login|register|forgot-password|reset-password|api/auth|_next/static|_next/image|favicon.ico|logo.svg).*)",
  ],
};
