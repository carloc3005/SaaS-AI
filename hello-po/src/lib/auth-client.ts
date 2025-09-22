import { createAuthClient } from "better-auth/react";

const getBaseURL = () => {
    // In browser, use the current origin (this is the most reliable)
    if (typeof window !== 'undefined') {
        console.log('Client-side auth baseURL:', window.location.origin);
        return window.location.origin;
    }
    
    // Server-side: use environment variables in order of preference
    // In development, prefer localhost unless explicitly using ngrok
    if (process.env.NODE_ENV === 'development') {
        if (!process.env.FORCE_NGROK && !process.env.BETTER_AUTH_URL?.includes('ngrok')) {
            console.log('Server-side auth client baseURL: localhost (dev mode)');
            return "http://localhost:3000";
        }
    }
    
    if (process.env.BETTER_AUTH_URL) {
        console.log('Server-side auth client baseURL:', process.env.BETTER_AUTH_URL);
        return process.env.BETTER_AUTH_URL;
    }
    
    if (process.env.NEXT_PUBLIC_BASE_URL) {
        console.log('Server-side auth client baseURL:', process.env.NEXT_PUBLIC_BASE_URL);
        return process.env.NEXT_PUBLIC_BASE_URL;
    }
    
    // Use VERCEL_URL for Vercel deployments
    if (process.env.VERCEL_URL) {
        const url = `https://${process.env.VERCEL_URL}`;
        console.log('Server-side auth client baseURL:', url);
        return url;
    }
    
    console.log('Server-side auth client baseURL: localhost (fallback)');
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