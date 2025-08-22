import { auth } from "@/lib/auth";
import { MeetingIdView, MeetingIdViewError, MeetingIdViewLoading } from "@/modules/meetings/ui/views/meeting-id-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface Props {
    params: Promise<{
        meetingId: string;
    }>;
}

const Page = async ({ params }: Props) => {
    const { meetingId } = await params;

    // Validate meetingId
    if (!meetingId || meetingId === "undefined" || meetingId === "null") {
        redirect("/meetings");
    }

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/sign-in");
    }

    const queryClient = getQueryClient();
    
    // Try to prefetch the query, but don't fail if it errors
    try {
        void queryClient.prefetchQuery(
            trpc.meetings.getOne.queryOptions({ id: meetingId }),
        );
    } catch (error) {
        // Log the error but continue rendering
        console.warn("Failed to prefetch meeting data:", error);
    }

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<MeetingIdViewLoading />}>
                <ErrorBoundary fallback={<MeetingIdViewError />}>
                    <MeetingIdView meetingId={meetingId}/>
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    );
};

export default Page;