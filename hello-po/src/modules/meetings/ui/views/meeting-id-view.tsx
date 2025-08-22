"use client";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { MeetingIdViewHeader } from "../components/meeting-id-header";
import { useRouter } from "next/navigation";
import { useConfirm } from "@/modules/agents/hooks/use-confirm";
import { UpdateMeetingDialog } from "../components/update-meeting-dialog";
import { useState } from "react";
import { UpcomingState } from "@/modules/agents/server/ui/components/upcoming-state";
import { ActiveState } from "../components/active-state";
import { CancelledState } from "../components/cancelled-state";
import { CompletedState } from "../components/completed-state";
import { ProcessingState } from "../components/processing-state";

interface Props {
	meetingId: string;
}

export const MeetingIdView = ({ meetingId }: Props) => {
	// Validate meetingId FIRST, before any hooks are called
	if (!meetingId || meetingId === "undefined" || meetingId === "null") {
		return (
			<ErrorState 
				title="Invalid Meeting ID" 
				description="The meeting ID is invalid or missing."
			/>
		);
	}

	const trpc = useTRPC();
	const queryClient = useQueryClient();
	const router = useRouter();

	const [updateMeetingDialogOpen, setUpdateMeetingDialogOpen] = useState(false);
	const [retryCount, setRetryCount] = useState(0);

	const [RemoveConfirmation, confirmRemove] = useConfirm(
		"Are you sure?",
		"The following action will remove this meeting"
	);

	let data, error;
	try {
		// Use suspense query but with error boundary
		const result = useSuspenseQuery({
			...trpc.meetings.getOne.queryOptions({ id: meetingId }),
			retry: (failureCount: number, error: any) => {
				// Retry up to 3 times if meeting is not found (might be recently created)
				if (failureCount < 3 && error?.message?.includes('not found')) {
					return true;
				}
				return false;
			},
			retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 3000),
		});
		data = result.data;
	} catch (err) {
		error = err;
	}

	// Handle error state
	if (error) {
		return <MeetingIdViewError />;
	}

	// Handle missing data
	if (!data) {
		return <MeetingIdViewLoading />;
	}

	const removeMeeting = useMutation(
		trpc.meetings.remove.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));
				// TODO: Invalidate free tier usage
				router.push("/meetings");
			},
		})
	);


	const handleRemoveMeeting = async () => {
		const ok = await confirmRemove();

		if (!ok) return;

		await removeMeeting.mutateAsync({ id: meetingId });
	}

	const isActive = data.status === "active";
	const isUpcoming = data.status === "upcoming";
	const isCancelled = data.status === "cancelled";
	const isCompleted = data.status === "completed";
	const isProcessing = data.status === "processing";

	return (
		<>
			<RemoveConfirmation />
			<UpdateMeetingDialog open={updateMeetingDialogOpen} onOpenChange={setUpdateMeetingDialogOpen} initialValues={data}/>
			<div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
				<MeetingIdViewHeader 
					meetingId={meetingId} 
					meetingName={data.name} 
					isPrivate={data.isPrivate} 
					pin={data.pin}
					onEdit={() => setUpdateMeetingDialogOpen(true)} 
					onRemove={handleRemoveMeeting}
				/>
				{isCancelled && <CancelledState meetingId={meetingId} />}
				{isProcessing && <ProcessingState meetingId={meetingId} />}
				{isCompleted && (
					<CompletedState 
						meetingId={meetingId} 
						summary={data.summary} 
						recordingUrl={data.recordingUrl}
					/>
				)}
				{isActive && <ActiveState meetingId={meetingId} />}
				{isUpcoming && <UpcomingState meetingId={meetingId} onCancelMeeting={() => {}} isCancelling={false} /> }
			</div>
		</>
	)
};

export const MeetingIdViewLoading = () => {
	return (
		<LoadingState
		title="Loading Meeting"
		description="This may take a few seconds" 
		/>
	);
};

export const MeetingIdViewError = () => {
	const router = useRouter();
	
	return (
		<div className="flex h-screen items-center justify-center">
			<div className="text-center space-y-4">
				<ErrorState
					title="Error Loading Meeting"
					description="The meeting might be still processing or doesn't exist."
				/>
				<div className="flex gap-2 justify-center">
					<Button 
						variant="outline" 
						onClick={() => window.location.reload()}
					>
						Refresh Page
					</Button>
					<Button 
						onClick={() => router.push('/meetings')}
					>
						Back to Meetings
					</Button>
				</div>
			</div>
		</div>
	);
}