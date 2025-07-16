import { useTRPC } from "@/trpc/client";
import { AgentGetOne } from "../../types";
import { useRouter } from "next/router";
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
    const router = useRouter();
    const queryClient = useQueryClient();

    const createAgent = useMutation(
        trpc.agents.create.mutationOptions({
            onSuccess: () => { },
            onError: () => { },
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

    const isPending = createAgent.isPending;

    const onSubmit = (values: z.infer<typeof agentsInsertedSchema>) => {
        if (isEdit) {
            console.log("TODO: updateAgent")
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
                    </FormItem>
                )} />

                <FormField name="instructions" control={form.control} render={({ field }) => (
                    <FormItem>
                        <FormLabel>Instructions</FormLabel>
                        <FormControl>
                            <Textarea {...field} placeholder="You are a helpful math assistant that can answer questions and help with assignments" />
                        </FormControl>
                    </FormItem>
                )} />
            </form>
        </Form>
    )
}