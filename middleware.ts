import { NextRequest, NextResponse } from "next/server";
import authConfig from "./auth.config";
import NextAuth from "next-auth";

// Use only one of the two middleware options below
// 1. Use middleware directly
// export const { auth: middleware } = NextAuth(authConfig)

// 2. Wrapped middleware option
const { auth } = NextAuth(authConfig);
export default auth(async function middleware(request: NextRequest) {
  // Define protected routes that require authentication
  const protectedRoutes = ["/dashboard", "/profile", "/settings"];

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // If trying to access a protected route without being authenticated
  if (isProtectedRoute) {
    // Redirect to the login page
    const url = new URL("/", request.url);
    url.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // If trying to access auth pages while already authenticated
  const authRoutes = ["/login", "/register", "/reset-password"];
  const isAuthRoute = authRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isAuthRoute) {
    // Redirect to the dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
});
