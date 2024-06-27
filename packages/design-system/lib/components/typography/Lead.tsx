import { cn } from "@/utils";
import { LeadProps } from "@elucidario/types-design-system";

export function Lead({ children, className, ...props }: LeadProps) {
    return (
        <p className={cn("lead", "text-lg", className)} {...props}>
            {children}
        </p>
    );
}
