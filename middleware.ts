// Middleware untuk melindungi halaman yang memerlukan autentikasi
// Versi sederhana - hanya menggunakan NextAuth edge-compatible

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { NextResponse } from "next/server";

// Edge-compatible auth check
const { auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize() {
        // Edge runtime - actual auth happens in lib/auth.ts
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
});

export default auth(async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Public paths - no auth needed
  const publicPaths = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/api/auth",
    "/_next",
    "/favicon.ico",
    "/logo.svg",
  ];

  const isPublic = publicPaths.some((path) => pathname.startsWith(path));
  if (isPublic) {
    return NextResponse.next();
  }

  // Protected paths - redirect to login if no session
  // @ts-ignore - NextAuth middleware type
  if (!req.auth?.user) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!login|register|forgot-password|reset-password|api/auth|_next/static|_next/image|favicon.ico|logo.svg).*)",
  ],
};
