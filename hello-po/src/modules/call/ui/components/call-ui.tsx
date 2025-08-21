import { useState } from "react";
import { StreamTheme, useCall } from "@stream-io/video-react-sdk";
import { CallLobby } from "./call-lobby";
import { CallActive } from "./call-active";
import { CallEnded } from "./call-ended";

interface Props {
    meetingName: string;
}

export const CallUI = ({meetingName }: Props) => {
    const call = useCall();
    const [show, setShow] = useState<"lobby" | "call" | "ended">("lobby");
    const [agentJoining, setAgentJoining] = useState(false);
    const [agentJoined, setAgentJoined] = useState(false); // Track if agent already joined
    const [isJoining, setIsJoining] = useState(false); // Track if currently joining
    const [hasJoined, setHasJoined] = useState(false); // Track if already joined

    const triggerAgentJoin = async (meetingId: string) => {
        if (agentJoining || agentJoined) return; // Prevent multiple calls
        
        setAgentJoining(true);
        try {
            console.log('🤖 Triggering agent to join meeting:', meetingId);
            
            // Only call one API endpoint - use force-agent-join as it's more reliable
            const response = await fetch('/api/force-agent-join', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ meetingId }),
            });
            
            if (response.ok) {
                const result = await response.json();
                if (result.alreadyConnected) {
                    console.log('ℹ️ Agent already in call');
                } else {
                    console.log('✅ Agent joined successfully');
                }
                setAgentJoined(true); // Mark as joined
            } else {
                console.error('❌ Failed to trigger agent join');
            }
        } catch (error) {
            console.error('❌ Error triggering agent join:', error);
        } finally {
            setAgentJoining(false);
        }
    };

    const handleJoin = async () => {
        if (!call || isJoining || hasJoined) return;

        setIsJoining(true);
        try {
            await call.join();
            setHasJoined(true);
            
            // Note: Agent will join automatically via webhook when session starts
            // No need to manually trigger agent join here
            setShow("call");
        } catch (error) {
            console.error("Error joining call:", error);
            setIsJoining(false);
        }
    };

    const handleLeave = () => {
        if (!call) return;

        call.endCall();
        setShow("ended");
        
        // Reset state for potential rejoin
        setHasJoined(false);
        setIsJoining(false);
        setAgentJoined(false);
    };

    return (
        <StreamTheme className="h-full">
            {show === "lobby" && <CallLobby onJoin={handleJoin} isJoining={isJoining} />}
            {show === "call" && <CallActive onLeave={handleLeave} meetingName={meetingName}/>}
            {show === "ended" && <CallEnded />}
        </StreamTheme>
    );
};