import { VariantProps } from "class-variance-authority";
import { LinkProps } from "./types";
import { buttonVariants } from "@/components";
import { cn } from "@/utils";

export function Link({
    href,
    className,
    children,

    //buttonVariants
    variant = "link",
    color,
    size = "md",
    icon = false,
    active,

    ...props
}: LinkProps & VariantProps<typeof buttonVariants>) {
    return (
        <a
            href={href}
            className={cn(
                buttonVariants({
                    className,
                    variant,
                    color,
                    size,
                    icon,
                    active,
                }),
            )}
            {...props}
        >
            {children}
        </a>
    );
}
