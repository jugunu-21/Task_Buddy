import { getApps, initializeApp } from 'firebase/app';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Skip middleware for API routes and static files
  if (request.nextUrl.pathname.startsWith('/api/') || 
      request.nextUrl.pathname.startsWith('/_next/') ||
      request.nextUrl.pathname.includes('.'))
  {
    return NextResponse.next();
  }

  const firebaseToken = request.cookies.get('firebase-token')?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith('/signin');
  const response = NextResponse.next();

  // If no token and not on auth page, redirect to signin
  if (!firebaseToken && !isAuthPage) {
    const signInUrl = new URL('/signin', request.url);
    return NextResponse.redirect(signInUrl);
  }

  // If has token and on auth page, redirect to home
  if (firebaseToken && isAuthPage) {
    const homeUrl = new URL('/', request.url);
    return NextResponse.redirect(homeUrl);
  }

  // Set cache control headers to prevent browser caching
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');

  return response;
}

export const config = {
  matcher: [
    '/:path*',
    '/signin'
  ]
};