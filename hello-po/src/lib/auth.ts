import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";

const getBaseURL = () => {
    // In development, prefer localhost over ngrok for local access
    if (process.env.NODE_ENV === 'development') {
        // If accessing via localhost, use localhost
        if (typeof window !== 'undefined' && window.location.origin.includes('localhost')) {
            console.log('Using localhost for auth baseURL (client-side)');
            return "http://localhost:3000";
        }
        
        // Server-side: check if we should use localhost or ngrok
        // If no explicit override, prefer localhost for local development
        if (!process.env.FORCE_NGROK && !process.env.BETTER_AUTH_URL?.includes('ngrok')) {
            console.log('Using localhost for auth baseURL (server-side dev)');
            return "http://localhost:3000";
        }
    }
    
    // Use BETTER_AUTH_URL if explicitly set
    if (process.env.BETTER_AUTH_URL) {
        console.log('Using BETTER_AUTH_URL for auth baseURL:', process.env.BETTER_AUTH_URL);
        return process.env.BETTER_AUTH_URL;
    }
    
    // Use NEXT_PUBLIC_BASE_URL if set
    if (process.env.NEXT_PUBLIC_BASE_URL) {
        console.log('Using NEXT_PUBLIC_BASE_URL for auth baseURL:', process.env.NEXT_PUBLIC_BASE_URL);
        return process.env.NEXT_PUBLIC_BASE_URL;
    }
    
    // Priority: Use VERCEL_URL first (it's always set on Vercel)
    if (process.env.VERCEL_URL) {
        const url = `https://${process.env.VERCEL_URL}`;
        console.log('Using VERCEL_URL for auth baseURL:', url);
        return url;
    }
    
    // Fallback to localhost for local development
    console.log('Using localhost for auth baseURL (fallback)');
    return "http://localhost:3000";
};

export const auth = betterAuth({
    baseURL: getBaseURL(),
    secret: process.env.BETTER_AUTH_SECRET!,
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            ...schema,
        }
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false, // Disable email verification for now
    },
    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24, // 1 day
        cookieCache: {
            enabled: true,
            maxAge: 60 * 5, // 5 minutes
        },
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },

        discord: {
            clientId: process.env.DISCORD_CLIENT_ID as string,
            clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
        },
    },
    advanced: {
        crossSubDomainCookies: {
            enabled: true,
        },
        cookiePrefix: "better-auth",
        // Add cookie configuration for localhost
        generateId: () => crypto.randomUUID(),
        cookies: {
            sessionToken: {
                name: "better-auth.session_token",
                options: {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    path: '/',
                    maxAge: 60 * 60 * 24 * 7, // 7 days
                    // Ensure cookies work on localhost
                    domain: process.env.NODE_ENV === 'development' ? undefined : undefined,
                }
            }
        }
    },
    trustedOrigins: [
        getBaseURL(),
        // Always include localhost for development
        "http://localhost:3000",
        "https://localhost:3000",
        // Include ngrok URLs for external access
        "https://apparent-evenly-walrus.ngrok-free.app",
        // Add Vercel patterns
        "https://*.vercel.app",
        // Add your specific Vercel domains
        "https://hello-kl0jtd1vu-carlo-castillos-projects-1517593b.vercel.app",
        "https://hello-edz8zou8z-carlo-castillos-projects-1517593b.vercel.app",
        // Add any additional origins that might be needed
        ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
        ...(process.env.VERCEL_PROJECT_PRODUCTION_URL ? [`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`] : []),
        // Add current environment URLs
        ...(process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL] : []),
        ...(process.env.NEXT_PUBLIC_BASE_URL ? [process.env.NEXT_PUBLIC_BASE_URL] : []),
    ].filter(Boolean),
});