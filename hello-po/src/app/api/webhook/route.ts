import { and, eq, not } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import {
    CallSessionStartedEvent,
    CallSessionParticipantLeftEvent,
    CallEndedEvent,
    CallTranscriptionReadyEvent,
    CallRecordingReadyEvent
} from "@stream-io/node-sdk";

import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { streamVideo } from "@/lib/stream-video";
import { inngest } from "@/inngest/client";

function verifySignatureWithSDK(body: string, signature: string): boolean {
    try {
        return streamVideo.verifyWebhook(body, signature);
    } catch (error) {
        console.error("Signature verification failed:", error);
        return false;
    }
};

export async function POST(req: NextRequest) {
    const signature = req.headers.get("x-signature");
    const apiKey = req.headers.get("x-api-key");

    if (!signature || !apiKey) {
        return NextResponse.json({ error: "Missing signature or API key" }, { status: 401 });
    }

    const body = await req.text();

    if (!verifySignatureWithSDK(body, signature)) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    let payload: unknown;

    try {
        payload = JSON.parse(body) as Record<string, unknown>;
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const eventType = (payload as Record<string, unknown>)?.type;

    if (eventType === "call.session_started") {
        const event = payload as CallSessionStartedEvent;
        const meetingId = event.call.custom?.meetingId;

        if (!meetingId) {
            return NextResponse.json({ error: "Missing meetingId" }, { status: 400 });
        }

        const [existingMeeting] = await db
            .select()
            .from(meetings)
            .where(
                and(
                    eq(meetings.id, meetingId),
                    not(eq(meetings.status, "completed")),
                    not(eq(meetings.status, "active")),
                    not(eq(meetings.status, "cancelled")),
                    not(eq(meetings.status, "processing"))
                )
            );

        if (!existingMeeting) {
            return NextResponse.json({ error: "Meeting not found" }, { status: 400 })
        }

        await db
            .update(meetings)
            .set({
                status: "active",
                startedAt: new Date(),
            })
            .where(eq(meetings.id, existingMeeting.id));

        const [existingAgent] = await db
            .select()
            .from(agents)
            .where(eq(agents.id, existingMeeting.agentId));

        if (!existingAgent) {
            return NextResponse.json({ error: "Agent not found" }, { status: 404 });
        }

        const call = streamVideo.video.call("default", meetingId);
        
        try {
            if (!process.env.OPENAI_API_KEY) {
                console.error("OPENAI_API_KEY environment variable is not set");
                return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 });
            }
            
            const realtimeClient = await streamVideo.video.connectOpenAi({
                call,
                openAiApiKey: process.env.OPENAI_API_KEY,
                agentUserId: existingAgent.id,
            });
            
            await realtimeClient.updateSession({
                instructions: existingAgent.instructions,
                voice: "alloy",
                input_audio_format: "pcm16",
                output_audio_format: "pcm16",
                turn_detection: {
                    type: "server_vad",
                    threshold: 0.5,
                    prefix_padding_ms: 300,
                    silence_duration_ms: 200
                }
            });
            
            // Start recording and transcription
            try {
                await call.startRecording();
            } catch (recordingError) {
                console.error("Recording start failed:", recordingError instanceof Error ? recordingError.message : 'Unknown error');
            }
            
            try {
                await call.startTranscription();
            } catch (transcriptionError) {
                console.error("Transcription start failed:", transcriptionError instanceof Error ? transcriptionError.message : 'Unknown error');
            }
        } catch (error) {
            console.error("Error setting up OpenAI agent:", error);
            return NextResponse.json({ 
                error: "Failed to setup agent", 
                details: error instanceof Error ? error.message : 'Unknown error'
            }, { status: 500 });
        }
    } else if (eventType === "call.session_participant_left") {
        const event = payload as CallSessionParticipantLeftEvent;
        const meetingId = event.call_cid.split(":")[1];

        if (!meetingId) {
            return NextResponse.json({ error: "Missing meetingId" }, { status: 400 });
        }

        const call = streamVideo.video.call("default", meetingId);
        await call.end();
    } else if (eventType === "call.ended") {
        const event = payload as CallEndedEvent;
        const meetingId = event.call.custom?.meetingId;

        if (!meetingId) {
            console.error("Missing meetingId in call.ended event");
            return NextResponse.json({ error: "Missing meetingId" }, { status: 400 });
        }

        await db
            .update(meetings)
            .set({
                status: "processing",
                endedAt: new Date(),
            })
            .where(and(eq(meetings.id, meetingId), eq(meetings.status, "active")));
    } else if (eventType === "call.recording_started") {
        // Recording started - no action needed, just acknowledge
    } else if (eventType === "call.transcription_started") {
        // Transcription started - no action needed, just acknowledge
    } else if (eventType === "call.transcription_ready") {
        const event = payload as CallTranscriptionReadyEvent;
        const meetingId = event.call_cid.split(":")[1];

        if (!meetingId) {
            console.error("Missing meetingId in transcription event");
            return NextResponse.json({ error: "Missing meetingId" }, { status: 400 });
        }

        let updatedMeeting;
        try {
            const [meeting] = await db
                .update(meetings)
                .set({
                    transcriptUrl: event.call_transcription.url,
                    status: "completed", // Update status to completed when transcript is ready
                })
                .where(eq(meetings.id, meetingId))
                .returning();

            if (!meeting) {
                console.error("Meeting not found for transcription:", meetingId);
                return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
            }

            updatedMeeting = meeting;
        } catch (error) {
            console.error("Error updating meeting with transcript:", error);
            return NextResponse.json({ error: "Failed to update transcript" }, { status: 500 });
        }

        await inngest.send({
            name: "meetings/processing",
            data: {
                meetingId: updatedMeeting.id,
                transcriptUrl: updatedMeeting.transcriptUrl,
            }
        })
    } else if (eventType === "call.recording_ready") {
        const event = payload as CallRecordingReadyEvent;
        const meetingId = event.call_cid.split(":")[1];

        if (!meetingId) {
            console.error("Missing meetingId in recording event");
            return NextResponse.json({ error: "Missing meetingId" }, { status: 400 });
        }

        try {
            await db 
                .update(meetings)
                .set({
                    recordingUrl: event.call_recording.url,
                })
                .where(eq(meetings.id, meetingId));
        } catch (error) {
            console.error("Error updating meeting with recording:", error);
            return NextResponse.json({ error: "Failed to update recording" }, { status: 500 });
        }
    }

    return NextResponse.json({ status: "ok" });
}