import React from "react";
import {
    Separator as PrimitiveSeparator,
    SelectSeparatorProps,
} from "@radix-ui/react-select";
import { cn } from "@/utils";

export function SelectSeparator({
    ref,
    className,
    ...props
}: SelectSeparatorProps & { ref?: React.Ref<HTMLDivElement> }) {
    return (
        <PrimitiveSeparator
            ref={ref}
            className={cn(
                "-mx-1 my-1 h-px bg-zinc-100 dark:bg-zinc-800",
                className,
            )}
            {...props}
        />
    );
}
