import { agents, meetings } from "@/db/schema";
import { db } from "@/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, count, desc, eq, getTableColumns, ilike, sql } from "drizzle-orm";
import { z } from "zod";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";
import { TRPCError } from "@trpc/server";
import { MeetingStatus } from "../ui/views/types";
import { streamVideo } from "@/lib/stream-video";
import { generatedAvatarURI } from "@/lib/avatar";

// Meeting schemas
const meetingCreateSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    agentId: z.string().min(1, { message: "Agent ID is required" }),
});

const meetingUpdateSchema = z.object({
    id: z.string().min(1, { message: "ID is required" }),
    name: z.string().min(1, { message: "Name is required" }).optional(),
    status: z.enum(["upcoming", "active", "completed", "processing", "cancelled"]).optional(),
    summary: z.string().optional(),
});

export const meetingsRouter = createTRPCRouter({
    generateToken: protectedProcedure.mutation(async ({ ctx }) => {
        await streamVideo.upsertUsers([{
            id: ctx.auth.user.id,
            name: ctx.auth.user.name,
            role: "admin",
            image: 
                ctx.auth.user.image ?? 
                generatedAvatarURI({ seed: ctx.auth.user.name, variant: "initials" })
        },
    ]);

        const expirationTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour 
        const issueAt =  Math.floor(Date.now() / 1000 ) - 60;

        const token = streamVideo.generateUserToken({
            user_id: ctx.auth.user.id,
            exp: expirationTime,
            validity_in_seconds: issueAt,
        });

        return token;

    }),
    create: protectedProcedure
        .input(meetingCreateSchema)
        .mutation(async ({ input, ctx }) => {
            const [createdMeeting] = await db
                .insert(meetings)
                .values({
                    ...input,
                    userId: ctx.auth.user.id,
                })
                .returning();
            
            const call = streamVideo.video.call("default", createdMeeting.id);
            await call.create({
                data: {
                    created_by_id: ctx.auth.user.id,
                    custom: {
                        meetingId: createdMeeting.id,
                        meetingName: createdMeeting.name
                    },
                    settings_override: {
                        transcription: {
                            language: "en",
                            mode: "auto-on",
                            closed_caption_mode: "auto-on",
                        },
                        recording: {
                            mode: "auto-on",
                            quality: "1080p",
                        },
                    },
                }
            });

            const [existingAgent] = await db 
                .select()
                .from(agents)
                .where(eq(agents.id, createdMeeting.agentId));

            if (!existingAgent) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Agent not found",
                });
            }

            await streamVideo.upsertUsers([
                {
                    id: existingAgent.id,
                    name: existingAgent.name,
                    role: "user",
                    image: generatedAvatarURI({
                        seed: existingAgent.name,
                        variant: "botttsNeutral",
                    }),
                },
            ]);

            return createdMeeting;
        }),

    getMany: protectedProcedure
        .input(z.object({
            page: z.number().default(DEFAULT_PAGE),
            pageSize: z
                .number()
                .min(MIN_PAGE_SIZE)
                .max(MAX_PAGE_SIZE)
                .default(DEFAULT_PAGE_SIZE),
            search: z.string().nullish(),
            agentId: z.string().optional(),
            status: z 
                .enum([
                    MeetingStatus.Upcoming,
                    MeetingStatus.Active,
                    MeetingStatus.Cancelled,
                    MeetingStatus.Processing,
                    MeetingStatus.Completed,
                ])
                .nullish(),
        }))
        .query(async ({ input, ctx }) => {
            const { search, page, pageSize, agentId, status } = input;

            const data = await db
                .select({
                    ...getTableColumns(meetings),
                    agents: agents,
                    duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as("duration"),
                })
                .from(meetings)
                .innerJoin(agents, eq(meetings.agentId, agents.id))
                .where(
                    and(
                        eq(meetings.userId, ctx.auth.user.id),
                        agentId ? eq(meetings.agentId, agentId) : undefined,
                        search ? ilike(meetings.name, `%${search}%`) : undefined,
                        status ? eq(meetings.status, status) : undefined,
                    )
                )
                .orderBy(desc(meetings.createdAt), desc(meetings.id))
                .limit(pageSize)
                .offset((page - 1) * pageSize);

            const total = await db
                .select({ count: count() })
                .from(meetings)
                .innerJoin(agents, eq(meetings.agentId, agents.id))
                .where(
                    and(
                        eq(meetings.userId, ctx.auth.user.id),
                        agentId ? eq(meetings.agentId, agentId) : undefined,
                        search ? ilike(meetings.name, `%${search}%`) : undefined,
                        status ? eq(meetings.status, status) : undefined,
                    )
                );

            const totalPages = Math.ceil(total[0].count / pageSize);

            return {
                items: data,
                total: total[0].count,
                totalPages,
            };
        }),

    getOne: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input, ctx }) => {
            const [meeting] = await db
                .select({
                    ...getTableColumns(meetings),
                    agent: agents,
                    duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as("duration")
                })
                .from(meetings)
                .innerJoin(agents, eq(meetings.agentId, agents.id))
                .where(
                    and(
                        eq(meetings.id, input.id),
                        eq(meetings.userId, ctx.auth.user.id),
                    )
                );

            if (!meeting) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Meeting not found"
                });
            }

            return meeting;
        }),

    remove: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const [removedMeeting] = await db
                .delete(meetings)
                .where(
                    and(
                        eq(meetings.id, input.id),
                        eq(meetings.userId, ctx.auth.user.id),
                    )
                )
                .returning();

            if (!removedMeeting) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Meeting not found"
                });
            }

            return removedMeeting;
        }),

    update: protectedProcedure
        .input(meetingUpdateSchema)
        .mutation(async ({ ctx, input }) => {
            const { id, ...updateData } = input;
            
            const [updatedMeeting] = await db
                .update(meetings)
                .set(updateData)
                .where(
                    and(
                        eq(meetings.id, id),
                        eq(meetings.userId, ctx.auth.user.id),
                    )
                )
                .returning();

            if (!updatedMeeting) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Meeting not found"
                });
            }

            return updatedMeeting;
        }),
});