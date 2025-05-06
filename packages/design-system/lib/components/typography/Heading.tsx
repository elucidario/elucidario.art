import { createElement } from "react";

import { HeadingProps } from "./types";
import { cn } from "@/utils";
import { headingVariants } from "./variants";

export function Heading({
    level = 1,
    children,
    className,
    ...props
}: HeadingProps) {
    return createElement(
        `h${level}`,
        {
            className: cn(headingVariants({ level, className })),
            ...props,
        },
        children,
    );
}
