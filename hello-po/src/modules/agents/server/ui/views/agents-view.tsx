"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { ErrorState } from "@/components/error-state";
import { DataTable } from "@/components/data-table";
import { columns } from "../components/columns";
import { EmptyState } from "@/components/empty-state";
import { useAgentsFilter } from "@/modules/agents/hooks/use-agents-filters";
import { DataPagination } from "../components/data-pagination";
import { useRouter } from "next/navigation";
import { LoadingState } from "@/components/loading-state";



export const AgentsView = () => {
    const router = useRouter();
    const [filters, setFilters] = useAgentsFilter();
    const trpc = useTRPC();
    const { data, isLoading, error } = useQuery(trpc.agents.getMany.queryOptions({
        ...filters,
        pageSize: 5, 
    }));

    if (isLoading) {
        return <LoadingState title="Loading Agents" description="This may take a few seconds" />;
    }

    if (error) {
        return <ErrorState title="Error Loading Agents" description="Something went wrong" />;
    }

    if (!data) {
        return <LoadingState title="Loading Agents" description="This may take a few seconds" />;
    }



    return (
        <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
            <DataTable data={data.items} columns={columns} onRowClick={( row ) => router.push(`/agents/${row.id}`)}/>
            <DataPagination page={filters.page} totalPages={data.totalPages} onPageChange={(page: number) => setFilters({ page })}/>
            {data.items.length === 0 && (
                <EmptyState title="Create your first agent" description="Create an agent to join your meetings. Each agents will follow your instructions and can interact with participates during the call." />
            )}
        </div>
    );
};

export const AgentsViewLoading = () => {
    return (
        <LoadingState title="Loading Agents" description="This may take a few seconds" />
    );
}

export const AgentsViewError = () => {
    return (
        <ErrorState title="Error Loading Agents" description="Something went wrong" />
    );
}