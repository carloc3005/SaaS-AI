import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";

const getBaseURL = () => {
    // Use BETTER_AUTH_URL if set
    if (process.env.BETTER_AUTH_URL) {
        return process.env.BETTER_AUTH_URL;
    }
    
    // Use NEXT_PUBLIC_BASE_URL if set
    if (process.env.NEXT_PUBLIC_BASE_URL) {
        return process.env.NEXT_PUBLIC_BASE_URL;
    }
    
    // Use Vercel URL if available (this will be the current deployment URL)
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }
    
    // Use Vercel Project Production URL if available
    if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
        return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
    }
    
    // Fallback to localhost
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
    },
    trustedOrigins: [
        getBaseURL(),
        // Add current Vercel URL if available
        ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
        // Add common Vercel patterns
        "https://*.vercel.app",
        // Add localhost for development
        "http://localhost:3000",
    ],
});