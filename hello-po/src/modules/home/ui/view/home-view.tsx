"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  VideoIcon, 
  UsersIcon, 
  BotIcon, 
  LockIcon, 
  CalendarIcon, 
  TrendingUpIcon, 
  PlayIcon,
  PlusIcon,
  ArrowRightIcon,
  ShieldIcon,
  ZapIcon,
  ClockIcon,
  GlobeIcon,
  SparklesIcon,
  RocketIcon
} from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export const Homeview = () => {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");
  const [timeZones, setTimeZones] = useState<Array<{name: string, time: string, zone: string}>>([]);
  const [isClient, setIsClient] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const router = useRouter();

  // Verify authentication on component mount - ONLY ONCE
  useEffect(() => {
    let isMounted = true;
    
    const verifyAuth = async () => {
      try {
        console.log("Verifying auth on home page...");
        const session = await authClient.getSession();
        console.log("Home page session check:", session);
        
        if (session?.data?.user && isMounted) {
          setUser(session.data.user);
          setSessionLoading(false);
        } else if (isMounted) {
          console.log("No valid session, redirecting to sign-in...");
          router.replace("/sign-in");
        }
      } catch (error) {
        console.error("Auth verification failed on home page:", error);
        if (isMounted) {
          router.replace("/sign-in");
        }
      }
    };

    // Only verify once on mount
    verifyAuth();
    
    return () => {
      isMounted = false;
    };
  }, []); // No dependencies to prevent re-runs

  // Show loading state while verifying authentication
  if (sessionLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-b-2 border-gray-900 rounded-full mx-auto mb-4"></div>
          <p>Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render the home content if user is not authenticated
  if (!user) {
    return null;
  }

  // Handle hydration
  useEffect(() => {
    setIsClient(true);
    updateAllTimes();
  }, []);

  const updateAllTimes = () => {
    const now = new Date();
    
    // Local time
    setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    setCurrentDate(now.toLocaleDateString([], { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }));

    // US Time zones from Hawaii to New York
    const usTimeZones = [
      { name: 'Hawaii', zone: 'Pacific/Honolulu', abbr: 'HST' },
      { name: 'Alaska', zone: 'America/Anchorage', abbr: 'AKST' },
      { name: 'Pacific', zone: 'America/Los_Angeles', abbr: 'PST' },
      { name: 'Mountain', zone: 'America/Denver', abbr: 'MST' },
      { name: 'Central', zone: 'America/Chicago', abbr: 'CST' },
      { name: 'Eastern', zone: 'America/New_York', abbr: 'EST' }
    ];

    const timeZoneData = usTimeZones.map(tz => ({
      name: tz.name,
      time: now.toLocaleTimeString('en-US', { 
        timeZone: tz.zone, 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }),
      zone: tz.abbr
    }));

    setTimeZones(timeZoneData);
  };

  // Update time every second (only on client)
  useEffect(() => {
    if (!isClient) return;
    
    const timer = setInterval(() => {
      updateAllTimes();
    }, 1000);
    return () => clearInterval(timer);
  }, [isClient]);

  // Get time-based background theme
  const getTimeBasedTheme = () => {
    if (!isClient) return 'day'; // Default to day during SSR
    
    const hour = new Date().getHours();
    
    if (hour >= 6 && hour < 12) {
      return 'morning'; // 6 AM - 12 PM
    } else if (hour >= 12 && hour < 18) {
      return 'afternoon'; // 12 PM - 6 PM  
    } else if (hour >= 18 && hour < 21) {
      return 'evening'; // 6 PM - 9 PM
    } else {
      return 'night'; // 9 PM - 6 AM
    }
  };

  const timeTheme = getTimeBasedTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100 relative">
      {/* Animated background elements */}
      <div className="fixed inset-0 bg-gradient-to-r from-blue-50/30 via-indigo-50/30 to-slate-50/30 -z-10"></div>
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl animate-pulse -z-10"></div>
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-indigo-100/40 rounded-full blur-3xl animate-pulse delay-1000 -z-10"></div>
      
      {/* Hero Section */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-6 py-20">
          {/* Main Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 backdrop-blur-sm text-slate-700 px-6 py-3 rounded-full text-sm font-medium mb-6 border border-blue-200/50">
              <SparklesIcon className="h-4 w-4" />
              Welcome to Hello Po - Next Gen Meetings
            </div>
            <h1 className="text-6xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight">
              Meet the 
              <span className="text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-700 bg-clip-text"> Future</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed">
              Experience AI-powered meetings that adapt to your needs. Connect, collaborate, and create with intelligent agents in stunning virtual environments.
            </p>
          </div>

          {/* Redesigned Time Display - Single Horizontal Line */}
          <div className="max-w-6xl mx-auto mb-16">
            <div className={`relative overflow-hidden backdrop-blur-xl rounded-3xl border border-gray-200/50 p-8 shadow-xl transition-all duration-1000 ${
              timeTheme === 'morning' 
                ? 'bg-gradient-to-br from-orange-100/90 via-yellow-50/90 to-blue-100/90' 
                : timeTheme === 'afternoon'
                ? 'bg-gradient-to-br from-blue-100/90 via-cyan-50/90 to-blue-200/90'
                : timeTheme === 'evening'
                ? 'bg-gradient-to-br from-orange-200/90 via-pink-100/90 to-purple-200/90'
                : 'bg-gradient-to-br from-indigo-200/90 via-purple-100/90 to-blue-300/90'
            }`}>
              {/* Dynamic background elements based on time */}
              <div className="absolute inset-0 overflow-hidden">
                {timeTheme === 'morning' && (
                  <>
                    {/* Sun */}
                    <div className="absolute top-4 right-8 w-16 h-16 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full shadow-lg opacity-80 animate-pulse"></div>
                    {/* Clouds */}
                    <div className="absolute top-12 left-12 w-20 h-8 bg-white/40 rounded-full opacity-60"></div>
                    <div className="absolute top-8 left-20 w-16 h-6 bg-white/30 rounded-full opacity-50"></div>
                  </>
                )}
                {timeTheme === 'afternoon' && (
                  <>
                    {/* High sun */}
                    <div className="absolute top-2 right-1/2 translate-x-1/2 w-20 h-20 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-full shadow-lg opacity-70"></div>
                    {/* Scattered clouds */}
                    <div className="absolute top-16 left-8 w-24 h-10 bg-white/30 rounded-full opacity-40"></div>
                    <div className="absolute top-20 right-12 w-18 h-8 bg-white/25 rounded-full opacity-35"></div>
                  </>
                )}
                {timeTheme === 'evening' && (
                  <>
                    {/* Setting sun */}
                    <div className="absolute bottom-8 right-12 w-18 h-18 bg-gradient-to-br from-orange-400 to-red-500 rounded-full shadow-lg opacity-75"></div>
                    {/* Evening clouds */}
                    <div className="absolute bottom-12 left-8 w-28 h-12 bg-gradient-to-r from-orange-200/40 to-pink-200/40 rounded-full opacity-50"></div>
                    <div className="absolute bottom-16 right-24 w-20 h-8 bg-gradient-to-r from-pink-200/30 to-purple-200/30 rounded-full opacity-40"></div>
                  </>
                )}
                {timeTheme === 'night' && (
                  <>
                    {/* Moon */}
                    <div className="absolute top-6 right-10 w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-300 rounded-full shadow-lg opacity-80"></div>
                    {/* Stars */}
                    <div className="absolute top-8 left-16 w-1 h-1 bg-white rounded-full opacity-70 animate-pulse"></div>
                    <div className="absolute top-12 left-32 w-1 h-1 bg-white rounded-full opacity-60 animate-pulse delay-1000"></div>
                    <div className="absolute top-16 right-24 w-1 h-1 bg-white rounded-full opacity-80 animate-pulse delay-500"></div>
                    <div className="absolute top-20 right-36 w-1 h-1 bg-white rounded-full opacity-50 animate-pulse delay-1500"></div>
                    {/* Night clouds */}
                    <div className="absolute bottom-16 left-12 w-24 h-10 bg-gray-400/20 rounded-full opacity-30"></div>
                  </>
                )}
              </div>
              {/* Current Local Time */}
              <div className="relative z-10 text-center mb-8 mt-20">
                {isClient ? (
                  <div className="space-y-3">
                    <div className={`text-4xl md:text-5xl font-bold font-mono tracking-wider text-transparent bg-clip-text ${
                      timeTheme === 'morning' 
                        ? 'bg-gradient-to-r from-orange-600 via-yellow-600 to-orange-700' 
                        : timeTheme === 'afternoon'
                        ? 'bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700'
                        : timeTheme === 'evening'
                        ? 'bg-gradient-to-r from-orange-600 via-pink-600 to-purple-700'
                        : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800'
                    }`}>
                      {currentTime}
                    </div>
                    <div className="text-lg font-medium text-slate-700">
                      {currentDate}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-4xl md:text-5xl font-bold font-mono text-slate-400 tracking-wider">
                      --:--:--
                    </div>
                    <div className="text-lg font-medium text-slate-400">
                      Loading...
                    </div>
                  </div>
                )}
              </div>

              {/* US Time Zones - Horizontal Strip */}
              <div className="relative z-10 border-t border-gray-200/50 pt-8">
                <div className="flex items-center justify-center gap-2 mb-6">
                  <GlobeIcon className="h-5 w-5 text-blue-500" />
                  <h4 className="text-lg font-semibold text-slate-900">US Time Zones</h4>
                </div>
                
                {isClient ? (
                  <div className="flex flex-wrap justify-center gap-4 lg:gap-6">
                    {timeZones.map((tz, index) => (
                      <div key={index} className="flex-shrink-0 text-center p-4 bg-gradient-to-br from-gray-50/80 to-gray-100/80 rounded-2xl border border-gray-200/50 hover:from-blue-50/80 hover:to-indigo-50/80 transition-all duration-300 backdrop-blur-sm min-w-[140px]">
                        <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">
                          {tz.zone}
                        </div>
                        <div className="text-lg font-bold font-mono text-slate-900 mb-1 tracking-wide">
                          {tz.time}
                        </div>
                        <div className="text-xs text-slate-600 font-medium">
                          {tz.name}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap justify-center gap-4 lg:gap-6">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <div key={index} className="flex-shrink-0 text-center p-4 bg-gradient-to-br from-gray-50/80 to-gray-100/80 rounded-2xl border border-gray-200/50 backdrop-blur-sm min-w-[140px]">
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                          ---
                        </div>
                        <div className="text-lg font-bold font-mono text-slate-400 mb-1 tracking-wide">
                          --:--:-- --
                        </div>
                        <div className="text-xs text-slate-400 font-medium">
                          Loading...
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-2xl shadow-blue-500/25 border-0 h-14 px-8 text-lg font-semibold">
              <Link href="/meetings">
                <RocketIcon className="h-5 w-5 mr-3" />
                Launch Meeting
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900 bg-white h-14 px-8 text-lg font-semibold shadow-lg">
              <Link href="/meetings/private">
                <LockIcon className="h-5 w-5 mr-3" />
                Private Session
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-6xl mx-auto px-6 py-12">
        {/* Quick Actions */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Quick Actions</h2>
            <p className="text-slate-600 text-lg">
              Start your meeting journey with one click
            </p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto">
            <Link href="/meetings" className="group">
              <div className="bg-white/90 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-400 transition-colors">
                  <VideoIcon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-slate-900 font-semibold mb-1">New Meeting</h3>
                <p className="text-slate-600 text-sm">Start instantly</p>
              </div>
            </Link>

            <Link href="/meetings/private" className="group">
              <div className="bg-white/90 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-400 transition-colors">
                  <LockIcon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-slate-900 font-semibold mb-1">Private Meeting</h3>
                <p className="text-slate-600 text-sm">Secure session</p>
              </div>
            </Link>

            <Link href="/agents" className="group">
              <div className="bg-white/90 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-400 transition-colors">
                  <BotIcon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-slate-900 font-semibold mb-1">AI Agents</h3>
                <p className="text-slate-600 text-sm">Configure AI</p>
              </div>
            </Link>

            <Link href="/meetings" className="group">
              <div className="bg-white/90 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-400 transition-colors">
                  <CalendarIcon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-slate-900 font-semibold mb-1">Schedule</h3>
                <p className="text-slate-600 text-sm">Plan ahead</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Why Choose Hello Po</h2>
            <p className="text-slate-600 text-lg">
              Powerful features designed for modern teams
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3">
            <div className="bg-white/90 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BotIcon className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">AI-Powered</h3>
              <p className="text-slate-600">Smart assistants enhance every meeting</p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ShieldIcon className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Secure</h3>
              <p className="text-slate-600">End-to-end encryption for peace of mind</p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ZapIcon className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Lightning Fast</h3>
              <p className="text-slate-600">Start meetings in seconds, not minutes</p>
            </div>
          </div>
        </div>

        {/* Getting Started */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm border border-white/20 rounded-3xl p-8 shadow-lg">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Ready to get started?</h3>
              <p className="text-slate-600">Create your first AI agent and launch your meeting experience</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 h-12 px-6 font-semibold">
                <Link href="/agents">
                  <SparklesIcon className="h-5 w-5 mr-2" />
                  Create AI Agent
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50 bg-white h-12 px-6 font-semibold">
                <Link href="/meetings">
                  <PlayIcon className="h-5 w-5 mr-2" />
                  Start Meeting
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

