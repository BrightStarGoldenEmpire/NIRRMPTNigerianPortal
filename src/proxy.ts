import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_COOKIE = "nirrmpt_session_v1";

function parseTokenPayload(token: string) {
  try {
    const [encoded] = token.split(".");
    if (!encoded) return null;

    // Standard base64url decode supported natively in Next.js 16
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const jsonStr = atob(base64);
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
}

// Next.js 16 proxy convention (formerly middleware)
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(AUTH_COOKIE)?.value;

  const isSuperAdminRoute = pathname.startsWith("/dashboard/super-admin");
  const isAdminRoute = pathname.startsWith("/dashboard/admin");

  // Allow all public pages through without restriction
  if (!isSuperAdminRoute && !isAdminRoute) {
    return NextResponse.next();
  }

  // If attempting to access admin/super-admin without a token, redirect to login
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  const payload = parseTokenPayload(token);

  if (!payload || Date.now() > payload.expiresAt) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Super Admin Route: Only SUPER_ADMIN allowed
  if (isSuperAdminRoute && payload.role !== "SUPER_ADMIN") {
    return NextResponse.redirect(new URL("/dashboard/admin", req.url));
  }

  // Directorate Admin Route: SUPER_ADMIN, ADMIN, and STAFF_ADMIN allowed
  if (
    isAdminRoute &&
    !["SUPER_ADMIN", "ADMIN", "STAFF_ADMIN", "DIRECTORATE_OPS"].includes(payload.role)
  ) {
    return NextResponse.redirect(new URL("/dashboard/citizen", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/super-admin/:path*", "/dashboard/admin/:path*"],
};