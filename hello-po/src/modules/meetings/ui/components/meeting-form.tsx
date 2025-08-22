import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { meetingsInsertedSchema } from "../views/schemas";
import { MeetingGetOne } from "../views/types";
import { CommandSelect } from "@/components/command-select";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { NewAgentDialog } from "@/modules/agents/server/ui/components/new-agent-dialog";
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
    const [openNewAgentDialog, setOpenNewAgentDialog] = useState(false);

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
            onSuccess: (data) => {
                // Invalidate all meetings queries
                queryClient.invalidateQueries(
                    trpc.meetings.getMany.queryOptions({})
                );

                if (initialValues?.id) {
                    queryClient.invalidateQueries(
                        trpc.meetings.getOne.queryOptions({ id: initialValues.id }),
                    )
                }
                onSucess?.(data.id);
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
        console.log("Form submission values:", values); // Debug log
        if (isEdit) {
            updateMeeting.mutate({ id: initialValues.id, ...values });
        } else {
            createMeeting.mutate({ ...values, isPrivate: false });
        }
    };

    return (
        <>
            <NewAgentDialog 
                open={openNewAgentDialog} 
                onOpenChange={(open) => {
                    setOpenNewAgentDialog(open);
                    // When dialog closes after successful creation, 
                    // the query will be invalidated and agents list will refresh
                }} 
            />
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
                                    queryOptions={(search) => 
                                        trpc.agents.getMany.queryOptions({
                                            search: search,
                                            pageSize: 100,
                                            page: 1,
                                        })
                                    }
                                    mapResults={(data) => {
                                        const agentOptions = data?.items?.map((agent: any) => ({
                                            id: agent.id,
                                            value: agent.id,
                                            children: (
                                                <div className="flex items-center gap-x-2">
                                                    <GeneratedAvatar variant="botttsNeutral" seed={agent.name} className="size-5" />
                                                    <span>{agent.name}</span>
                                                </div>
                                            ),
                                        })) ?? [];
                                        
                                        // Always add "Create New Agent" option at the end
                                        return [
                                            ...agentOptions,
                                            {
                                                id: 'create-new',
                                                value: 'create-new',
                                                children: (
                                                    <div className="flex items-center gap-x-2 text-primary border-t pt-2 mt-2">
                                                        <span className="text-lg">+</span>
                                                        <span>Create New Agent</span>
                                                    </div>
                                                ),
                                            }
                                        ];
                                    }}
                                    onSelect={(value) => {
                                        if (value === 'create-new') {
                                            setOpenNewAgentDialog(true);
                                        } else {
                                            field.onChange(value);
                                        }
                                    }}
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
        </>
    )
}