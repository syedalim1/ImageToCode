import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define public routes using createRouteMatcher
const isPublicRoute = createRouteMatcher([
  "/",
  "/api/webhook(.*)",
  "/pricing",
  "/about",
  "/contact",
  "/blog(.*)",
  "/coming-soon(.*)",
  "/credits(.*)",
]);

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default clerkMiddleware(async (auth, req) => {
  // For public routes, do nothing
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // For any other route, protect it
  const { userId } = await auth();

  // If the user isn't authenticated, redirect to sign-in
  if (!userId) {
    // Using the proper pattern from clerk docs to redirect
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // If the user is logged in and trying to access a protected route, allow them to access route
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
