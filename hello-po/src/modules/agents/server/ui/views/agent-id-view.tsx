"use client";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { AgentIdViewHeader } from "../components/agent-id-view-header";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Badge } from "@/components/ui/badge";
import { VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useConfirm } from "@/modules/agents/hooks/use-confirm";
import { useState } from "react";
import { UpdateAgentDialog } from "../components/update-agent-dialog";

interface Props {
    agentId: string;
};

export const AgentIdView = ({ agentId }: Props) => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const trpc = useTRPC();

    const [updateAgentDialogOpen, SetUpdateAgenDialogOpen] = useState(false);

    const { data } = useSuspenseQuery(trpc.agents.getOne.queryOptions({ id: agentId }));

    const removeAgent = useMutation(
        trpc.agents.remove.mutationOptions({
            onMutate: async () => {
                console.log('🗑️ Starting agent deletion for ID:', agentId);
                
                // Cancel any outgoing refetches
                await queryClient.cancelQueries({ 
                    queryKey: [['agents', 'getMany']]
                });

                // Snapshot all agent queries
                const previousQueriesData: Array<[unknown[], any]> = [];
                
                const queryCache = queryClient.getQueryCache();
                const queries = queryCache.findAll({ 
                    queryKey: [['agents', 'getMany']]
                });

                console.log('🗑️ Found queries to update:', queries.length);

                queries.forEach((query) => {
                    const data = query.state.data;
                    if (data) {
                        console.log('🗑️ Updating query:', query.queryKey, 'Current items:', (data as any).items?.length);
                        previousQueriesData.push([[...query.queryKey], data]);
                        
                        // Optimistically remove the agent from this query
                        queryClient.setQueryData(query.queryKey, (old: any) => {
                            if (!old) return old;
                            
                            const filteredItems = old.items.filter((agent: any) => agent.id !== agentId);
                            console.log('🗑️ Filtered items count:', filteredItems.length, 'vs original:', old.items.length);
                            
                            return {
                                ...old,
                                items: filteredItems,
                                total: old.total - 1,
                                totalPages: Math.ceil(Math.max(old.total - 1, 0) / 5),
                            };
                        });
                    }
                });

                // Navigate immediately
                console.log('🗑️ Navigating to /agents');
                router.push("/agents");

                return { previousQueriesData };
            },
            onError: (err, variables, context) => {
                console.log('🗑️ Delete failed:', err.message);
                // Roll back on error
                context?.previousQueriesData.forEach(([queryKey, data]) => {
                    queryClient.setQueryData(queryKey, data);
                });
                toast.error(err.message);
            },
            onSuccess: async () => {
                console.log('🗑️ Agent deleted successfully from server');
                // Invalidate all agent queries to get the real data
                queryClient.invalidateQueries({
                    queryKey: [['agents', 'getMany']]
                });
                
                queryClient.invalidateQueries({
                    predicate: (query) => {
                        return Array.isArray(query.queryKey[0]) && query.queryKey[0][0] === 'agents';
                    },
                });

                toast.success("Agent deleted successfully!");
            },
        })
    );

    const [RemoveConfirmation, confirmRemove] = useConfirm(
        "Are you sure?",
        `The following action will remove ${data.meetingCount} associated meetings`,
    )

    const handleRemoveAgent = async () => {
        console.log('🗑️ Delete button clicked for agent:', agentId);
        const ok = await confirmRemove();
        console.log('🗑️ User confirmation result:', ok);
        if (ok) {
            console.log('🗑️ Proceeding with deletion');
            await removeAgent.mutateAsync({ id: agentId });
        } else {
            console.log('🗑️ User cancelled deletion');
        }
    }

    return (
        <>
            <RemoveConfirmation />
            <UpdateAgentDialog open={updateAgentDialogOpen} onOpenChange={SetUpdateAgenDialogOpen} initialValues={data}/>
            <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
                <AgentIdViewHeader agentId={agentId} agentName={data.name} onEdit={() => SetUpdateAgenDialogOpen(true)} onRemove={handleRemoveAgent} />
                <div className="bg-white rounded-lg border">
                    <div className="px-4 py-5 gap-y-5 flex flex-col col-span-5">
                        <div className="flex items-center gap-x-3">
                            <GeneratedAvatar variant="botttsNeutral" seed={data.name} className="size-10" />
                            <h2 className="text-2xl font-medium ">
                                {data.name}
                            </h2>
                        </div>
                        <Badge variant="outline" className="flex items-center gap-x-2 [&svg]:size-4">
                            <VideoIcon className="text-blue-700" />
                            {data.meetingCount} {data.meetingCount === 1 ? "meeting" : "meetings"}
                        </Badge>
                        <div className="flex flex-col gap-y-4 ">
                            <p className="text-lg font-medium">
                                Instructions
                            </p>
                            <p className="text-neutral-800">
                                {data.instructions}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export const AgentsIdViewLoading = () => {
    return (
        <LoadingState title="Loading Agents" description="This may take a few seconds" />
    );
}

export const AgentsIdViewError = () => {
    return (
        <ErrorState title="Error Loading Agents" description="Something went wrong" />
    );
}