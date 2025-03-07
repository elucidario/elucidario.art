import { cn } from "@/utils";
import { FooterProps } from "./types";

export function Footer({ ref, children, className, ...props }: FooterProps) {
    return (
        <footer ref={ref} className={cn(className)} {...props}>
            {children}
        </footer>
    );
}
