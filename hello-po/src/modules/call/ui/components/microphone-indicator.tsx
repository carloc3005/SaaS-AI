import { useEffect, useState } from "react";
import { useCallStateHooks } from "@stream-io/video-react-sdk";
import { Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
    className?: string;
    size?: "sm" | "md" | "lg";
}

export const MicrophoneIndicator = ({ className, size = "md" }: Props) => {
    const { useMicrophoneState } = useCallStateHooks();
    const { microphone, isMute } = useMicrophoneState();
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [audioLevel, setAudioLevel] = useState(0);

    useEffect(() => {
        // Try multiple ways to access the media stream
        const stream = microphone?.state?.mediaStream || 
                      (microphone as any)?.mediaStream;
                      
        if (!stream || isMute) {
            setIsSpeaking(false);
            setAudioLevel(0);
            return;
        }

        let audioContext: AudioContext | null = null;
        let analyser: AnalyserNode | null = null;
        let animationFrame: number;

        const setupAudioAnalysis = async () => {
            try {
                // Create audio context to analyze microphone input
                audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                
                // Resume context if it's suspended (required by some browsers)
                if (audioContext.state === 'suspended') {
                    await audioContext.resume();
                }
                
                analyser = audioContext.createAnalyser();
                const microphone_source = audioContext.createMediaStreamSource(stream);
                
                analyser.fftSize = 256;
                analyser.smoothingTimeConstant = 0.8;
                const bufferLength = analyser.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);
                
                microphone_source.connect(analyser);

                const detectAudio = () => {
                    if (!analyser) return;
                    
                    analyser.getByteFrequencyData(dataArray);
                    
                    // Calculate average audio level
                    const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
                    const normalizedLevel = average / 255;
                    
                    setAudioLevel(normalizedLevel);
                    
                    // Threshold for considering it as "speaking" (adjust as needed)
                    const speakingThreshold = 0.02;
                    setIsSpeaking(normalizedLevel > speakingThreshold);
                    
                    animationFrame = requestAnimationFrame(detectAudio);
                };

                detectAudio();
            } catch (error) {
                console.warn('Could not set up audio analysis:', error);
                // Fallback: simple visual indicator
                setIsSpeaking(true);
                const interval = setInterval(() => {
                    setIsSpeaking(prev => !prev);
                }, 1000);
                
                return () => clearInterval(interval);
            }
        };

        setupAudioAnalysis();

        return () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
            if (audioContext && audioContext.state !== 'closed') {
                audioContext.close();
            }
        };
    }, [microphone, isMute]);

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
                "relative flex items-center justify-center rounded-full transition-all duration-200",
                sizeClasses[size],
                isMute 
                    ? "bg-red-500/20 text-red-500" 
                    : isSpeaking 
                        ? "bg-green-500/30 text-green-400 shadow-lg" 
                        : "bg-gray-500/20 text-gray-400",
                className
            )}
        >
            {/* Pulsing animation ring when speaking */}
            {isSpeaking && !isMute && (
                <div 
                    className={cn(
                        "absolute inset-0 rounded-full bg-green-400/30 animate-pulse",
                        "before:absolute before:inset-[-4px] before:rounded-full before:bg-green-400/20 before:animate-ping"
                    )}
                    style={{
                        transform: `scale(${1 + audioLevel * 0.3})`, // Scale based on audio level
                    }}
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
            
            {/* Audio level indicator bars */}
            {!isMute && isSpeaking && (
                <div className="absolute -right-1 -top-1 flex space-x-[1px]">
                    {[1, 2, 3].map((bar) => (
                        <div
                            key={bar}
                            className={cn(
                                "w-[2px] bg-green-400 rounded-full transition-all duration-100",
                                audioLevel * 3 >= bar ? "h-2 opacity-100" : "h-1 opacity-30"
                            )}
                            style={{
                                height: `${Math.max(4, audioLevel * 16)}px`
                            }}
                        />
                    ))}
                </div>
            )}
            
            {/* Status indicator */}
            <div 
                className={cn(
                    "absolute -bottom-1 -right-1 w-2 h-2 rounded-full",
                    isMute 
                        ? "bg-red-500" 
                        : isSpeaking 
                            ? "bg-green-400 animate-pulse" 
                            : "bg-gray-400"
                )}
            />
        </div>
    );
};
