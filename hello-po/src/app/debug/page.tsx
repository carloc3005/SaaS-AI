"use client";

import { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';

export default function DebugPage() {
    const [sessionInfo, setSessionInfo] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            try {
                console.log('Checking session from client side...');
                const session = await authClient.getSession();
                console.log('Client session result:', session);
                setSessionInfo(session);
            } catch (error) {
                console.error('Session check error:', error);
                setSessionInfo({ error: error instanceof Error ? error.message : String(error) });
            } finally {
                setLoading(false);
            }
        };

        checkSession();
    }, []);

    if (loading) {
        return <div className="p-8">Loading session info...</div>;
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Session Debug Page</h1>
            
            <div className="bg-gray-100 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">Client-side Session Info:</h2>
                <pre className="text-sm overflow-auto">
                    {JSON.stringify(sessionInfo, null, 2)}
                </pre>
            </div>

            <div className="mt-4 space-x-4">
                <button 
                    onClick={() => window.location.href = '/'}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Go to Home
                </button>
                <button 
                    onClick={() => window.location.href = '/sign-in'}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                    Go to Sign In
                </button>
            </div>
        </div>
    );
}