import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = ['/', '/sign-in', '/sign-up', '/api/webhook'];

export default clerkMiddleware((auth, req: NextRequest) => {
  // If the user is signed in and trying to access the landing page,
  // redirect them to the dashboard
  if ((auth as { userId?: string }).userId && req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // If the user is not signed in and trying to access a protected route,
  // redirect them to the sign-in page
  if (!(auth as { userId?: string }).userId && !publicRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
    const signInUrl = new URL('/sign-in', req.url);
    signInUrl.searchParams.set('redirect_url', req.url);
    return NextResponse.redirect(signInUrl);
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};