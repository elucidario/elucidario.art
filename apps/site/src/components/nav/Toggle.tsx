import { cn } from "@/utils";
import type { NavToggleProps } from "./types";

import { Button } from "@/components/button";
import { ChevronDown } from "lucide-react";
import { useContext } from "react";
import { Context } from "./Context";

export function Toggle({
    name,
    className,
    icon,
    children,
    ...props
}: NavToggleProps) {
    const { expanded, setExpanded } = useContext(Context);
    return (
        <Button
            variant={"link"}
            size={"link"}
            type="button"
            aria-controls={name}
            aria-expanded={expanded.includes(name)}
            onClick={() => setExpanded?.(name)}
            {...props}
            className={cn("nav-toggle", "peer/toggle", "text-white", className)}
        >
            {icon ? (
                <>
                    <ChevronDown
                        size={16}
                        className={cn(!expanded.includes(name) && "-rotate-90")}
                    />
                    {children}
                </>
            ) : (
                children
            )}
        </Button>
    );
}
