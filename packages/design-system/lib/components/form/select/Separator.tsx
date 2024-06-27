import React from "react";
import { Separator as PrimitiveSeparator } from "@radix-ui/react-select";
import { cn } from "@/utils";

export const SelectSeparator = React.forwardRef<
    React.ElementRef<typeof PrimitiveSeparator>,
    React.ComponentPropsWithoutRef<typeof PrimitiveSeparator>
>(({ className, ...props }, ref) => (
    <PrimitiveSeparator
        ref={ref}
        className={cn(
            "-mx-1 my-1 h-px bg-zinc-100 dark:bg-zinc-800",
            className,
        )}
        {...props}
    />
));
SelectSeparator.displayName = PrimitiveSeparator.displayName;
