import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { type VariantProps } from "class-variance-authority";

import { cn } from "@/utils";

import { labelVariants } from "./variants";
import { LabelProps } from "./types";

export function Label({
    ref,
    className,
    ...props
}: LabelProps<VariantProps<typeof labelVariants>>) {
    return (
        <LabelPrimitive.Root
            ref={ref}
            className={cn(labelVariants(), className)}
            {...props}
        />
    );
}
