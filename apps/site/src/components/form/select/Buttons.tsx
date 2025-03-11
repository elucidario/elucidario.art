import React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { cn } from "@/utils";
import { ChevronDown, ChevronUp } from "lucide-react";

export const ScrollUpButton = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
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
));
ScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

export const ScrollDownButton = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
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
));
ScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;
