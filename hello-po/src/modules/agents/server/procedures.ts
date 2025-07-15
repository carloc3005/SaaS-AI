import { agents } from "@/db/schema";
import { db } from "@/db";
import { createTRPCRouter, baseProcedure, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { agentsInsertedSchema } from "./schemas";

export const agentsRouter = createTRPCRouter({
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