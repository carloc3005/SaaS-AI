import Link from "next/link";
import Image from "next/image";
import { CallControls, SpeakerLayout } from "@stream-io/video-react-sdk";

interface Props {
    onLeave: () => void;
    meetingName: string;
}

export const CallActive = ({ onLeave, meetingName}: Props) => {
    return (
        <div className="flex flex-col justify-between p-4 h-full text-white">
            <div className="bg-[#101213] round-full flex items-center gap-4">
                
            </div>
        </div>
    )
}