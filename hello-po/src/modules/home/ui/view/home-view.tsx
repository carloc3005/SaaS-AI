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

export const Homeview = () => {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");
  const [timeZones, setTimeZones] = useState<Array<{name: string, time: string, zone: string}>>([]);
  const [isClient, setIsClient] = useState(false);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
      {/* Animated background elements */}
      <div className="fixed inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 -z-10"></div>
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse -z-10"></div>
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000 -z-10"></div>
      
      {/* Hero Section */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-6 py-20">
          {/* Main Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-medium mb-6 border border-white/10">
              <SparklesIcon className="h-4 w-4" />
              Welcome to Hello Po - Next Gen Meetings
            </div>
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Meet the 
              <span className="text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text"> Future</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
              Experience AI-powered meetings that adapt to your needs. Connect, collaborate, and create with intelligent agents in stunning virtual environments.
            </p>
          </div>

          {/* Redesigned Time Display - Single Horizontal Line */}
          <div className="max-w-6xl mx-auto mb-16">
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl">
              {/* Current Local Time */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <ClockIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Live Time</h3>
                    <p className="text-sm text-gray-400">Real-time updates</p>
                  </div>
                </div>
                
                {isClient ? (
                  <div className="space-y-3">
                    <div className="text-5xl md:text-6xl font-bold font-mono text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text tracking-wider">
                      {currentTime}
                    </div>
                    <div className="text-lg font-medium text-gray-300">
                      {currentDate}
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm text-gray-400">Live</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-5xl md:text-6xl font-bold font-mono text-gray-500 tracking-wider">
                      --:--:--
                    </div>
                    <div className="text-lg font-medium text-gray-500">
                      Loading...
                    </div>
                  </div>
                )}
              </div>

              {/* US Time Zones - Horizontal Strip */}
              <div className="border-t border-white/10 pt-8">
                <div className="flex items-center justify-center gap-2 mb-6">
                  <GlobeIcon className="h-5 w-5 text-blue-400" />
                  <h4 className="text-lg font-semibold text-white">US Time Zones</h4>
                </div>
                
                {isClient ? (
                  <div className="flex flex-wrap justify-center gap-4 lg:gap-6">
                    {timeZones.map((tz, index) => (
                      <div key={index} className="flex-shrink-0 text-center p-4 bg-gradient-to-br from-white/5 to-white/10 rounded-2xl border border-white/10 hover:from-blue-500/10 hover:to-purple-500/10 transition-all duration-300 backdrop-blur-sm min-w-[140px]">
                        <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">
                          {tz.zone}
                        </div>
                        <div className="text-lg font-bold font-mono text-white mb-1 tracking-wide">
                          {tz.time}
                        </div>
                        <div className="text-xs text-gray-400 font-medium">
                          {tz.name}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap justify-center gap-4 lg:gap-6">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <div key={index} className="flex-shrink-0 text-center p-4 bg-gradient-to-br from-white/5 to-white/10 rounded-2xl border border-white/10 backdrop-blur-sm min-w-[140px]">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                          ---
                        </div>
                        <div className="text-lg font-bold font-mono text-gray-500 mb-1 tracking-wide">
                          --:--:-- --
                        </div>
                        <div className="text-xs text-gray-500 font-medium">
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
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-2xl shadow-blue-500/25 border-0 h-14 px-8 text-lg font-semibold">
              <Link href="/meetings">
                <RocketIcon className="h-5 w-5 mr-3" />
                Launch Meeting
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 bg-white/90 backdrop-blur-sm h-14 px-8 text-lg font-semibold shadow-lg">
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
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Quick Actions</h2>
            <p className="text-gray-600 text-lg">
              Start your meeting journey with one click
            </p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto">
            <Link href="/meetings" className="group">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-400 transition-colors">
                  <VideoIcon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-gray-900 font-semibold mb-1">New Meeting</h3>
                <p className="text-gray-600 text-sm">Start instantly</p>
              </div>
            </Link>

            <Link href="/meetings/private" className="group">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-400 transition-colors">
                  <LockIcon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-gray-900 font-semibold mb-1">Private Meeting</h3>
                <p className="text-gray-600 text-sm">Secure session</p>
              </div>
            </Link>

            <Link href="/agents" className="group">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-400 transition-colors">
                  <BotIcon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-gray-900 font-semibold mb-1">AI Agents</h3>
                <p className="text-gray-600 text-sm">Configure AI</p>
              </div>
            </Link>

            <Link href="/meetings" className="group">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-400 transition-colors">
                  <CalendarIcon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-gray-900 font-semibold mb-1">Schedule</h3>
                <p className="text-gray-600 text-sm">Plan ahead</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Why Choose Hello Po</h2>
            <p className="text-gray-600 text-lg">
              Powerful features designed for modern teams
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BotIcon className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered</h3>
              <p className="text-gray-600">Smart assistants enhance every meeting</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ShieldIcon className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure</h3>
              <p className="text-gray-600">End-to-end encryption for peace of mind</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ZapIcon className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Lightning Fast</h3>
              <p className="text-gray-600">Start meetings in seconds, not minutes</p>
            </div>
          </div>
        </div>

        {/* Getting Started */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready to get started?</h3>
              <p className="text-gray-600">Create your first AI agent and launch your meeting experience</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 h-12 px-6 font-semibold">
                <Link href="/agents">
                  <SparklesIcon className="h-5 w-5 mr-2" />
                  Create AI Agent
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-white h-12 px-6 font-semibold">
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

