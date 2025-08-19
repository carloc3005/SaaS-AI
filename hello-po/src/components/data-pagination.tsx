import { Button } from "@/components/ui/button";

interface Props {
    page: number;
    totalPages: number;
    total?: number;
    pageSize?: number;
    onPageChange: (page: number) => void;
}

export const DataPagination = ({
    page,
    totalPages,
    total,
    pageSize = 10,
    onPageChange
}: Props) => {
    const startItem = (page - 1) * pageSize + 1;
    const endItem = Math.min(page * pageSize, total || 0);
    
    return (
        <div className="flex items-center justify-between">
            <div className="flex-1 text-sm text-muted-foreground">
                {total ? (
                    <>Showing {startItem}-{endItem} of {total} results</>
                ) : (
                    <>Page {page} of {totalPages || 1}</>
                )}
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button disabled={page === 1} variant="outline" size="sm" onClick={() => onPageChange(Math.max(1, page - 1))}>
                    Previous
                </Button>
                <Button disabled={page === totalPages || totalPages === 0} variant="outline" size="sm" onClick={() => onPageChange(Math.min(totalPages, page + 1))}>
                    Next
                </Button>
            </div>
        </div>
    );
}