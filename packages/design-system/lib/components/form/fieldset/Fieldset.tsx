import { cn } from "@/utils";

import type { FieldsetProps } from "@elucidario/types-design-system";

export function Fieldset({ className, children, ...rest }: FieldsetProps) {
    return (
        <fieldset
            {...rest}
            className={cn(
                "field",
                // "mb-6",
                "grid",
                "grid-cols-subgrid",
                "content-start",
                className,
            )}
        >
            {children}
        </fieldset>
    );
}
