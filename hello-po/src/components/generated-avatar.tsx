import { createAvatar } from "@dicebear/core";
import { botttsNeutral, initials } from "@dicebear/collection";


import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface GeneratedAvatarProps {
    seed: string;
    className?: string;
    variant: "botttsNeutral" | "initials";
}

export const GeneratedAvatar = ({
    seed,
    className,
    variant
} : GeneratedAvatarProps ) => {
    // Ensure we have a valid seed
    const validSeed = seed || "User";
    let avatar;

    if (variant === "botttsNeutral") {
        avatar = createAvatar(botttsNeutral, {
            seed: validSeed,
        })
    } else {
        avatar = createAvatar(initials, {
            seed: validSeed,
            fontWeight: 500, 
            fontSize: 42,
            textColor: ["000000"], 
            backgroundColor: ["ffffff"], 
        });
    }

    return (
        <Avatar className={cn(className)}>
            <AvatarImage src={avatar.toDataUri()} alt="Avatar"/>
            <AvatarFallback className="text-black bg-white">
                {validSeed.charAt(0).toUpperCase()}
            </AvatarFallback>
        </Avatar>
    )
};