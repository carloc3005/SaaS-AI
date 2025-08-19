import { LogInIcon } from "lucide-react";
import { 
    ToggleAudioPreviewButton,
    ToggleVideoPreviewButton,
    useCallStateHooks,
    VideoPreview
 } from "@stream-io/video-react-sdk";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import "@stream-io/video-react-sdk/css/styles.css";

interface Props {
    onJoin: () => void;
};

export const CallLobby = ({ onJoin }: Props) => {
    const { useCameraState, useMicrophoneState} = useCallStateHooks();

    const {hasBrowserPermission: hasMicPermission} = useMicrophoneState();
    const {hasBrowserPermission: hasCameraPermission} = useCameraState();

    const hasBrowserMediaPermission = hasCameraPermission && hasMicPermission;

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-4xl">
                <Card className="mx-auto max-w-md">
                    <CardHeader className="text-center">
                        <CardTitle className="text-xl">Ready to join?</CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Set up your call before joining
                        </p>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                        {/* Video Preview */}
                        <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                            <VideoPreview />
                        </div>

                        {/* Media Controls */}
                        <div className="flex items-center justify-center gap-4">
                            <ToggleVideoPreviewButton />
                            <ToggleAudioPreviewButton />
                        </div>

                        {/* Permission Status */}
                        {!hasBrowserMediaPermission && (
                            <div className="p-4 bg-muted rounded-lg">
                                <p className="text-sm text-muted-foreground text-center">
                                    Please allow camera and microphone access to join the call
                                </p>
                            </div>
                        )}

                        {/* Join Button */}
                        <Button 
                            onClick={onJoin}
                            className="w-full"
                            size="lg"
                            disabled={!hasBrowserMediaPermission}
                        >
                            <LogInIcon className="size-4" />
                            Join Call
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
