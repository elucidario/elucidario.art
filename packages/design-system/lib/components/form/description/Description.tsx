import type { FieldDescriptionProps } from "@elucidario/types-design-system";

import { cn } from "@/utils";

export function Description({
    name,
    className,
    children,
    ...props
}: FieldDescriptionProps) {
    return (
        <div
            {...props}
            className={cn(
                name,
                "description",
                "text-sm",
                "text-zinc-400",
                "my-2",
                className,
            )}
        >
            <p>{children}</p>
        </div>
    );
}
