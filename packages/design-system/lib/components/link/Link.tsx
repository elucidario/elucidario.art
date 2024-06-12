import { cn } from "@/utils";
import { LinkProps } from "@elucidario/types-design-system";

export function Link({ href, className, active, children, ...props }: LinkProps) {
    return (
        <a
            {...props}
            href={href}
            className={cn(
                "text-lcdr-blue",
                "underline-offset-2",
                "hover:underline",
                "ring-offset-lcdr-pink",
                "focus-visible:outline-none",
                "focus-visible:ring-2",
                "focus-visible:ring-ring",
                "focus-visible:ring-offset-2",
                ...active ? ["font-bold", "underline", "decoration-double"] : [],
                className,
            )}
        >
            {children}
        </a>
    );
}
