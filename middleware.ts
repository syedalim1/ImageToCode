import { clerkMiddleware, redirectToSignIn } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default clerkMiddleware({
  authorizedParties: process.env.NODE_ENV === 'production' ? [process.env.NEXT_PUBLIC_SITE_URL] : undefined,
  publicRoutes: [
    '/',
    '/api/webhook(.*)',
    '/pricing',
    '/about',
    '/contact',
    '/blog(.*)',
    '/coming-soon(.*)',
    '/credits(.*)',
  ],
  afterAuth(auth, req, evt) {
    // Handle users who aren't authenticated
    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url })
    }
    // If the user is logged in and trying to access a protected route, allow them to access route
    return NextResponse.next()
  },
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
