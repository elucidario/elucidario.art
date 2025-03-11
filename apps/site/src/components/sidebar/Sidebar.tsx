import { cn } from "@/utils";

import type { SidebarProps } from "./types";
import { useMemo } from "react";

export function Sidebar({
    children,
    className,
    variant,
    ...props
}: SidebarProps) {
    console.log("Sidebar", { children });

    // default variant is left
    const classNames = useMemo(
        () =>
            variant === "right"
                ? ["sidebar-right", "col-start-2", "col-span-1"]
                : [
                      "sidebar-left",
                      "row-start-2",
                      "col-start-1",
                      "col-span-1",
                      "px-8",
                      "py-4",
                  ],
        [variant],
    );

    return (
        <aside {...props} className={cn(...classNames, className)}>
            {children}
        </aside>
    );
}
