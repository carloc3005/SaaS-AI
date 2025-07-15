"use client";

import { Separator } from "@/components/ui/separator";
import {
    Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader,
    SidebarMenu, SidebarMenuButton, SidebarMenuItem
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { BotIcon, Star, VideoIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
        icon: Star,
        label: "Upgrade",
        href: "/upgrade",
    },

];

export const DashboardSidebar = () => {
    const pathname = usePathname();

    return (
        <Sidebar className="bg-white text-black">
            <SidebarHeader className="text-black">
                <Link href="/" className="flex items-center gap-2 px-2 pt-2">
                    <Image src="/logoipsum-381.svg" height={36} width={36} alt="Logo for Hello Po" />
                    <p className="text-2xl font-semibold text-black">Hello Po</p>
                </Link>
            </SidebarHeader>
            <div className="px-4 py-2">
                <Separator className="opacity-10 bg-black" />
            </div>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {firstSection.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton asChild className={cn("h-10 text-black hover:bg-black/10 border border-transparent",
                                        "hover:border-black/20",
                                        pathname === item.href && "bg-black/10 border-black/20")} isActive={pathname === item.href}>
                                        <Link href={item.href}>
                                            <item.icon className="size-5 text-black" />
                                            <span className="text-sm font-medium tracking-tight text-black">
                                                {item.label}
                                            </span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {secondSection.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton asChild className={cn("h-10 text-black hover:bg-black/10 border border-transparent",
                                        "hover:border-black/20",
                                        pathname === item.href && "bg-black/10 border-black/20")} isActive={pathname === item.href}>
                                        <Link href={item.href}>
                                            <item.icon className="size-5 text-black" />
                                            <span className="text-sm font-medium tracking-tight text-black">
                                                {item.label}
                                            </span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="text-black">
                <DashboardUserButton />
            </SidebarFooter>
        </Sidebar>
    )
}