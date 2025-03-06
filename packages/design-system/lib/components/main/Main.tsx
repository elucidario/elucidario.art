import { useSystemProvider } from "@/provider";
import { cn } from "@/utils";
import type { MainProps } from "./types";
import { VariantProps } from "class-variance-authority";
import { mainVariants } from "./variants";

export function Main({
    variant = "default",
    children,
    className,
    ...props
}: MainProps<VariantProps<typeof mainVariants>>) {
    const { variant: _variant } = useSystemProvider();
    return (
        <main
            {...props}
            className={cn(
                mainVariants({ variant: _variant || variant, className }),
            )}
        >
            {children}
        </main>
    );
}
