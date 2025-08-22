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
                // Redirect directly to the call page so user can join immediately
                setTimeout(() => {
                    router.push(`/call/${id}`);
                }, 500);
            }}
            onCancel={() => onOpenChange(false)}
            />
        </ResponsiveDialog>
    )
}