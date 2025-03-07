import { cn } from "@/utils";

import type { ImageProps } from "./types";

export function Image({ className, ...props }: ImageProps) {
    return <img {...props} className={cn(className)} />;
}
