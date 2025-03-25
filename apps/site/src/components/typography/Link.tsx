import { cn } from "@/utils";
import { LinkProps } from "./types";
import { SquareArrowOutUpRight } from "lucide-react";

export function Link({
    href,
    className,
    active,
    children,
    external,
    ...props
}: LinkProps) {
    return (
        <a
            {...props}
            href={href}
            className={cn(
                "text-primary-dark",
                "dark:text-primary-light",

                "hover:text-secondary-dark",
                "hover:dark:text-secondary-light",

                "hover:underline",
                "underline-offset-2",

                "ring-offset-secondary-light",
                "dark:ring-offset-secondary-dark",

                "focus-visible:outline-none",
                "focus-visible:ring-2",
                "focus-visible:ring-ring",
                "focus-visible:ring-offset-2",
                "inline-block",
                ...(active
                    ? ["font-bold", "underli    e", "decoration-double"]
                    : []),
                className,
            )}
        >
            {children}
            {external && (
                <SquareArrowOutUpRight
                    className={cn("inline-block", "w-3", "h-3", "ml-1")}
                />
            )}
        </a>
    );
}
