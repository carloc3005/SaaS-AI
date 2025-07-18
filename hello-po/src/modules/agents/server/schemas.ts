import { z } from "zod";

export const agentsInsertedSchema = z.object({
    name: z.string().min(1, {message: "Name is required"}),
    instructions: z.string().min(1, {message: "Instruction are required"}),
})

export const agentsUpdateSchema = agentsInsertedSchema.extend({
    id: z.string().min(1, { message: "Id is required"})
});