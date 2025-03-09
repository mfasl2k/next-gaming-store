import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/app/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute =
    pathname === "/cart" || pathname.startsWith("/admin");

  const isAuthRoute = pathname === "/login" || pathname === "/register";

  const session = await auth();
  const token = session?.user;

  const isAdminRoute = pathname.startsWith("/admin");
  const isAdmin = token?.role === "ADMIN";

  if (isProtectedRoute) {
    if (!token) {
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", encodeURIComponent(pathname));
      return NextResponse.redirect(url);
    }

    if (isAdminRoute && !isAdmin) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Protected routes that need authentication
    "/cart",
    "/cart/:path*",
    "/admin/:path*",
    // Auth routes to check if already authenticated
    "/login",
    "/register",
  ],
};
