import React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { cn } from "@/utils";

export function SelectLabel({
    ref,
    className,
    ...props
}: SelectPrimitive.SelectLabelProps & { ref?: React.Ref<HTMLDivElement> }) {
    return (
        <SelectPrimitive.Label
            ref={ref}
            className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
            {...props}
        />
    );
}
