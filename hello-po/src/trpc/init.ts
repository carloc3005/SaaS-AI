import { auth } from '@/lib/auth';
import { initTRPC, TRPCError } from '@trpc/server';
import { headers } from 'next/headers';
import { cache } from 'react';

type TRPCContext = {
  session: Awaited<ReturnType<typeof auth.api.getSession>> | null;
  userId: string | null;
};

export const createTRPCContext = cache(async (): Promise<TRPCContext> => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  try {
    const session = await auth.api.getSession({ 
      headers: await headers(),
    });
    
    return { 
      session,
      userId: session?.user?.id || null 
    };
  } catch (error) {
    // If session retrieval fails, return null session
    console.warn('Failed to get session in TRPC context:', error);
    return { 
      session: null,
      userId: null 
    };
  }
});
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<TRPCContext>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  // transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = baseProcedure.use(async ({ctx, next}) => {
  if (!ctx.session) {
    throw new TRPCError ({ code: "UNAUTHORIZED", message: "Unauthorized" });
  }

  return next ({ ctx: {...ctx, session: ctx.session }});
});