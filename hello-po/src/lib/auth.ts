import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";

const getBaseURL = () => {
    // Use BETTER_AUTH_URL if explicitly set (production/vercel env var)
    if (process.env.BETTER_AUTH_URL) {
        console.log('Using BETTER_AUTH_URL for auth baseURL:', process.env.BETTER_AUTH_URL);
        return process.env.BETTER_AUTH_URL;
    }
    
    // Priority: Use VERCEL_URL first (it's always set on Vercel)
    if (process.env.VERCEL_URL) {
        const url = `https://${process.env.VERCEL_URL}`;
        console.log('Using VERCEL_URL for auth baseURL:', url);
        return url;
    }
    
    // In development, prefer localhost
    if (process.env.NODE_ENV === 'development') {
        // Use NEXT_PUBLIC_BASE_URL if set for local dev
        if (process.env.NEXT_PUBLIC_BASE_URL) {
            console.log('Using NEXT_PUBLIC_BASE_URL for auth baseURL:', process.env.NEXT_PUBLIC_BASE_URL);
            return process.env.NEXT_PUBLIC_BASE_URL;
        }
        
        console.log('Using localhost for auth baseURL (dev fallback)');
        return "http://localhost:3000";
    }
    
    // Fallback 
    console.log('Using localhost for auth baseURL (final fallback)');
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
    // Removed social providers - using email/password only
    advanced: {
        cookiePrefix: "better-auth",
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
                    domain: undefined, // Let the browser set this automatically
                }
            }
        }
    },
    trustedOrigins: [
        getBaseURL(),
        "http://localhost:3000",
        "https://localhost:3000",
    ].filter(Boolean),
});