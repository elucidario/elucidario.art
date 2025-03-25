import { cn } from "@/utils";

import type { ImageProps } from "./types";

export function Image({ className, loading, src, ...props }: ImageProps) {
    return (
        <img
            {...props}
            className={cn(className)}
            loading={loading || "lazy"}
            src={
                src?.includes("http")
                    ? src
                    : `${import.meta.env.BASE_URL}${src}`
            }
        />
    );
}
