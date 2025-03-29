import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isPublicRoute = createRouteMatcher(["/api/webhooks(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // Restringir las rutas de administración a usuarios con permisos específicos
  // Por ejemplo, solo permitir a los administradores de la organización
  // que accedan a las rutas de administración

  // Skip authentication for public routes
  if (isPublicRoute(req)) {
    return;
  }

  if (isProtectedAdminRoute(req)) {
    await auth.protect((has) => {
      return (
        has({ permission: "org:admin:example1" }) ||
        has({ permission: "org:admin:example2" })
      );
    });
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
