import { cn } from "@/utils";
import { NavListProps } from "@elucidario/types-design-system";
import { Context } from "./Context";
import { useContext } from "react";

export function List({
    id,
    name,
    className,
    children,
    ...props
}: NavListProps) {
    const { expanded } = useContext(Context);

    return (
        <ul
            id={name || id || undefined}
            {...props}
            className={cn(
                "nav-list",
                ...(name
                    ? ["peer-aria-expanded/toggle:ml-6"]
                    : [""]),
                name ? !expanded.includes(name) && "hidden" : "",
                className,
            )}
        >
            {children}
        </ul>
    );
}
