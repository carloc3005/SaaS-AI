import { z } from "zod";

export const meetingsInsertedSchema = z.object({
    name: z.string().min(1, {message: "Name is required"}),
    agentId: z.string().min(1, {message: "Agent are required"}),
    isPrivate: z.boolean(),
})

export const meetingsUpdateSchema = meetingsInsertedSchema.extend({
    id: z.string().min(1, { message: "Id is required"})
});