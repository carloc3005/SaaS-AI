import { createAuthClient } from "better-auth/react";

const getBaseURL = () => {
    // In production, use the same origin as the current page
    if (typeof window !== 'undefined') {
        return window.location.origin;
    }
    
    // Server-side: use environment variables
    return process.env.BETTER_AUTH_URL || 
           process.env.NEXT_PUBLIC_BASE_URL || 
           (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
};

export const authClient = createAuthClient({
    baseURL: getBaseURL(),
});