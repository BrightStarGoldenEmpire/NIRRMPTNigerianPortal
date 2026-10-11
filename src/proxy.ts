import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "https://qyykxpkbjhpacnfjvudh.supabase.co";
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5eWt4cGtiamhwYWNuZmp2dWRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg3Mjg3NDQsImV4cCI6MjEwNDMwNDc0NH0.XoFjiYKmJ3mVkpF0ri2x6dLz83hNB3DQWwUaV7g4bsQ";

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // Refresh session tokens seamlessly
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Enforce Role-Based Access Control on Dashboard and Admin Routes
  if (pathname.includes("/dashboard/admin") || pathname.startsWith("/admin")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const userRole = user.user_metadata?.role || "CITIZEN";

    if (pathname.includes("/super") && userRole !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/dashboard/admin", request.url));
    }
    if (
      pathname.includes("/directorate") &&
      !["DIRECTORATE_OPS", "SUPER_ADMIN"].includes(userRole)
    ) {
      return NextResponse.redirect(new URL("/dashboard/admin", request.url));
    }
    if (
      pathname.includes("/field-desk") &&
      !["STAFF_FIELD_DESK", "DIRECTORATE_OPS", "SUPER_ADMIN"].includes(
        userRole
      )
    ) {
      return NextResponse.redirect(new URL("/dashboard/admin", request.url));
    }
  }

  return supabaseResponse;
}

export default proxy;

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};