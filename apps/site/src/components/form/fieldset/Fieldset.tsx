import { cn } from "@/utils";

import type { FieldsetProps } from "./types";

export function Fieldset({ className, children, ...props }: FieldsetProps) {
    return (
        <fieldset {...props} className={cn("field", className)}>
            {children}
        </fieldset>
    );
}
