"use client";

import { Separator } from "@/components/ui/separator";
import {
    Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader,
    SidebarMenu, SidebarMenuButton, SidebarMenuItem
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { BotIcon, LockIcon, VideoIcon, PaletteIcon, CheckIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { DashboardUserButton } from "./dashboard-user-button";

const firstSection = [
    {
        icon: BotIcon,
        label: "Agents",
        href: "/agents",
    },
    {
        icon: VideoIcon,
        label: "Meetings",
        href: "/meetings",
    },
];

const secondSection = [
    {
        icon: LockIcon,
        label: "Private Meeting",
        href: "/meetings/private",
    },
];

const themeColors = [
    { name: "Light", id: "light", bgColor: "#ffffff", textColor: "#1f2937", hoverColor: "rgba(31, 41, 55, 0.05)", activeColor: "rgba(31, 41, 55, 0.1)", preview: "bg-white border-2" },
    { name: "Ocean Blue", id: "blue", bgColor: "#1e40af", textColor: "#ffffff", hoverColor: "rgba(255, 255, 255, 0.1)", activeColor: "rgba(255, 255, 255, 0.15)", preview: "bg-blue-700" },
    { name: "Forest Green", id: "green", bgColor: "#059669", textColor: "#ffffff", hoverColor: "rgba(255, 255, 255, 0.1)", activeColor: "rgba(255, 255, 255, 0.15)", preview: "bg-emerald-600" },
    { name: "Royal Purple", id: "purple", bgColor: "#7c3aed", textColor: "#ffffff", hoverColor: "rgba(255, 255, 255, 0.1)", activeColor: "rgba(255, 255, 255, 0.15)", preview: "bg-purple-700" },
    { name: "Crimson Red", id: "red", bgColor: "#dc2626", textColor: "#ffffff", hoverColor: "rgba(255, 255, 255, 0.1)", activeColor: "rgba(255, 255, 255, 0.15)", preview: "bg-red-600" },
    { name: "Sunset Orange", id: "orange", bgColor: "#ea580c", textColor: "#ffffff", hoverColor: "rgba(255, 255, 255, 0.1)", activeColor: "rgba(255, 255, 255, 0.15)", preview: "bg-orange-600" },
    { name: "Midnight Dark", id: "dark", bgColor: "#111827", textColor: "#f9fafb", hoverColor: "rgba(249, 250, 251, 0.1)", activeColor: "rgba(249, 250, 251, 0.15)", preview: "bg-gray-900" },
    { name: "Pink Blossom", id: "pink", bgColor: "#db2777", textColor: "#ffffff", hoverColor: "rgba(255, 255, 255, 0.1)", activeColor: "rgba(255, 255, 255, 0.15)", preview: "bg-pink-600" },
];

export const DashboardSidebar = () => {
    const pathname = usePathname();
    const [currentTheme, setCurrentTheme] = useState<string>('light');
    const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('sidebar-theme') || 'light';
        setCurrentTheme(savedTheme);
        applyTheme(savedTheme);
    }, []);

    const applyTheme = (themeId: string) => {
        const theme = themeColors.find(t => t.id === themeId) || themeColors[0];
        
        // Apply CSS custom properties to the document root
        document.documentElement.style.setProperty('--sidebar-bg', theme.bgColor);
        document.documentElement.style.setProperty('--sidebar-text', theme.textColor);
        document.documentElement.style.setProperty('--sidebar-hover', theme.hoverColor);
        document.documentElement.style.setProperty('--sidebar-active', theme.activeColor);
        
        // Remove and add theme class to body for better CSS specificity
        document.body.className = document.body.className.replace(/theme-\w+/g, '');
        document.body.classList.add(`theme-${themeId}`);
        
        // Force a re-render to apply the changes
        setTimeout(() => {
            setCurrentTheme(themeId);
        }, 10);
    };

    const handleThemeChange = (themeId: string) => {
        setCurrentTheme(themeId);
        localStorage.setItem('sidebar-theme', themeId);
        applyTheme(themeId);
        setIsColorPickerOpen(false);
    };

    const currentThemeConfig = themeColors.find(theme => theme.id === currentTheme) || themeColors[0];

    return (
        <div 
            className={`themed-sidebar theme-${currentTheme}`}
            style={{
                backgroundColor: currentThemeConfig.bgColor,
                color: currentThemeConfig.textColor,
            }}
        >
            <Sidebar 
                className="themed-sidebar"
                style={{
                    backgroundColor: currentThemeConfig.bgColor,
                    color: currentThemeConfig.textColor,
                }}
            >
                <SidebarHeader>
                    <Link href="/" className="flex items-center gap-2 px-2 pt-2">
                        <Image src="/logoipsum-381.svg" height={36} width={36} alt="Logo for Hello Po" />
                        <p 
                            className="text-2xl font-semibold"
                            style={{ color: currentThemeConfig.textColor }}
                        >
                            Hello Po
                        </p>
                    </Link>
                </SidebarHeader>
                <div className="px-4 py-2">
                    <Separator 
                        className="opacity-20" 
                        style={{ backgroundColor: currentThemeConfig.textColor }}
                    />
                </div>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {firstSection.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <SidebarMenuItem key={item.href}>
                                            <SidebarMenuButton 
                                                asChild 
                                                className="h-10 sidebar-menu-item"
                                                style={{
                                                    backgroundColor: isActive ? currentThemeConfig.activeColor : 'transparent',
                                                    border: 'none',
                                                    outline: 'none',
                                                    boxShadow: 'none',
                                                }}
                                                isActive={isActive}
                                            >
                                                <Link href={item.href} className="flex items-center gap-2">
                                                    <item.icon 
                                                        className="size-5" 
                                                        style={{ color: currentThemeConfig.textColor }}
                                                    />
                                                    <span 
                                                        className="text-sm font-medium tracking-tight"
                                                        style={{ color: currentThemeConfig.textColor }}
                                                    >
                                                        {item.label}
                                                    </span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {secondSection.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <SidebarMenuItem key={item.href}>
                                            <SidebarMenuButton 
                                                asChild 
                                                className="h-10 sidebar-menu-item"
                                                style={{
                                                    backgroundColor: isActive ? currentThemeConfig.activeColor : 'transparent',
                                                    border: 'none',
                                                    outline: 'none',
                                                    boxShadow: 'none',
                                                }}
                                                isActive={isActive}
                                            >
                                                <Link href={item.href} className="flex items-center gap-2">
                                                    <item.icon 
                                                        className="size-5" 
                                                        style={{ color: currentThemeConfig.textColor }}
                                                    />
                                                    <span 
                                                        className="text-sm font-medium tracking-tight"
                                                        style={{ color: currentThemeConfig.textColor }}
                                                    >
                                                        {item.label}
                                                    </span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                })}
                                
                                {/* Theme Color Picker */}
                                <SidebarMenuItem>
                                    <Popover open={isColorPickerOpen} onOpenChange={setIsColorPickerOpen}>
                                        <PopoverTrigger asChild>
                                            <SidebarMenuButton 
                                                className="h-10 sidebar-menu-item"
                                                style={{
                                                    border: 'none',
                                                    outline: 'none',
                                                    boxShadow: 'none',
                                                }}
                                            >
                                                <PaletteIcon 
                                                    className="size-5" 
                                                    style={{ color: currentThemeConfig.textColor }}
                                                />
                                                <span 
                                                    className="text-sm font-medium tracking-tight"
                                                    style={{ color: currentThemeConfig.textColor }}
                                                >
                                                    Change Theme
                                                </span>
                                            </SidebarMenuButton>
                                        </PopoverTrigger>
                                        <PopoverContent side="right" className="w-80 p-4" sideOffset={10}>
                                            <div className="space-y-4">
                                                <div>
                                                    <h4 className="font-medium text-sm text-gray-900 mb-3">Choose Your Theme</h4>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        {themeColors.map((theme) => (
                                                            <Button
                                                                key={theme.id}
                                                                variant="outline"
                                                                className={cn(
                                                                    "relative h-12 justify-start p-2 border-2",
                                                                    currentTheme === theme.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                                                                )}
                                                                onClick={() => handleThemeChange(theme.id)}
                                                            >
                                                                <div className="flex items-center gap-3 w-full">
                                                                    <div className={cn(
                                                                        "w-6 h-6 rounded-md border border-gray-200",
                                                                        theme.preview
                                                                    )} />
                                                                    <span className="text-xs font-medium text-gray-700 flex-1 text-left">
                                                                        {theme.name}
                                                                    </span>
                                                                    {currentTheme === theme.id && (
                                                                        <CheckIcon className="w-4 h-4 text-blue-600" />
                                                                    )}
                                                                </div>
                                                            </Button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="pt-2 border-t border-gray-200">
                                                    <p className="text-xs text-gray-500">
                                                        Theme preferences are saved automatically
                                                    </p>
                                                </div>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter>
                    <DashboardUserButton />
                </SidebarFooter>
            </Sidebar>
        </div>
    )
}