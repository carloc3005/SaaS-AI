import { useTRPC } from "@/trpc/client";
import { AgentGetOne } from "../../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { agentsInsertedSchema } from "../../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { GeneratedAvatar } from "@/components/generated-avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAgentsFilter } from "@/modules/agents/hooks/use-agents-filters";
import { DEFAULT_PAGE } from "@/constants";

interface AgentFormProps {
    onSucess?: () => void;
    onCancel?: () => void;
    initialValues?: AgentGetOne;
}

export const AgentForm = ({
    onSucess,
    onCancel,
    initialValues,
}: AgentFormProps) => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const [filters, setFilters] = useAgentsFilter();

    const createAgent = useMutation(
        trpc.agents.create.mutationOptions({
            onMutate: async (newAgent) => {
                // Debug: Log current filters and query structure
                console.log('Creating agent - Current filters:', filters);
                const currentQueryKey = trpc.agents.getMany.queryOptions({
                    ...filters,
                    pageSize: 5, 
                }).queryKey;
                console.log('Current view query key:', currentQueryKey);

                // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
                await queryClient.cancelQueries({ 
                    queryKey: [['agents', 'getMany']]
                });

                // Get the query key that we'll be updating (first page)
                const firstPageQueryKey = trpc.agents.getMany.queryOptions({
                    ...filters, 
                    page: DEFAULT_PAGE,
                    pageSize: 5 
                }).queryKey;

                console.log('First page query key:', firstPageQueryKey);

                // Snapshot the previous value
                const previousAgents = queryClient.getQueryData(firstPageQueryKey);
                console.log('Previous data for first page:', previousAgents);

                // Optimistically update to the new value
                queryClient.setQueryData(firstPageQueryKey, (old: any) => {
                    console.log('Optimistically updating with old data:', old);
                    if (!old) return old;
                    
                    // Create a temporary agent object with optimistic data
                    const optimisticAgent = {
                        id: `temp-${Date.now()}`,
                        name: newAgent.name,
                        instructions: newAgent.instructions,
                        userId: 'current-user',
                        meetingCount: 0,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    };

                    const newData = {
                        ...old,
                        items: [optimisticAgent, ...old.items.slice(0, 4)], // Keep only 5 total items
                        total: old.total + 1,
                        totalPages: Math.ceil((old.total + 1) / 5),
                    };
                    
                    console.log('New optimistic data:', newData);
                    return newData;
                });

                // Navigate to first page to show the new agent
                if (filters.page !== DEFAULT_PAGE) {
                    console.log('Navigating to first page');
                    setFilters({ page: DEFAULT_PAGE });
                }

                // Return a context object with the snapshotted value
                return { previousAgents };
            },
            onError: (err, newAgent, context) => {
                // If the mutation fails, use the context returned from onMutate to roll back
                const firstPageQueryKey = trpc.agents.getMany.queryOptions({
                    ...filters, 
                    page: DEFAULT_PAGE,
                    pageSize: 5 
                }).queryKey;
                queryClient.setQueryData(firstPageQueryKey, context?.previousAgents);
                toast.error(err.message);
            },
            onSuccess: () => {
                console.log('🐛 Agent created successfully, invalidating queries');
                // Invalidate and refetch all agent queries to get the real data
                queryClient.invalidateQueries({
                    queryKey: [['agents', 'getMany']]
                });

                // Also invalidate any general agents queries
                queryClient.invalidateQueries({
                    predicate: (query) => {
                        return Array.isArray(query.queryKey[0]) && query.queryKey[0][0] === 'agents';
                    },
                });

                if (initialValues?.id) {
                    queryClient.invalidateQueries(
                        trpc.agents.getOne.queryOptions({ id: initialValues.id }),
                    )
                }

                toast.success("Agent created successfully!");
                onSucess?.();
            },
        })
    );

    const updateAgent = useMutation(
        trpc.agents.update.mutationOptions({
            onMutate: async (updatedAgent) => {
                // Cancel any outgoing refetches
                await queryClient.cancelQueries({ 
                    queryKey: [['agents', 'getMany']]
                });

                // Snapshot the previous values
                const previousQueriesData: Array<[unknown[], any]> = [];

                // Get all matching agent queries and update them
                const queryCache = queryClient.getQueryCache();
                const queries = queryCache.findAll({ 
                    queryKey: [['agents', 'getMany']]
                });

                queries.forEach((query) => {
                    const data = query.state.data;
                    if (data) {
                        previousQueriesData.push([[...query.queryKey], data]);
                        
                        // Update this specific query
                        queryClient.setQueryData(query.queryKey, (old: any) => {
                            if (!old) return old;
                            
                            return {
                                ...old,
                                items: old.items.map((agent: any) =>
                                    agent.id === initialValues?.id
                                        ? { ...agent, name: updatedAgent.name, instructions: updatedAgent.instructions }
                                        : agent
                                ),
                            };
                        });
                    }
                });

                // Also update the getOne query if it exists
                let previousAgentOne = null;
                if (initialValues?.id) {
                    const agentOneQueryKey = [['agents', 'getOne'], { id: initialValues.id }];
                    previousAgentOne = queryClient.getQueryData(agentOneQueryKey);
                    queryClient.setQueryData(agentOneQueryKey, (old: any) => 
                        old ? { ...old, name: updatedAgent.name, instructions: updatedAgent.instructions } : old
                    );
                }

                return { previousQueriesData, previousAgentOne };
            },
            onError: (err, updatedAgent, context) => {
                // Roll back on error
                context?.previousQueriesData.forEach(([queryKey, data]) => {
                    queryClient.setQueryData(queryKey, data);
                });
                
                if (initialValues?.id && context?.previousAgentOne) {
                    const agentOneQueryKey = [['agents', 'getOne'], { id: initialValues.id }];
                    queryClient.setQueryData(agentOneQueryKey, context.previousAgentOne);
                }
                toast.error(err.message);
            },
            onSuccess: () => {
                // Invalidate all agent queries to get the real data
                queryClient.invalidateQueries({
                    queryKey: [['agents', 'getMany']]
                });
                
                queryClient.invalidateQueries({
                    predicate: (query) => {
                        return Array.isArray(query.queryKey[0]) && query.queryKey[0][0] === 'agents';
                    },
                });

                toast.success("Agent updated successfully!");
                onSucess?.();
            },
        })
    );

    const form = useForm<z.infer<typeof agentsInsertedSchema>>({
        resolver: zodResolver(agentsInsertedSchema),
        defaultValues: {
            name: initialValues?.name ?? "",
            instructions: initialValues?.instructions ?? "",
        },
    });

    const isEdit = !!initialValues?.id;

    const isPending = createAgent.isPending || updateAgent.isPending;

    const onSubmit = (values: z.infer<typeof agentsInsertedSchema>) => {
        if (isEdit) {
            updateAgent.mutate({ id: initialValues.id, ...values });
        } else {
            createAgent.mutate(values);
        }
    };

    return (
        <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                <GeneratedAvatar seed={form.watch("name")} variant="botttsNeutral" className="border size-16" />
                <FormField name="name" control={form.control} render={({ field }) => (
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="e.g. Math Tutor" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                <FormField name="instructions" control={form.control} render={({ field }) => (
                    <FormItem>
                        <FormLabel>Instructions</FormLabel>
                        <FormControl>
                            <Textarea {...field} placeholder="You are a helpful math assistant that can answer questions and help with assignments" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <div className="flex justify-end gap-x-2 pt-4">
                    {onCancel && (
                        <Button variant="ghost" disabled={isPending} type="button" onClick={() => onCancel()}>
                            Cancel
                        </Button>
                    )}
                    <Button disabled={isPending} type="submit">
                        {isPending ? "Saving..." : isEdit ? "Update" : "Create"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}