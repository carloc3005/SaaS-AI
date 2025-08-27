"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

interface AuthRedirectProps {
  to: string;
  delay?: number;
}

export function AuthRedirect({ to, delay = 1000 }: AuthRedirectProps) {
  const router = useRouter();

  useEffect(() => {
    const checkSessionAndRedirect = async () => {
      try {
        // Wait for the delay
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Check if we have a valid session
        const session = await authClient.getSession();
        console.log('AuthRedirect session check:', session);
        
        if (session.data?.user) {
          console.log('Session found, redirecting to:', to);
          router.push(to);
          // Also force a page refresh to ensure server-side session is recognized
          setTimeout(() => {
            window.location.href = to;
          }, 500);
        } else {
          console.log('No session found, staying on current page');
        }
      } catch (error) {
        console.error('Error in AuthRedirect:', error);
        // Force a page refresh to reset state
        window.location.reload();
      }
    };

    checkSessionAndRedirect();
  }, [to, delay, router]);

  return null;
}
