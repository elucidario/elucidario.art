import { cn } from "@/utils";
import type { MainProps } from "./types";

export function Main({ children, className, ...props }: MainProps) {
    return (
        <main {...props} className={cn(className)}>
            {children}
        </main>
    );
}
