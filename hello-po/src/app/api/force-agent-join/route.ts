import { NextRequest, NextResponse } from "next/server";
import { streamVideo } from "@/lib/stream-video";
import { db } from "@/db";
import { meetings, agents } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
    try {
        const { meetingId } = await req.json();
        
        if (!meetingId) {
            return NextResponse.json({ error: "Meeting ID is required" }, { status: 400 });
        }
        
        console.log("🤖 Force joining agent to meeting:", meetingId);
        
        // Get meeting from database
        const [meeting] = await db
            .select()
            .from(meetings)
            .where(eq(meetings.id, meetingId));
            
        if (!meeting) {
            return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
        }
        
        // Get the agent for this meeting
        const [agent] = await db
            .select()
            .from(agents)
            .where(eq(agents.id, meeting.agentId));
            
        if (!agent) {
            return NextResponse.json({ error: "Agent not found" }, { status: 404 });
        }
        
        const call = streamVideo.video.call("default", meetingId);
        
        try {
            // Check current call state to see if agents are already connected
            const callState = await call.get();
            console.log("📊 Current call state - participants:", callState.call.session?.participants?.length || 0);
            
            // Log all participants for debugging
            if (callState.call.session?.participants) {
                console.log("👥 Current participants:", callState.call.session.participants.map(p => ({
                    id: p.user?.id,
                    name: p.user?.name,
                    role: p.role
                })));
            }
            
            // Check if this specific agent is already in the call
            const isAgentAlreadyConnected = callState.call.session?.participants?.some(p => 
                p.user?.id === agent.id
            ) || false;
            
            if (isAgentAlreadyConnected) {
                console.log("⚠️ This specific agent is already in the call:", agent.id);
                return NextResponse.json({ 
                    success: true, 
                    message: "Agent already in call",
                    agentId: agent.id,
                    agentName: agent.name,
                    alreadyConnected: true
                });
            }
            
            // Check if OpenAI API key is available
            if (!process.env.OPENAI_API_KEY) {
                console.error("OPENAI_API_KEY environment variable is not set");
                return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 });
            }

            console.log("🔗 Connecting OpenAI to call with agent:", agent.id, "name:", agent.name);
            
            const realtimeClient = await streamVideo.video.connectOpenAi({
                call,
                openAiApiKey: process.env.OPENAI_API_KEY,
                agentUserId: agent.id,
            });

            console.log("✅ OpenAI client connected successfully!");
            
            await realtimeClient.updateSession({
                instructions: agent.instructions,
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
            
            console.log("🎉 SUCCESS! AI Agent is now in the call!");
            
            return NextResponse.json({ 
                success: true, 
                message: "Agent joined successfully",
                agentId: agent.id,
                agentName: agent.name
            });
            
        } catch (error) {
            console.error("❌ Failed to connect OpenAI agent:", error);
            return NextResponse.json({ 
                error: "Failed to connect agent", 
                details: error instanceof Error ? error.message : 'Unknown error'
            }, { status: 500 });
        }
        
    } catch (error) {
        console.error("❌ Error in force agent join:", error);
        return NextResponse.json(
            { error: "Failed to join agent", details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
