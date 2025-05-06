import { cn } from "@/utils";
import { TextProps } from "./types";

export function Text({ className, children, ...props }: TextProps) {
    return (
        <p className={cn(className)} {...props}>
            {children}
        </p>
    );
}
