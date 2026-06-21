// Middleware sederhana - hanya proteksi halaman, tidak API publik
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Halaman publik - tidak perlu session
const publicPages = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

// API publik - tidak perlu session
const publicApiPrefixes = [
  "/api/auth",
  "/api/register",
  "/api/forgot-password",
  "/api/reset-password",
  "/api/stocks",
  "/api/news",
  "/api/chat",
];

function isPublic(pathname: string): boolean {
  // Static files & semua API routes (masing2 handler cek auth sendiri)
  if (pathname.startsWith("/_next") || pathname.startsWith("/favicon") || pathname.startsWith("/logo") || pathname.startsWith("/api")) {
    return true;
  }
  // Public pages
  if (publicPages.includes(pathname)) {
    return true;
  }
  // Public APIs
  for (const prefix of publicApiPrefixes) {
    if (pathname.startsWith(prefix)) return true;
  }
  return false;
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip middleware for public paths
  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  // Check for session token
  const token = req.cookies.get("next-auth.session-token") || 
                req.cookies.get("__Secure-next-auth.session-token");

  // If no session token, redirect to login
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Run on ALL paths except static files
    "/((?!_next/static|_next/image|favicon.ico|logo.svg).*)",
  ],
};
