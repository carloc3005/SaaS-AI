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

    const createAgent = useMutation(
        trpc.agents.create.mutationOptions({
            onSuccess: () => {
                // Invalidate all agents queries
                queryClient.invalidateQueries({
                    queryKey: ['agents'],
                });


                if (initialValues?.id) {
                    queryClient.invalidateQueries(
                        trpc.agents.getOne.queryOptions({ id: initialValues.id }),
                    )
                }

                toast.success("Agent created successfully!");
                onSucess?.();
            },
            onError: (error) => {
                toast.error(error.message);

                // TODO: Check if error code is "FORBIDDEN", redirect to "/upgrade"
            },
        })
    );

    const updateAgent = useMutation(
        trpc.agents.update.mutationOptions({
            onSuccess: () => {
                // Invalidate all agents queries
                // ✅ CORRECTED THIS LINE
                queryClient.invalidateQueries(
                    trpc.agents.getMany.queryOptions({})
                );


                if (initialValues?.id) {
                    queryClient.invalidateQueries(
                        trpc.agents.getOne.queryOptions({ id: initialValues.id }),
                    )
                }
                onSucess?.();
            },
            onError: (error) => {
                toast.error(error.message);

                // TODO: Check if error code is "FORBIDDEN", redirect to "/upgrade"
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