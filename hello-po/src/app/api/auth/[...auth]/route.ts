import { auth } from "@/lib/auth";

// Handle CORS for preflight requests
export async function OPTIONS(request: Request) {
    const origin = request.headers.get('origin');
    
    // Allow requests from the same origin or trusted origins
    const allowedOrigins = [
        process.env.NEXT_PUBLIC_BASE_URL,
        process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
        // Allow any vercel app domain for preview deployments
        ...(origin && origin.includes('.vercel.app') ? [origin] : []),
    ].filter(Boolean);

    const isAllowedOrigin = !origin || allowedOrigins.includes(origin) || origin.includes('.vercel.app');

    return new Response(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': isAllowedOrigin ? (origin || '*') : 'null',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cookie',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Max-Age': '86400',
        },
    });
}

// Wrap the auth handlers with CORS headers
async function withCORS(response: Response, request: Request) {
    const origin = request.headers.get('origin');
    
    // Allow requests from the same origin or trusted origins
    const allowedOrigins = [
        process.env.NEXT_PUBLIC_BASE_URL,
        process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
        // Allow any vercel app domain for preview deployments
        ...(origin && origin.includes('.vercel.app') ? [origin] : []),
    ].filter(Boolean);

    const isAllowedOrigin = !origin || allowedOrigins.includes(origin) || origin.includes('.vercel.app');

    if (response instanceof Response) {
        response.headers.set('Access-Control-Allow-Origin', isAllowedOrigin ? (origin || '*') : 'null');
        response.headers.set('Access-Control-Allow-Credentials', 'true');
    }
    
    return response;
}

export const GET = auth.handler;
export const POST = auth.handler;
