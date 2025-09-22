import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /sign-in, /dashboard)
  const { pathname } = request.nextUrl;

  // Add CORS headers for API routes
  if (pathname.startsWith('/api/')) {
    const response = NextResponse.next();
    
    // Get the origin from the request
    const origin = request.headers.get('origin');
    
    // Allow requests from same origin, localhost, ngrok, or vercel domains
    const allowedOrigins = [
      'http://localhost:3000',
      'https://localhost:3000',
      'https://apparent-evenly-walrus.ngrok-free.app',
    ];
    
    if (origin && (
      origin === request.nextUrl.origin || 
      allowedOrigins.includes(origin) ||
      origin.includes('.vercel.app')
    )) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Credentials', 'true');
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie');
    }

    return response;
  }

  // Ensure cookies are properly handled for authentication
  const response = NextResponse.next();
  
  // Add secure cookie settings for auth routes
  if (pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up') || pathname === '/') {
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    // Ensure proper cookie handling for localhost
    const host = request.headers.get('host');
    if (host?.includes('localhost')) {
      response.headers.set('Set-Cookie', response.headers.get('Set-Cookie') || '');
    }
  }

  return response;
}

export const config = {
  matcher: [
    // Match all API routes
    '/api/:path*',
    // Match authentication pages and home page
    '/',
    '/sign-in',
    '/sign-up',
    '/dashboard/:path*',
  ],
};
