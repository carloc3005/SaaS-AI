import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { privateMeetingsInsertedSchema } from "../views/schemas";
import { CommandSelect } from "@/components/command-select";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { NewAgentDialog } from "@/modules/agents/server/ui/components/new-agent-dialog";
import { useState } from "react";
import { Lock } from "lucide-react";

interface PrivateMeetingFormProps {
    onSuccess?: (meetingData: any) => void;
    onCancel?: () => void;
}

export const PrivateMeetingForm = ({
    onSuccess,
    onCancel,
}: PrivateMeetingFormProps) => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const [openNewAgentDialog, setOpenNewAgentDialog] = useState(false);

    const createPrivateMeeting = useMutation(
        trpc.meetings.create.mutationOptions({
            onSuccess: (data) => {
                // Invalidate all meetings queries
                queryClient.invalidateQueries({
                    queryKey: ['meetings'],
                });

                toast.success("Private meeting created successfully!");
                
                // Show PIN for private meetings
                if (data.isPrivate && data.pin) {
                    toast.success(`Meeting PIN: ${data.pin}`, {
                        description: "Save this PIN - participants will need it to join the meeting.",
                        duration: 10000,
                    });
                }
                
                onSuccess?.(data);
            },
            onError: (error) => {
                toast.error(error.message);
            },
        })
    );

    const form = useForm<z.infer<typeof privateMeetingsInsertedSchema>>({
        resolver: zodResolver(privateMeetingsInsertedSchema),
        defaultValues: {
            name: "",
            agentId: "",
            isPrivate: true,
        },
    });

    const isPending = createPrivateMeeting.isPending;

    const onSubmit = (values: z.infer<typeof privateMeetingsInsertedSchema>) => {
        console.log("Private meeting form submission values:", values);
        createPrivateMeeting.mutate(values);
    };

    return (
        <>
            <NewAgentDialog 
                open={openNewAgentDialog} 
                onOpenChange={(open) => {
                    setOpenNewAgentDialog(open);
                }} 
            />
            <Form {...form}>
                <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                    
                    <FormField name="name" control={form.control} render={({ field }) => (
                        <FormItem>
                            <FormLabel>Private Meeting Name</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="e.g. Confidential Team Discussion" />
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
                                    placeholder="Select an agent for this private meeting"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    {/* Private Meeting Info */}
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <div className="flex items-center gap-x-2 mb-2">
                            <Lock className="size-4 text-purple-600" />
                            <span className="font-medium text-purple-900">Private Meeting</span>
                        </div>
                        <p className="text-sm text-purple-700">
                            This meeting will be secured with a 4-digit PIN. Only invited participants with the PIN can join.
                        </p>
                    </div>

                    <div className="flex justify-end gap-x-2 pt-4">
                        {onCancel && (
                            <Button variant="ghost" disabled={isPending} type="button" onClick={() => onCancel()}>
                                Cancel
                            </Button>
                        )}
                        <Button 
                            disabled={isPending} 
                            type="submit"
                            className="bg-purple-600 hover:bg-purple-700"
                        >
                            <Lock className="h-4 w-4 mr-2" />
                            {isPending ? "Creating..." : "Create Private Meeting"}
                        </Button>
                    </div>
                </form>
            </Form>
        </>
    )
}
