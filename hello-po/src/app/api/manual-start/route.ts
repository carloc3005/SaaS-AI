import { NextRequest, NextResponse } from "next/server";
import { streamVideo } from "@/lib/stream-video";
import { db } from "@/db";
import { meetings } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
    try {
        const { meetingId } = await req.json();
        
        if (!meetingId) {
            return NextResponse.json({ error: "Meeting ID is required" }, { status: 400 });
        }
        
        console.log("Manually starting recording/transcription for meeting:", meetingId);
        
        // Get meeting from database
        const [meeting] = await db
            .select()
            .from(meetings)
            .where(eq(meetings.id, meetingId));
            
        if (!meeting) {
            return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
        }
        
        const call = streamVideo.video.call("default", meetingId);
        
        // Get call state
        const callState = await call.get();
        console.log("Call state - Recording:", callState.call.recording, "Transcribing:", callState.call.transcribing);
        
        const results = {
            meetingId,
            recording: { started: false, error: null as string | null },
            transcription: { started: false, error: null as string | null },
            callState: {
                recording: callState.call.recording,
                transcribing: callState.call.transcribing
            }
        };
        
        // Try to start recording
        try {
            if (!callState.call.recording) {
                await call.startRecording();
                results.recording.started = true;
                console.log("✅ Recording started successfully");
            } else {
                results.recording.started = true;
                console.log("ℹ️ Recording already active");
            }
        } catch (error) {
            results.recording.error = error instanceof Error ? error.message : 'Unknown error';
            console.log("❌ Failed to start recording:", results.recording.error);
        }
        
        // Try to start transcription
        try {
            if (!callState.call.transcribing) {
                await call.startTranscription();
                results.transcription.started = true;
                console.log("✅ Transcription started successfully");
            } else {
                results.transcription.started = true;
                console.log("ℹ️ Transcription already active");
            }
        } catch (error) {
            results.transcription.error = error instanceof Error ? error.message : 'Unknown error';
            console.log("❌ Failed to start transcription:", results.transcription.error);
        }
        
        // Get updated call state
        const updatedState = await call.get();
        results.callState = {
            recording: updatedState.call.recording,
            transcribing: updatedState.call.transcribing
        };
        
        return NextResponse.json(results);
        
    } catch (error) {
        console.error("Error in manual start:", error);
        return NextResponse.json(
            { error: "Failed to start recording/transcription", details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
