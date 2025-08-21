import { GeneratedAvatar } from "@/components/generated-avatar";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDownIcon, CreditCardIcon, LogOut, LogOutIcon, Settings, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const DashboardUserButton = () => {
    const { data, isPending, error } = authClient.useSession();
    const router = useRouter();
    const isMobile = useIsMobile();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // If there's an auth error, redirect to sign-in
    if (error) {
        router.push("/sign-in");
        return null;
    }

    const onLogout = async () => {
        setIsLoggingOut(true);
        try {
            await authClient.signOut({
                fetchOptions: {
                    onSuccess: () => {
                        router.push("/sign-in");
                    },
                    onError: (ctx) => {
                        console.error("Logout failed:", ctx.error);
                        // Even if logout fails on server, clear client state and redirect
                        router.push("/sign-in");
                    }
                }
            });
        } catch (error) {
            console.error("Logout failed:", error);
            // Even if logout fails, redirect to sign-in page
            router.push("/sign-in");
        } finally {
            setIsLoggingOut(false);
        }
    }

    if (isPending) {
        return (
            <div className="rounded-lg border-border/10 p-3 w-full flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-2">
                    <div className="size-9 rounded-full bg-white/10 animate-pulse" />
                    <div className="flex flex-col gap-1">
                        <div className="h-3 w-16 bg-white/10 rounded animate-pulse" />
                        <div className="h-3 w-24 bg-white/10 rounded animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    if (!data?.user) {
        return (
            <button 
                onClick={() => router.push("/sign-in")}
                className="rounded-lg border-border/10 p-3 w-full flex items-center justify-between bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
            >
                <div className="flex items-center gap-2">
                    <GeneratedAvatar seed="Guest User" variant="initials" className="size-9" />
                    <div className="flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0">
                        <p className="text-sm truncate w-full">Guest User</p>
                        <p className="text-xs truncate w-full">Click to sign in</p>
                    </div>
                </div>
                <ChevronDownIcon className="size-4 shrink-0" />
            </button>
        );
    }

    // Ensure we have a name to work with
    const userName = data.user.name || data.user.email || "User";
    const userEmail = data.user.email || "No email";

    if (isMobile) {
        return (
            <Drawer>
                <DrawerTrigger asChild>
                    <button className="rounded-lg border-border/10 p-3 w-full flex items-center justify-between
                    bg-white/5 hover:bg-white/10 overflow-hidden gap-x-2 cursor-pointer">
                        {data.user.image ? (
                            <Avatar>
                                <AvatarImage src={data.user.image} />
                            </Avatar>
                        ) : (
                            <GeneratedAvatar seed={userName} variant="initials" className="size-9" />
                        )}
                        <div className="flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0">
                            <p className="text-sm truncate w-full ">
                                {userName}
                            </p>
                            <p className="text-xs truncate w-full">
                                {userEmail}
                            </p>
                        </div>
                        <ChevronDownIcon className="size-4 shrink-0" />
                    </button>
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>{userName}</DrawerTitle>
                        <DrawerDescription>{userEmail}</DrawerDescription>
                    </DrawerHeader>
                    <DrawerFooter>
                        <Button variant="outline" onClick={() => { router.push("/settings") }}>
                            <Settings className="size-4 text-black" /> 
                            Settings
                        </Button>
                        <Button variant="outline" onClick={() => { }}>
                            <CreditCardIcon className="size-4 text-black" /> 
                            Billing
                        </Button>
                        <Button variant="outline" onClick={onLogout} disabled={isLoggingOut}>
                            <LogOutIcon className="size-4 text-black" />
                            {isLoggingOut ? "Logging out..." : "Logout"}
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        )
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="rounded-lg border-border/10 p-3 w-full flex items-center justify-between
                bg-white/5 hover:bg-white/10 focus:bg-white/10 overflow-hidden gap-x-2 cursor-pointer">
                    {data.user.image ? (
                        <Avatar>
                            <AvatarImage src={data.user.image} />
                        </Avatar>
                    ) : (
                        <GeneratedAvatar seed={userName} variant="initials" className="size-9" />
                    )}
                    <div className="flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0">
                        <p className="text-sm truncate w-full ">
                            {userName}
                        </p>
                        <p className="text-xs truncate w-full">
                            {userEmail}
                        </p>
                    </div>
                    <ChevronDownIcon className="size-4 shrink-0" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="right" className="w-72">
                <DropdownMenuLabel>
                    <div className="flex flex-col gap-1 ">
                        <span className="font-medium truncate">
                            {userName}
                        </span>
                        <span className="text-sm font-normal text-muted-foreground truncate">
                            {userEmail}
                        </span>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/settings")} className="cursor-pointer flex items-center justify-between">
                    Settings
                    <Settings className="size-4" />
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer flex items-center justify-between">
                    Billing
                    <CreditCardIcon className="size-4" />
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onLogout} className="cursor-pointer flex items-center justify-between" disabled={isLoggingOut}>
                    {isLoggingOut ? "Logging out..." : "Logout"}
                    <LogOutIcon className="size-4" />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}