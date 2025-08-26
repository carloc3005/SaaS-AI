import { createAuthClient } from "better-auth/react";

const getBaseURL = () => {
    // In browser, use the current origin
    if (typeof window !== 'undefined') {
        return window.location.origin;
    }
    
    // Server-side: use environment variables in order of preference
    if (process.env.BETTER_AUTH_URL) {
        return process.env.BETTER_AUTH_URL;
    }
    
    if (process.env.NEXT_PUBLIC_BASE_URL) {
        return process.env.NEXT_PUBLIC_BASE_URL;
    }
    
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }
    
    if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
        return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
    }
    
    return "http://localhost:3000";
};

export const authClient = createAuthClient({
    baseURL: getBaseURL(),
    // Add additional configuration for better reliability
    fetchOptions: {
        onError: (context) => {
            console.error("Auth client error:", context);
        },
        onSuccess: (context) => {
            console.log("Auth client success:", context);
        },
    },
});