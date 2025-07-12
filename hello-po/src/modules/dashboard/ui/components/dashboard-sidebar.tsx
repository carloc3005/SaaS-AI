"use client";

import { Separator } from "@/components/ui/separator";
import {
    Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader,
    SidebarMenu, SidebarMenuButton, SidebarMenuItem
} from "@/components/ui/sidebar";
import { BotIcon, Star, VideoIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const firstSection = [
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
    return (
        <Sidebar>
            <SidebarHeader className="text-shadow-sidebar-accent-foreground">
                <Link href="/" className="flex items-center gap-2 px-2 pt-2">
                    <Image src="/logo.svg" height={36} width={36} alt="Logo for Hello Po"/>
                    <p className="text-2xl font-semibold">Hello Po</p>
                </Link>
            </SidebarHeader>
            <div className="px-4 py-2">
                <Separator className="opacity-10 text-[#000000]" />
            </div>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {firstSection.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton>
                                        <Link href={item.href}>
                                            <item.icon className="size-5"/>
                                            <span className="text-sm font-medium tracking-tight">
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
        </Sidebar>
    )
}