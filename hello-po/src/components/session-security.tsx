"use client";

import { useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

export const SessionSecurity = () => {
    const router = useRouter();

    useEffect(() => {
        let inactivityTimer: NodeJS.Timeout;
        let warningTimer: NodeJS.Timeout;
        
        // Auto-logout after 30 minutes of inactivity
        const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes
        const WARNING_TIME = 25 * 60 * 1000; // Show warning at 25 minutes
        
        const resetInactivityTimer = () => {
            clearTimeout(inactivityTimer);
            clearTimeout(warningTimer);
            
            // Set warning timer
            warningTimer = setTimeout(() => {
                const shouldLogout = window.confirm(
                    'You have been inactive for 25 minutes. You will be automatically logged out in 5 minutes for security. Click OK to stay logged in, or Cancel to logout now.'
                );
                
                if (!shouldLogout) {
                    handleLogout();
                }
            }, WARNING_TIME);
            
            // Set auto-logout timer
            inactivityTimer = setTimeout(() => {
                handleLogout();
            }, INACTIVITY_TIMEOUT);
        };

        const handleLogout = async () => {
            try {
                console.log('Auto-logout triggered for security');
                await authClient.signOut();
                
                // Clear any local storage or session storage
                localStorage.clear();
                sessionStorage.clear();
                
                // Redirect to sign-in
                router.push('/sign-in');
                router.refresh();
            } catch (error) {
                console.error('Error during auto-logout:', error);
                // Force redirect anyway for security
                window.location.href = '/sign-in';
            }
        };

        // Events that reset the inactivity timer
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
        
        // Add event listeners
        events.forEach(event => {
            document.addEventListener(event, resetInactivityTimer, true);
        });

        // Handle visibility change (when user switches tabs or minimizes browser)
        const handleVisibilityChange = () => {
            if (document.hidden) {
                console.log('Page became hidden - starting security timer');
                // When page becomes hidden, give user 10 minutes before logout
                setTimeout(async () => {
                    if (document.hidden) {
                        console.log('Page was hidden for 10 minutes - auto logout for security');
                        await handleLogout();
                    }
                }, 10 * 60 * 1000); // 10 minutes
            } else {
                console.log('Page became visible - resetting timers');
                resetInactivityTimer();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Handle before unload (when user is about to close the browser/tab)
        const handleBeforeUnload = () => {
            // Note: This doesn't actually log out the user immediately,
            // but the session cookie will expire when browser closes due to our configuration
            console.log('Browser/tab closing - session will expire');
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        // Start the initial timer
        resetInactivityTimer();

        // Cleanup on component unmount
        return () => {
            clearTimeout(inactivityTimer);
            clearTimeout(warningTimer);
            
            events.forEach(event => {
                document.removeEventListener(event, resetInactivityTimer, true);
            });
            
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [router]);

    // This component doesn't render anything visible
    return null;
};