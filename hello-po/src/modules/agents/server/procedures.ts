import { agents } from "@/db/schema";
import { db } from "@/db";
import { createTRPCRouter, baseProcedure, protectedProcedure } from "@/trpc/init";
import { agentsInsertedSchema } from "./schemas";
import { eq, getTableColumns, sql } from "drizzle-orm";
import { z } from "zod";

export const agentsRouter = createTRPCRouter({
    // TODO: change 'getMany' to use protectedProcedure 

    getOne: protectedProcedure.input(z.object({id: z.string() })).query(async ({ input }) => {
        const [existingAgent] = await db
            .select({
                // TODO: Change to actual count
                ...getTableColumns(agents),
                meetingCount: sql<number>`5`,
            })
            .from(agents)
            .where(eq(agents.id, input.id))

        return existingAgent;
    }),

    // TODO: change 'getMany' to use protectedProcedure 

    getMany: protectedProcedure.query(async () => {
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