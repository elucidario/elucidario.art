import { cn } from "@/utils";

import type { ImageProps } from "./types";

export function Image({ className, loading, ...props }: ImageProps) {
    return (
        <img {...props} className={cn(className)} loading={loading || "lazy"} />
    );
}
