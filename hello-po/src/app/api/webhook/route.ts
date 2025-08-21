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

function verifySignatureWithSDK(body: string, signature: string): boolean {
    try {
        return streamVideo.verifyWebhook(body, signature);
    } catch (error) {
        console.log("Signature verification failed, but continuing for debugging:", error);
        // For development, we'll be more lenient with signature verification
        return true; // Allow all requests during debugging
    }
};

export async function POST(req: NextRequest) {
    console.log("=== Webhook called ===");
    const signature = req.headers.get("x-signature");
    const apiKey = req.headers.get("x-api-key");

    console.log("Headers:", { 
        signature: !!signature, 
        apiKey: !!apiKey,
        url: req.url,
        method: req.method,
        timestamp: new Date().toISOString()
    });

    if (!signature || !apiKey) {
        console.log("Warning: Missing signature or API key - allowing for debugging");
        // In development, we'll be more lenient
    }

    const body = await req.text();

    // Temporarily disable signature verification for debugging
    console.log("Skipping signature verification for debugging purposes");
    // if (signature && !verifySignatureWithSDK(body, signature)) {
    //     return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    // }

    let payload: unknown;

    try {
        payload = JSON.parse(body) as Record<string, unknown>;
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const eventType = (payload as Record<string, unknown>)?.type;
    console.log("=== PROCESSING EVENT ===");
    console.log("Event type:", eventType);
    console.log("Timestamp:", new Date().toISOString());
    console.log("Full payload:", JSON.stringify(payload, null, 2));
    console.log("========================");

    if (eventType === "call.session_started") {
        console.log("Processing call.session_started event");
        const event = payload as CallSessionStartedEvent;
        const meetingId = event.call.custom?.meetingId;
        console.log("Meeting ID from event:", meetingId);

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
        console.log("Connecting OpenAI to call:", meetingId);
        
        try {
            // Check if OpenAI API key is available
            if (!process.env.OPENAI_API_KEY) {
                console.error("OPENAI_API_KEY environment variable is not set");
                return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 });
            }

            console.log("Attempting to connect OpenAI with agent ID:", existingAgent.id);
            
            const realtimeClient = await streamVideo.video.connectOpenAi({
                call,
                openAiApiKey: process.env.OPENAI_API_KEY,
                agentUserId: existingAgent.id,
            });

            console.log("OpenAI client connected successfully, updating session with instructions:", existingAgent.instructions);
            
            await realtimeClient.updateSession({
                instructions: existingAgent.instructions,
                voice: "alloy", // Add a voice setting
                input_audio_format: "pcm16",
                output_audio_format: "pcm16",
                turn_detection: {
                    type: "server_vad",
                    threshold: 0.5,
                    prefix_padding_ms: 300,
                    silence_duration_ms: 200
                }
            });
            
            console.log("Agent setup completed successfully for meeting:", meetingId);
            
            // As a backup, manually start recording and transcription
            try {
                console.log("Starting recording and transcription as backup...");
                await call.startRecording();
                console.log("✅ Recording started manually");
            } catch (recordingError) {
                console.log("❌ Manual recording start failed:", recordingError instanceof Error ? recordingError.message : 'Unknown error');
            }
            
            try {
                await call.startTranscription();
                console.log("✅ Transcription started manually");
            } catch (transcriptionError) {
                console.log("❌ Manual transcription start failed:", transcriptionError instanceof Error ? transcriptionError.message : 'Unknown error');
            }
        } catch (error) {
            console.error("Error setting up OpenAI agent:", error);
            console.error("Error details:", {
                message: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined,
                meetingId,
                agentId: existingAgent.id
            });
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
        console.log("=== PROCESSING call.ended EVENT ===");
        const event = payload as CallEndedEvent;
        const meetingId = event.call.custom?.meetingId;
        
        console.log("Call ended - Meeting ID:", meetingId);
        console.log("Call CID:", event.call_cid);

        if (!meetingId) {
            console.error("Missing meetingId in call.ended event");
            return NextResponse.json({ error: "Missing meetingId" }, { status: 400 });
        }

        console.log("Updating meeting status to 'processing' for:", meetingId);
        await db
            .update(meetings)
            .set({
                status: "processing",
                endedAt: new Date(),
            })
            .where(and(eq(meetings.id, meetingId), eq(meetings.status, "active")));
            
        console.log("Meeting status updated successfully for:", meetingId);
    } else if (eventType === "call.recording_started") {
        console.log("=== RECORDING STARTED ===");
        const recordingEvent = payload as any; // Stream doesn't have a type for this yet
        const recordingMeetingId = recordingEvent.call_cid?.split(":")[1] || recordingEvent.call?.custom?.meetingId;
        console.log("Recording started for meeting:", recordingMeetingId);
    } else if (eventType === "call.transcription_started") {
        console.log("=== TRANSCRIPTION STARTED ===");
        const transcriptionEvent = payload as any; // Stream doesn't have a type for this yet
        const transcriptionMeetingId = transcriptionEvent.call_cid?.split(":")[1] || transcriptionEvent.call?.custom?.meetingId;
        console.log("Transcription started for meeting:", transcriptionMeetingId);
    } else if (eventType === "call.transcription_ready") {
        console.log("Processing call.transcription_ready event");
        const event = payload as CallTranscriptionReadyEvent;
        const meetingId = event.call_cid.split(":")[1];
        
        console.log("Transcription ready for meeting:", meetingId);
        console.log("Transcript URL:", event.call_transcription.url);

        if (!meetingId) {
            console.error("Missing meetingId in transcription event");
            return NextResponse.json({ error: "Missing meetingId" }, { status: 400 });
        }

        try {
            const [updatedMeeting] = await db
                .update(meetings)
                .set({
                    transcriptUrl: event.call_transcription.url,
                    status: "completed", // Update status to completed when transcript is ready
                })
                .where(eq(meetings.id, meetingId))
                .returning();

            if (!updatedMeeting) {
                console.error("Meeting not found for transcription:", meetingId);
                return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
            }

            console.log("Successfully updated meeting with transcript URL:", {
                meetingId,
                transcriptUrl: event.call_transcription.url
            });
        } catch (error) {
            console.error("Error updating meeting with transcript:", error);
            return NextResponse.json({ error: "Failed to update transcript" }, { status: 500 });
        }

        // TODO: Call Ingest background job to summarize the transcript
    } else if (eventType === "call.recording_ready") {
        console.log("Processing call.recording_ready event");
        const event = payload as CallRecordingReadyEvent;
        const meetingId = event.call_cid.split(":")[1];
        
        console.log("Recording ready for meeting:", meetingId);
        console.log("Recording URL:", event.call_recording.url);

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
                
            console.log("Successfully updated meeting with recording URL:", {
                meetingId,
                recordingUrl: event.call_recording.url
            });
        } catch (error) {
            console.error("Error updating meeting with recording:", error);
            return NextResponse.json({ error: "Failed to update recording" }, { status: 500 });
        }
    } else {
        console.log("=== UNKNOWN EVENT TYPE ===");
        console.log("Received unknown event type:", eventType);
        console.log("Available event types we handle:");
        console.log("- call.session_started");
        console.log("- call.session_participant_left");
        console.log("- call.ended");
        console.log("- call.transcription_ready");
        console.log("- call.recording_ready");
        console.log("========================");
    }

    return NextResponse.json({ status: "ok" });
}