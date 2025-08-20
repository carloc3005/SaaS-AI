"use client";

import { ErrorState } from "@/components/error-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CallProvider } from "../components/call-provider";

interface Props {
	meetingId: string;
};

export const CallView = ({
	meetingId
}: Props) => {
	const trpc = useTRPC();
	const { data } = useSuspenseQuery(trpc.meetings.getOne.queryOptions({ id: meetingId }));

	// For now, allow joining if status is upcoming or active
	if (data.status === "upcoming" || data.status === "active") {
		return <CallProvider meetingId={meetingId} meetingName={data.name}/>
	}

	if (data.status === "completed" || data.status === "cancelled") {
		return (
			<div className="flex h-screen items-center justify-center">
				<ErrorState title="Meeting has ended" description="You can no longer join this meeting"/>
			</div>
		)
	}

	return <CallProvider meetingId={meetingId} meetingName={data.name}/>
}