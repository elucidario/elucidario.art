import React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { cn } from "@/utils";
import { ChevronDown, ChevronUp } from "lucide-react";

export function ScrollUpButton({
    ref,
    className,
    ...props
}: SelectPrimitive.SelectScrollUpButtonProps & {
    ref?: React.Ref<HTMLDivElement>;
}) {
    return (
        <SelectPrimitive.ScrollUpButton
            ref={ref}
            className={cn(
                "flex",
                "cursor-default",
                "items-center",
                "justify-center",
                "py-1",
                className,
            )}
            {...props}
        >
            <ChevronUp className="h-4 w-4" />
        </SelectPrimitive.ScrollUpButton>
    );
}

export function ScrollDownButton({
    ref,
    className,
    ...props
}: SelectPrimitive.SelectScrollDownButtonProps & {
    ref?: React.Ref<HTMLDivElement>;
}) {
    return (
        <SelectPrimitive.ScrollDownButton
            ref={ref}
            className={cn(
                "flex",
                "cursor-default",
                "items-center",
                "justify-center",
                "py-1",
                className,
            )}
            {...props}
        >
            <ChevronDown className="h-4 w-4" />
        </SelectPrimitive.ScrollDownButton>
    );
}

// export const ScrollDownButton = React.forwardRef<
//     React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
//     React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
// >(({ className, ...props }, ref) => );
// ScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;
