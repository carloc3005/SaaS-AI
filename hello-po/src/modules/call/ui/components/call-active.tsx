import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { CallControls, SpeakerLayout, useCall } from "@stream-io/video-react-sdk";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

interface Props {
    onLeave: () => void;
    meetingName: string;
}

export const CallActive = ({ onLeave, meetingName}: Props) => {
    const call = useCall();
    const [isAddingAgent, setIsAddingAgent] = useState(false);
    const [agentCount, setAgentCount] = useState(0);

    const handleAddAgent = async () => {
        if (!call || isAddingAgent) return;
        
        setIsAddingAgent(true);
        try {
            const meetingId = call.id;
            console.log('🤖 Manually adding agent to meeting:', meetingId);
            
            const response = await fetch('/api/force-agent-join', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ meetingId }),
            });
            
            if (response.ok) {
                const result = await response.json();
                console.log('✅ Agent added successfully:', result);
                if (!result.alreadyConnected) {
                    setAgentCount(prev => prev + 1);
                }
            } else {
                console.error('❌ Failed to add agent');
            }
        } catch (error) {
            console.error('❌ Error adding agent:', error);
        } finally {
            setIsAddingAgent(false);
        }
    };

    return (
        <div className="flex flex-col justify-between p-4 h-full text-white">
            <div className="bg-[#101213] round-full flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/" className="flex items-center justify-center p-1 bg-white/10 rounded-full w-fit">
                        <Image src="/logoipsum-381.svg" width={22} height={22} alt="logo" />
                    </Link>
                    <h4 className="text-base">
                        {meetingName}
                    </h4>
                </div>
                
                <Button 
                    onClick={handleAddAgent}
                    disabled={isAddingAgent}
                    variant="outline"
                    size="sm"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                    <UserPlus className="w-4 h-4 mr-2" />
                    {isAddingAgent ? "Adding..." : "Add Agent"}
                </Button>
            </div>
            <SpeakerLayout />
            <div className="bg-[#101213] rounded-full px-4">
                <CallControls onLeave={onLeave}/>
            </div>
        </div>
    );
};