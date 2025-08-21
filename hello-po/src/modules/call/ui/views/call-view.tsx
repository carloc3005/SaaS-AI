"use client";

import { ErrorState } from "@/components/error-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CallProvider } from "../components/call-provider";
import { PinVerificationDialog } from "../components/pin-verification-dialog";
import { useState } from "react";

interface Props {
	meetingId: string;
};

export const CallView = ({
	meetingId
}: Props) => {
	const trpc = useTRPC();
	const { data } = useSuspenseQuery(trpc.meetings.getOne.queryOptions({ id: meetingId }));
	const [pinVerified, setPinVerified] = useState(false);

	// For meetings that have ended, show error state
	if (data.status === "completed" || data.status === "cancelled") {
		return (
			<div className="flex h-screen items-center justify-center">
				<ErrorState title="Meeting has ended" description="You can no longer join this meeting"/>
			</div>
		)
	}

	// For private meetings, show PIN verification dialog
	if (data.isPrivate && !pinVerified && (data.status === "upcoming" || data.status === "active")) {
		return (
			<>
				<div className="flex h-screen items-center justify-center bg-slate-50">
					<div className="text-center">
						<h2 className="text-2xl font-semibold text-slate-900 mb-2">Private Meeting</h2>
						<p className="text-slate-600">Please enter the PIN to join this meeting</p>
					</div>
				</div>
				<PinVerificationDialog
					open={true}
					meetingId={meetingId}
					meetingName={data.name}
					onSuccess={() => setPinVerified(true)}
				/>
			</>
		)
	}

	// For non-private meetings or PIN verified private meetings, allow joining if status is upcoming or active
	if (data.status === "upcoming" || data.status === "active") {
		return <CallProvider meetingId={meetingId} meetingName={data.name}/>
	}

	// Default error state for other statuses
	return <CallProvider meetingId={meetingId} meetingName={data.name}/>
}