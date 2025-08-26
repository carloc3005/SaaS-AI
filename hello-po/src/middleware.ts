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
    
    // Allow requests from same origin or vercel domains
    if (origin && (origin.includes('.vercel.app') || origin === request.nextUrl.origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Credentials', 'true');
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie');
    }

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all API routes
    '/api/:path*',
  ],
};
