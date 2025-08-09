"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon, ClockIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { MeetingStatus } from "@/modules/meetings/ui/views/types";

interface Props {
    agentId: string;
}

const getStatusColor = (status: string) => {
    switch (status) {
        case MeetingStatus.Active:
            return "bg-green-500";
        case MeetingStatus.Completed:
            return "bg-blue-500";
        case MeetingStatus.Processing:
            return "bg-yellow-500";
        case MeetingStatus.Cancelled:
            return "bg-red-500";
        case MeetingStatus.Upcoming:
        default:
            return "bg-gray-500";
    }
};

export const AgentMeetingsList = ({ agentId }: Props) => {
    const trpc = useTRPC();
    const router = useRouter();
    
    const { data } = useSuspenseQuery(trpc.meetings.getMany.queryOptions({
        agentId,
        pageSize: 5, // Show only 5 most recent meetings
        page: 1
    }));

    if (data.items.length === 0) {
        return (
            <div className="text-center py-4 text-muted-foreground">
                No meetings scheduled yet
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {data.items.map((meeting) => (
                <Card 
                    key={meeting.id} 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => router.push(`/meetings/${meeting.id}`)}
                >
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <h4 className="font-medium text-sm">{meeting.name}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <CalendarIcon className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground">
                                        {format(new Date(meeting.createdAt), "MMM d, yyyy")}
                                    </span>
                                    {meeting.duration && (
                                        <>
                                            <ClockIcon className="h-3 w-3 text-muted-foreground ml-2" />
                                            <span className="text-xs text-muted-foreground">
                                                {Math.floor(meeting.duration / 60)}m
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <Badge 
                                variant="outline" 
                                className={`${getStatusColor(meeting.status)} text-white text-xs`}
                            >
                                {meeting.status}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};
