import { agents } from "@/db/schema";
import { db } from "@/db";
import { createTRPCRouter, baseProcedure, protectedProcedure } from "@/trpc/init";
import { agentsInsertedSchema } from "./schemas";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const agentsRouter = createTRPCRouter({
    // TODO: change 'getMany' to use protectedProcedure 

    getOne: baseProcedure.input(z.object({id: z.string() })).query(async ({ input }) => {
        const [existing] = await db
            .select()
            .from(agents)
            .where(eq(agents.id, input.id))

        return existing;
    }),

    // TODO: change 'getMany' to use protectedProcedure 

    getMany: baseProcedure.query(async () => {
        const data = await db
            .select()
            .from(agents);


        return data;
    }),

    create: protectedProcedure.input(agentsInsertedSchema).mutation(async ({ input, ctx }) => {
        const [createdAgent] = await db
            .insert(agents)
            .values({
                ...input,
                userId: ctx.auth.user.id,
            })
            .returning();

        return createdAgent;
    }),
});