import { authMiddleware, RedirectToSignIn } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  // Routes that can be accessed while signed out
  publicRoutes: [
    "/",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/products",
    "/products/(.*)",
    "/categories",
    "/categories/(.*)",
    "/api/webhook/(.*)",
  ],

  // Routes that can always be accessed, and have
  // no authentication information
  ignoredRoutes: ["/api/webhook/(.*)"],

  // Custom logic for specific routes
  afterAuth(auth, req) {
    // If the user is trying to access an admin route and is not an admin, redirect to home
    if (req.nextUrl.pathname.startsWith("/admin")) {
      const role = auth.sessionClaims?.role;

      if (!auth.userId) {
        return RedirectToSignIn({ redirectUrl: req.url });
      }

      if (role !== "SUPER_ADMIN" && role !== "PRODUCT_MANAGER") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    // If the user is trying to access a user-only route and is not signed in, redirect to sign in
    if (
      !auth.userId &&
      (req.nextUrl.pathname.startsWith("/profile") ||
        req.nextUrl.pathname.startsWith("/orders") ||
        req.nextUrl.pathname.startsWith("/favorites") ||
        req.nextUrl.pathname.startsWith("/cart/checkout"))
    ) {
      return RedirectToSignIn({ redirectUrl: req.url });
    }
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
