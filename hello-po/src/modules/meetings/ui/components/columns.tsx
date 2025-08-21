"use client"

import { ColumnDef } from "@tanstack/react-table"
import { GeneratedAvatar } from "@/components/generated-avatar"
import { CornerRightDownIcon, VideoIcon, MoreVerticalIcon, PencilIcon, TrashIcon, Lock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import humanizeDuration from "humanize-duration"
import { CircleCheckIcon, CircleXIcon, ClockArrowUpIcon, ClockFadingIcon, CornerDownRightIcon, LoaderIcon } from "lucide-react"
import { MeetingsGetMany } from "../views/types"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuItem,
    DropdownMenuContent,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { UpdateMeetingDialog } from "./update-meeting-dialog"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTRPC } from "@/trpc/client"
import { useConfirm } from "@/modules/agents/hooks/use-confirm"
import { toast } from "sonner"

function formatDuration(seconds: number) {
    return humanizeDuration(seconds * 1000, {
        largest: 2,
        round: true,
        units: ["h", "m", "s"],
        delimiter: " ",
        spacer: "",
    });
};

function getDurationCategory(seconds: number): keyof typeof durationColorMap {
    if (seconds < 60) return "short"; // Less than 1 minute
    if (seconds < 1800) return "medium"; // Less than 30 minutes
    return "long"; // 30+ minutes
};

const statusIconMap = {
    upcoming: ClockArrowUpIcon,
    active: LoaderIcon,
    completed: CircleCheckIcon,
    processing: LoaderIcon,
    cancelled: CircleXIcon,
};

const statusColorMap = {
    upcoming: "bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border-amber-200/50 shadow-sm",
    active: "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200/50 shadow-sm",
    completed: "bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border-emerald-200/50 shadow-sm",
    cancelled: "bg-gradient-to-r from-rose-50 to-red-50 text-rose-700 border-rose-200/50 shadow-sm",
    processing: "bg-gradient-to-r from-slate-50 to-gray-50 text-slate-700 border-slate-200/50 shadow-sm"
}

const durationColorMap = {
    short: "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200/50",
    medium: "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200/50",
    long: "bg-gradient-to-r from-purple-50 to-violet-50 text-purple-700 border-purple-200/50"
}

type Meeting = MeetingsGetMany[number];

// Actions Cell Component
const ActionsCell = ({ meeting }: { meeting: Meeting }) => {
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const router = useRouter();

    const [RemoveConfirmation, confirmRemove] = useConfirm(
        "Are you sure?",
        "The following action will remove this meeting"
    );

    const removeMeeting = useMutation(
        trpc.meetings.remove.mutationOptions({
            onSuccess: () => {
                queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));
                toast.success("Meeting deleted successfully");
            },
            onError: (error) => {
                toast.error(error.message);
            }
        })
    );

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent row click
        setUpdateDialogOpen(true);
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent row click
        const ok = await confirmRemove();
        if (!ok) return;
        await removeMeeting.mutateAsync({ id: meeting.id });
    };

    return (
        <>
            <RemoveConfirmation />
            <UpdateMeetingDialog 
                open={updateDialogOpen} 
                onOpenChange={setUpdateDialogOpen} 
                initialValues={{
                    ...meeting,
                    agent: meeting.agents // Map agents to agent for UpdateMeetingDialog
                }}
            />
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-slate-100 transition-colors duration-200"
                        onClick={(e) => e.stopPropagation()} // Prevent row click
                    >
                        <MoreVerticalIcon className="size-4" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem 
                        onClick={handleEdit}
                        className="cursor-pointer hover:bg-blue-50 transition-colors duration-150"
                    >
                        <PencilIcon className="size-4 mr-2 text-blue-600" />
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                        onClick={handleDelete}
                        className="cursor-pointer hover:bg-red-50 transition-colors duration-150 text-red-600"
                    >
                        <TrashIcon className="size-4 mr-2" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};

export const columns: ColumnDef<MeetingsGetMany[number]>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => (
            <div className="font-semibold text-slate-700">Meeting Details</div>
        ),
        cell: ({ row }) => (
            <div className="flex items-center gap-x-4 py-2">
                <div className="relative">
                    <GeneratedAvatar 
                        variant="botttsNeutral" 
                        seed={row.original.agents.name} 
                        className="size-12 border-2 border-white shadow-md ring-1 ring-slate-200/50" 
                    />
                    <div className="absolute -bottom-1 -right-1 size-4 bg-emerald-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex flex-col space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-x-2">
                        <h3 className="font-semibold text-slate-900 text-base truncate">
                            {row.original.name}
                        </h3>
                        {row.original.isPrivate && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-2 py-0.5">
                                <Lock className="size-3 mr-1" />
                                Private
                            </Badge>
                        )}
                    </div>
                    <div className="flex items-center gap-x-2">
                        <div className="size-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-slate-600 font-medium capitalize truncate">
                            {row.original.agents.name}
                        </span>
                    </div>
                    {row.original.startedAt && (
                        <div className="flex items-center gap-x-2">
                            <div className="size-2 bg-slate-300 rounded-full"></div>
                            <span className="text-xs text-slate-500 font-medium">
                                {format(row.original.startedAt, "MMM d, yyyy 'at' h:mm a")}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        )
    },
    {
        accessorKey: "status",
        header: ({ column }) => (
            <div className="font-semibold text-slate-700">Status</div>
        ),
        cell: ({ row }) => {
            const Icon = statusIconMap[row.original.status as keyof typeof statusIconMap];

            return (
                <div className="flex justify-start">
                    <Badge 
                        variant="outline" 
                        className={cn(
                            "capitalize font-medium px-3 py-1.5 flex items-center gap-x-2 transition-all duration-200 hover:scale-105", 
                            statusColorMap[row.original.status as keyof typeof statusColorMap]
                        )}
                    >
                        <Icon className={cn("size-4", row.original.status === "processing" && "animate-spin")} />
                        {row.original.status}
                    </Badge>
                </div>
            )
        },
    },
    {
        accessorKey: "duration",
        header: ({ column }) => (
            <div className="font-semibold text-slate-700">Duration</div>
        ),
        cell: ({ row }) => {
            const duration = row.original.duration;
            const durationCategory = duration ? getDurationCategory(duration) : "short";
            
            return (
                <div className="flex justify-start">
                    <Badge 
                        variant="outline" 
                        className={cn(
                            "font-medium px-3 py-1.5 flex items-center gap-x-2 transition-all duration-200 hover:scale-105",
                            duration ? durationColorMap[durationCategory] : "bg-slate-50 text-slate-500 border-slate-200"
                        )}
                    >
                        <ClockFadingIcon className="size-4" />
                        {duration ? formatDuration(duration) : "No duration"}
                    </Badge>
                </div>
            )
        }
    },
    {
        id: "actions",
        header: ({ column }) => (
            <div className="font-semibold text-slate-700 text-center">Actions</div>
        ),
        cell: ({ row }) => (
            <div className="flex justify-center">
                <ActionsCell meeting={row.original} />
            </div>
        )
    }
]