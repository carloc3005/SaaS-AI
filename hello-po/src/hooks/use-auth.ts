"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface UseAuthReturn {
  user: any;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkSession = async () => {
    try {
      const session = await authClient.getSession();
      console.log("Session data:", session);
      
      if (session?.data?.user) {
        setUser(session.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error checking session:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await authClient.signOut();
      setUser(null);
      router.push("/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
      // Force redirect even if sign out fails
      window.location.href = "/sign-in";
    }
  };

  const refreshSession = async () => {
    setLoading(true);
    await checkSession();
  };

  useEffect(() => {
    checkSession();
  }, []);

  return {
    user,
    loading,
    signOut,
    refreshSession,
  };
}
