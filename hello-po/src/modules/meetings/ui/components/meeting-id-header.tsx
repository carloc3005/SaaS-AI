"use client";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChevronRightIcon, TrashIcon, PencilIcon, MoreVerticalIcon, Lock, Copy } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuItem,
    DropdownMenuContent,
} from "@/components/ui/dropdown-menu";

interface Props {
    meetingId: string;
    meetingName: string;
    isPrivate: boolean;
    pin?: string | null;
    onEdit: () => void;
    onRemove: () => void;
}

export const MeetingIdViewHeader = ({
    meetingId,
    meetingName,
    isPrivate,
    pin,
    onEdit,
    onRemove,
}: Props) => {
    const [isClient, setIsClient] = useState(false);
    
    useEffect(() => {
        setIsClient(true);
    }, []);
    
    const copyPin = () => {
        if (pin && isClient && typeof navigator !== 'undefined') {
            navigator.clipboard.writeText(pin);
            toast.success("PIN copied to clipboard!");
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild className="font-medium text-xl">
                                <Link href="/meetings">
                                    My Meetings
                                </Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="text-foreground text-xl font-medium [&svg]:size-4">
                            <ChevronRightIcon />
                        </BreadcrumbSeparator>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild className="font-medium text-xl text-foreground">
                                <Link href={`/meetings/${meetingId}`}>
                                    {meetingName}
                                </Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                {/* Without modal={false}, the dialog that this dropdow opens cause the website to get unclickable */}
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost">
                            <MoreVerticalIcon />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={onEdit}>
                            <PencilIcon className="size-4 text-black"/>
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={onRemove}>
                            <TrashIcon className="size-4 text-black" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            
            {isPrivate && pin && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-x-2">
                            <Lock className="size-5 text-blue-600" />
                            <div>
                                <h3 className="font-medium text-blue-900">Private Meeting</h3>
                                <p className="text-sm text-blue-700">Participants need this PIN to join</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-x-2">
                            <Badge variant="outline" className="bg-white text-blue-900 border-blue-300 font-mono text-lg px-3 py-1">
                                {pin}
                            </Badge>
                            {isClient && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={copyPin}
                                    className="border-blue-300 text-blue-700 hover:bg-blue-100"
                                >
                                    <Copy className="size-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}