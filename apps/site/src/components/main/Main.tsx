import type { WebPage } from "schema-dts";

import { cn } from "@/utils";
import { JsonLD } from "@/components";
import type { MainProps } from "./types";

export function Main({ children, className, metadata, ...props }: MainProps) {
    return (
        <main
            {...props}
            className={cn(
                "relative",
                "z-10",
                "bg-light",
                "dark:bg-dark",
                className,
            )}
        >
            {metadata && <JsonLD<WebPage> head={true} data={metadata} />}
            {children}
        </main>
    );
}
