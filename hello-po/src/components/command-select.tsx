import { ReactNode, useState } from "react";
import { ChevronsUpDown, ChevronsUpDownIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { CommandEmpty, CommandInput, CommandItem, CommandList, CommandResponsiveDialog } from "@/components/ui/command";

interface Props {
    options?: Array<{
        id: string;
        value: string;
        children: ReactNode;
    }>;
    onSelect: (value: string) => void;
    queryOptions?: (search: string) => any; // tRPC query options
    value: string;
    placeholder?: string;
    className?: string;
    mapResults?: (data: any) => Array<{
        id: string;
        value: string;
        children: ReactNode;
    }>;
};

export const CommandSelect = ({
    options: staticOptions,
    onSelect,
    queryOptions,
    mapResults,
    value,
    placeholder = "Select an option",
    className,
}: Props) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedOptionCache, setSelectedOptionCache] = useState<{
        id: string;
        value: string;
        children: ReactNode;
    } | null>(null);

    const handleOpenChange = (open: boolean) => {
        setSearch("");
        setOpen(open);
    };

    // Use React Query for search when queryOptions is provided
    const queryOptionsForSearch = queryOptions && open ? queryOptions(search) : null;
    const { data: searchResults, isLoading } = useQuery({
        queryKey: ['command-select-fallback'],
        queryFn: () => Promise.resolve(null),
        staleTime: 30000,
        ...queryOptionsForSearch,
        enabled: open && !!queryOptions && !!queryOptionsForSearch?.queryFn,
    });

    // Process search results using mapResults function if provided
    const processedResults = searchResults && mapResults ? mapResults(searchResults) : undefined;

    // Use search results if available, otherwise fall back to static options
    const options = processedResults || staticOptions || [];
    
    // Try to find selected option from current options first, then from cache
    const selectedOption = options.find((option) => option.value === value) || 
                          (selectedOptionCache?.value === value ? selectedOptionCache : null);

    // Cache the selected option when found in current options
    if (options.length > 0) {
        const foundOption = options.find((option) => option.value === value);
        if (foundOption && foundOption.value === value) {
            setSelectedOptionCache(foundOption);
        }
    }

    // Display option: prefer from current options, fallback to static options, then cache
    const displayOption = options.find((option) => option.value === value) || 
                          (staticOptions?.find((option) => option.value === value)) ||
                          (selectedOptionCache?.value === value ? selectedOptionCache : null);

    return (
        <>
            <Button 
                type="button" 
                variant="outline" 
                className={cn("h-9 justify-between font-normal px-2", !displayOption && "text-muted-foreground", className,)}
                onClick={() => setOpen(true)}
            >
                <div>
                    {displayOption?.children ?? placeholder}
                </div>
                <ChevronsUpDownIcon />
            </Button>
            <CommandResponsiveDialog open={open} onOpenChange={handleOpenChange} shouldFilter={false}>
                <CommandInput placeholder="Search..." onValueChange={setSearch}/>
                <CommandList>
                    <CommandEmpty>
                        <span className="text-muted-foreground text-sm">
                            {isLoading ? "Loading..." : "No options found"}
                        </span>
                    </CommandEmpty>
                    {options.map((option) => (
                        <CommandItem key={option.id} onSelect={() => {
                            setSelectedOptionCache(option);
                            onSelect(option.value); 
                            setOpen(false);
                        }}>
                            {option.children}
                        </CommandItem>
                    ))}
                </CommandList>

            </CommandResponsiveDialog>
        </>
    )
}