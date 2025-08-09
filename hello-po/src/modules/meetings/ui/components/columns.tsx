"use client"

import { ColumnDef } from "@tanstack/react-table"
import { GeneratedAvatar } from "@/components/generated-avatar"
import { CornerRightDownIcon, VideoIcon, MoreVerticalIcon, PencilIcon, TrashIcon } from "lucide-react"
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
        largest: 1,
        round: true,
        units: ["h", "m", "s"],
    });
};

const statusIconMap = {
    upcoming: ClockArrowUpIcon,
    active: LoaderIcon,
    completed: CircleCheckIcon,
    processing: LoaderIcon,
    cancelled: CircleXIcon,
};

const statusColorMap = {
    upcoming: "bg-yellow-500/20 text-yellow-800 border-yellow-800/5",
    active: "bg-blue-500/20 text-blue-800 border-blue-800/5",
    completed: "bg-emerald-500/20 text-emerald-800 border-emerald-800/5",
    cancelled: "bg-rose-500/20 text-rose-800 border-rose-800/5",
    processing: "bg-gray-300/20 text-gray-800 border-gray-800/5"
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
                        onClick={(e) => e.stopPropagation()} // Prevent row click
                    >
                        <MoreVerticalIcon className="size-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleEdit}>
                        <PencilIcon className="size-4 text-black" />
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDelete}>
                        <TrashIcon className="size-4 text-black" />
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
        header: "Meeting Name",
        cell: ({ row }) => (
            <div className="flex flex-col gap-y-1">
                <span className="font-semibold capitalize">{row.original.name}</span>
                <div className="flex items-center gap-x-2">
                    <div className="size-3 text-muted-foreground">
                        <CornerRightDownIcon className="size-3 text-muted-foreground" />
                        <button 
                            className="text-sm text-muted-foreground max-w-[200px] truncate capitalize hover:text-blue-600 hover:underline cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent row click
                                window.location.href = `/meetings/${row.original.id}`;
                            }}
                        >
                            {row.original.agents.name}
                        </button>
                    </div>
                </div>
                <GeneratedAvatar variant="botttsNeutral" seed={row.original.agents.name} className="size-4" />
                <span className="text-sm text-muted-foreground">
                    {row.original.startedAt ? format(row.original.startedAt, "MMM d") : ""}
                </span>
            </div>
        )
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const Icon = statusIconMap[row.original.status as keyof typeof statusIconMap];

            return (
                <Badge variant="outline" className={cn("capitalize [&>svg]:size-4 text-muted-foreground flex items-center gap-x-2", statusColorMap[row.original.status as keyof typeof statusColorMap])}>
                    <Icon className={cn("size-4", row.original.status === "processing" && "animate-spin")} />
                    {row.original.status}
                </Badge>
            )
        },
    },
    {
        accessorKey: "duration",
        header: "Duration",
        cell: ({ row }) => (
           <Badge variant="outline" className="capitalize [&>svg]:size-4 flex items-center gap-x-2">
                <ClockFadingIcon className="text-blue-700"/>{row.original.duration ? formatDuration(row.original.duration) : "No duration"}
           </Badge>
        )
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <ActionsCell meeting={row.original} />
    }
]