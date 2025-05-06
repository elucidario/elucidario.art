import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/utils";
import { ButtonProps } from "./types";
import { buttonVariants } from "./variants";

export function Button({
    ref,
    className,
    asChild = false,

    // buttonVariants
    variant,
    size,
    icon,
    color,
    active,

    ...props
}: ButtonProps) {
    const Comp = asChild ? Slot : "button";
    return (
        <Comp
            ref={ref}
            className={cn(
                buttonVariants({
                    variant,
                    icon,
                    size,
                    color,
                    active,
                    className,
                }),
            )}
            {...props}
        />
    );
}
