import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { meetingsInsertedSchema } from "../views/schemas";
import { MeetingGetOne } from "../views/types";
import { CommandSelect } from "@/components/command-select";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { useState } from "react";

// Meeting schemas - using the imported schema
const meetingCreateSchema = meetingsInsertedSchema;

interface MeetingFormProps {
    onSucess?: (id?: string) => void;
    onCancel?: () => void;
    initialValues?: MeetingGetOne;
}

export const MeetingForm = ({
    onSucess,
    onCancel,
    initialValues,
}: MeetingFormProps) => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    // Agent search state
    const [agentSearch, setAgentSearch] = useState("");
    const pageSize = 100;

    // Query to fetch agents with search
    const { data: agentsData } = useQuery(
        trpc.agents.getMany.queryOptions({
            search: agentSearch,
            pageSize: pageSize,
            page: 1,
        })
    );

    const createMeeting = useMutation(
        trpc.meetings.create.mutationOptions({
            onSuccess: (data) => {
                // Invalidate all meetings queries
                queryClient.invalidateQueries({
                    queryKey: ['meetings'],
                });

                if (initialValues?.id) {
                    queryClient.invalidateQueries(
                        trpc.meetings.getOne.queryOptions({ id: initialValues.id }),
                    )
                }

                toast.success("Meeting created successfully!");
                onSucess?.(data.id);
            },
            onError: (error) => {
                toast.error(error.message);
            },
        })
    );

    const updateMeeting = useMutation(
        trpc.meetings.update.mutationOptions({
            onSuccess: () => {
                // Invalidate all meetings queries
                queryClient.invalidateQueries(
                    trpc.meetings.getMany.queryOptions({})
                );

                if (initialValues?.id) {
                    queryClient.invalidateQueries(
                        trpc.meetings.getOne.queryOptions({ id: initialValues.id }),
                    )
                }
                onSucess?.();
            },
            onError: (error) => {
                toast.error(error.message);
            },
        })
    );

    const form = useForm<z.infer<typeof meetingCreateSchema>>({
        resolver: zodResolver(meetingCreateSchema),
        defaultValues: {
            name: initialValues?.name ?? "",
            agentId: initialValues?.agentId ?? "",
        },
    });

    const isEdit = !!initialValues?.id;

    const isPending = createMeeting.isPending || updateMeeting.isPending;

    const onSubmit = (values: z.infer<typeof meetingCreateSchema>) => {
        if (isEdit) {
            updateMeeting.mutate({ id: initialValues.id, ...values });
        } else {
            createMeeting.mutate(values);
        }
    };

    return (
        <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                
                <FormField name="name" control={form.control} render={({ field }) => (
                    <FormItem>
                        <FormLabel>Meeting Name</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="e.g. Weekly Team Meeting" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                <FormField name="agentId" control={form.control} render={({ field }) => (
                    <FormItem>
                        <FormLabel>Agent</FormLabel>
                        <FormControl>
                            <CommandSelect
                                options={
                                    agentsData?.items?.map((agent) => ({
                                        id: agent.id,
                                        value: agent.id,
                                        children: (
                                            <div className="flex items-center gap-x-2">
                                                <GeneratedAvatar variant="botttsNeutral" seed={agent.name} className="size-5" />
                                                <span>{agent.name}</span>
                                            </div>
                                        ),
                                    })) ?? []
                                }
                                onSelect={field.onChange}
                                onSearch={setAgentSearch}
                                value={field.value}
                                placeholder="Select an agent for this meeting"
                            />
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