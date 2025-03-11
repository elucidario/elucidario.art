import type { DescriptionProps } from "./types";

import { cn } from "@/utils";

export function Description({
    className,
    children,
    ...props
}: DescriptionProps) {
    return (
        <div
            {...props}
            className={cn(
                "description",
                "text-sm",
                "text-zinc-400",
                "my-2",
                className,
            )}
        >
            <p>{children}</p>
        </div>
    );
}
