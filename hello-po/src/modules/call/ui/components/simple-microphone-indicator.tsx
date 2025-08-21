import { useEffect, useState } from "react";
import { useCallStateHooks } from "@stream-io/video-react-sdk";
import { Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
    className?: string;
    size?: "sm" | "md" | "lg";
}

export const SimpleMicrophoneIndicator = ({ className, size = "md" }: Props) => {
    const { useMicrophoneState } = useCallStateHooks();
    const { isMute, isEnabled } = useMicrophoneState();
    const [isActive, setIsActive] = useState(false);

    // Simple activity indicator that toggles when mic is enabled and not muted
    useEffect(() => {
        if (isMute || !isEnabled) {
            setIsActive(false);
            return;
        }

        // Simple visual feedback when microphone is active
        const interval = setInterval(() => {
            setIsActive(prev => !prev);
        }, 1000); // Pulse every second when mic is active

        return () => clearInterval(interval);
    }, [isMute, isEnabled]);

    const sizeClasses = {
        sm: "w-6 h-6",
        md: "w-8 h-8", 
        lg: "w-10 h-10"
    };

    const iconSizes = {
        sm: 14,
        md: 18,
        lg: 22
    };

    return (
        <div 
            className={cn(
                "relative flex items-center justify-center rounded-full transition-all duration-300",
                sizeClasses[size],
                isMute 
                    ? "bg-red-500/20 text-red-500" 
                    : isEnabled 
                        ? isActive 
                            ? "bg-green-500/30 text-green-400 scale-110" 
                            : "bg-green-500/20 text-green-400"
                        : "bg-gray-500/20 text-gray-400",
                className
            )}
        >
            {/* Animated ring when active */}
            {isEnabled && !isMute && (
                <div 
                    className={cn(
                        "absolute inset-0 rounded-full border-2 border-green-400/50",
                        isActive && "animate-ping"
                    )}
                />
            )}
            
            {/* Microphone icon */}
            <div className="relative z-10">
                {isMute ? (
                    <MicOff size={iconSizes[size]} />
                ) : (
                    <Mic size={iconSizes[size]} />
                )}
            </div>
            
            {/* Status dot */}
            <div 
                className={cn(
                    "absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white",
                    isMute 
                        ? "bg-red-500" 
                        : isEnabled 
                            ? "bg-green-500" 
                            : "bg-gray-500"
                )}
            />
        </div>
    );
};
