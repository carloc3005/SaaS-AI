import { LoadingState } from "@/components/loading-state";
import { AgentsView, AgentsViewError } from "@/modules/agents/server/ui/views/agents-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import { AgentListHeader } from "@/modules/agents/server/ui/components/agent-list-header";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { SearchParams } from "nuqs";
import { loadSearchParams } from "@/modules/agents/server/params";

interface Props {
    searchParams: Promise<SearchParams>
}

const Page = async ({ searchParams }: Props) => {
    const params = await loadSearchParams(searchParams);

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/sign-in");
    }

    const queryClient = getQueryClient();

    void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions({
        ...params,
    }));

    return (
        <>
            <AgentListHeader />
            <HydrationBoundary state={dehydrate(queryClient)}>
                <Suspense fallback={<LoadingState title="Loading Agents" description="This might take a while" />}>
                    <ErrorBoundary fallback={<AgentsViewError />}>
                        <AgentsView />
                    </ErrorBoundary>
                </Suspense>

            </HydrationBoundary>
        </>

    );
};

export default Page;