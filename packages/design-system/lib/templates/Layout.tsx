import { useSystemProvider } from "@/provider";
import { cn } from "@/utils";
import { LayoutProps } from "./types";
import { VariantProps } from "class-variance-authority";
import { layoutVariants } from "./variants";

export function Layout({
    variant = "default",
    className,
    children,
    ...props
}: LayoutProps<VariantProps<typeof layoutVariants>>) {
    const { variant: _variant } = useSystemProvider();
    return (
        <div
            {...props}
            className={cn(
                layoutVariants({
                    variant: _variant || variant,
                    className,
                }),
            )}
        >
            {children}
        </div>
    );
}
