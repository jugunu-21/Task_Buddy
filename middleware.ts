import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const idToken = request.cookies.get('firebase-token');
  const isAuthPage = request.nextUrl.pathname.startsWith('/signin');

  if (isAuthPage) {
    if (idToken) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  if (!idToken) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/signin'
  ]
};