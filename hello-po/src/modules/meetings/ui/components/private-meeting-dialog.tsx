import { ResponsiveDialog } from "@/components/responsive-dialog";
import { MeetingForm } from "./meeting-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LockIcon, CopyIcon, CheckIcon } from "lucide-react";
import { toast } from "sonner";

interface PrivateMeetingDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const PrivateMeetingDialog = ({
    open, 
    onOpenChange,
}: PrivateMeetingDialogProps) => {
    const router = useRouter();
    const [meetingData, setMeetingData] = useState<{ id: string; pin: string; name: string } | null>(null);
    const [copiedPin, setCopiedPin] = useState(false);
    const [copiedLink, setCopiedLink] = useState(false);
    
    const handleMeetingCreated = (id: string, pin: string, name: string) => {
        setMeetingData({ id, pin, name });
    };

    const copyToClipboard = async (text: string, type: 'pin' | 'link') => {
        try {
            await navigator.clipboard.writeText(text);
            if (type === 'pin') {
                setCopiedPin(true);
                setTimeout(() => setCopiedPin(false), 2000);
                toast.success("PIN copied to clipboard!");
            } else {
                setCopiedLink(true);
                setTimeout(() => setCopiedLink(false), 2000);
                toast.success("Meeting link copied to clipboard!");
            }
        } catch (err) {
            toast.error("Failed to copy to clipboard");
        }
    };

    const handleClose = () => {
        setMeetingData(null);
        setCopiedPin(false);
        setCopiedLink(false);
        onOpenChange(false);
    };

    const meetingLink = meetingData ? `${window.location.origin}/call/${meetingData.id}` : '';
    
    return (
        <ResponsiveDialog 
            title={meetingData ? "Private Meeting Created! 🎉" : "Create Private Meeting"} 
            description={meetingData ? "Your secure meeting is ready" : "Create a secure, encrypted meeting with PIN protection"}
            open={open} 
            onOpenChange={handleClose}
        >
            {meetingData ? (
                <div className="space-y-4">
                    <Card className="border-green-200 bg-green-50">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <LockIcon className="h-5 w-5 text-green-600" />
                                {meetingData.name}
                            </CardTitle>
                            <CardDescription>
                                Your private meeting has been created successfully. Share the PIN with invited participants.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Meeting PIN</label>
                                <div className="flex items-center gap-2 p-3 bg-white border rounded-lg">
                                    <code className="flex-1 text-2xl font-mono font-bold text-center tracking-wider">
                                        {meetingData.pin}
                                    </code>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => copyToClipboard(meetingData.pin, 'pin')}
                                    >
                                        {copiedPin ? (
                                            <CheckIcon className="h-4 w-4" />
                                        ) : (
                                            <CopyIcon className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Meeting Link</label>
                                <div className="flex items-center gap-2 p-3 bg-gray-50 border rounded-lg">
                                    <code className="flex-1 text-sm text-gray-600 truncate">
                                        {meetingLink}
                                    </code>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => copyToClipboard(meetingLink, 'link')}
                                    >
                                        {copiedLink ? (
                                            <CheckIcon className="h-4 w-4" />
                                        ) : (
                                            <CopyIcon className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <p className="text-sm text-blue-800">
                                    <strong>Important:</strong> Participants will need both the meeting link and the 4-digit PIN to join this private meeting.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex gap-2">
                        <Button 
                            onClick={() => router.push(`/call/${meetingData.id}`)}
                            className="flex-1"
                        >
                            Join Meeting Now
                        </Button>
                        <Button 
                            variant="outline" 
                            onClick={handleClose}
                            className="flex-1"
                        >
                            Close
                        </Button>
                    </div>
                </div>
            ) : (
                <PrivateMeetingForm 
                    onSuccess={handleMeetingCreated}
                    onCancel={handleClose}
                />
            )}
        </ResponsiveDialog>
    )
};

// Specialized form component for private meetings
interface PrivateMeetingFormProps {
    onSuccess: (id: string, pin: string, name: string) => void;
    onCancel: () => void;
}

const PrivateMeetingForm = ({ onSuccess, onCancel }: PrivateMeetingFormProps) => {
    return (
        <MeetingForm
            onSucess={(id?: string, meetingData?: any) => {
                // The meeting form now returns the full meeting data
                if (id && meetingData?.pin && meetingData?.name) {
                    onSuccess(id, meetingData.pin, meetingData.name);
                }
            }}
            onCancel={onCancel}
            initialValues={{
                name: "",
                agentId: "",
                isPrivate: true, // Pre-fill private meeting
            } as any}
        />
    );
};
