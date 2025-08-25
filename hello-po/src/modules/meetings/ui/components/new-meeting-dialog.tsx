import { ResponsiveDialog } from "@/components/responsive-dialog";

import { MeetingForm } from "./meeting-form";
import { useRouter } from "next/navigation";

interface NewMeetingDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const NewMeetingDialog = ({
    open, 
    onOpenChange,
}: NewMeetingDialogProps) => {
    const router = useRouter();
    
    return (
        <ResponsiveDialog title="New Meeting" description="Create a new Meeting" open={open} onOpenChange={onOpenChange}>
            <MeetingForm onSucess={(id) => {
                onOpenChange(false);
                // Add a small delay to ensure the meeting is available in database
                setTimeout(() => {
                    router.push(`/meetings/${id}`);
                }, 500);
            }}
            onCancel={() => onOpenChange(false)}
            />
        </ResponsiveDialog>
    )
}