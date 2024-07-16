import { cn } from "@/utils";

import type { ImageProps } from "@elucidario/types-design-system";

export function Image({ className, ...props }: ImageProps) {
    return <img {...props} className={cn(className)} />;
}
