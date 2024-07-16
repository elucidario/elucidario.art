import { cn } from "@/utils";
import { LeadProps } from "@elucidario/types-design-system";

export function Lead({ children, className, ...props }: LeadProps) {
    return (
        <p className={cn("lead", "text-lg", "font-bold", className)} {...props}>
            {children}
        </p>
    );
}
