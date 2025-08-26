"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";

export const DebugAuth = () => {
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    const getDebugInfo = async () => {
      try {
        const session = await authClient.getSession();
        setDebugInfo({
          hasSession: !!session?.data?.user,
          baseURL: typeof window !== 'undefined' ? window.location.origin : 'unknown',
          timestamp: new Date().toISOString(),
          sessionData: session?.data?.user ? { 
            userId: session.data.user.id, 
            email: session.data.user.email 
          } : null,
          rawSession: session ? 'Session exists' : 'No session',
        });
      } catch (error) {
        setDebugInfo({
          error: error instanceof Error ? error.message : 'Unknown error',
          baseURL: typeof window !== 'undefined' ? window.location.origin : 'unknown',
          timestamp: new Date().toISOString(),
        });
      }
    };

    getDebugInfo();
  }, []);

  if (process.env.NODE_ENV === 'production') {
    // TEMPORARILY SHOW DEBUG INFO IN PRODUCTION
    // return null;
  }

  return (
    <div className="fixed bottom-4 right-4 p-2 bg-gray-800 text-white text-xs rounded max-w-xs">
      <strong>Auth Debug:</strong>
      <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
    </div>
  );
};
