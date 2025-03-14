import { cn } from "@/utils";
import { LeadProps } from "./types";

export function Lead({ children, className, ...props }: LeadProps) {
    return (
        <p className={cn("lead", "text-lg", "font-bold", className)} {...props}>
            {children}
        </p>
    );
}
