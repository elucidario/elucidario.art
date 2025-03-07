import { cn } from "@/utils";
import { NavItemProps } from "./types";
import { Link } from "@/components";

export function Item({
    children,
    className,
    href,
    active,
    ...props
}: NavItemProps) {
    return (
        <li {...props} className={cn("my-1", className)}>
            {href ? (
                <Link href={href} active={active} className={cn("text-white")}>
                    {children}
                </Link>
            ) : (
                children
            )}
        </li>
    );
}
