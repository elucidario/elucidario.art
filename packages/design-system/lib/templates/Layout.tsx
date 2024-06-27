import { cn } from "@/utils";
import { LayoutProps } from "@elucidario/types-design-system";
import { cva } from "class-variance-authority";

const layoutVariants = cva(
    ["bg-zinc-50", "text-zinc-900", "dark:bg-zinc-950", "dark:text-zinc-50"],
    {
        variants: {
            variant: {
                default: ["grid", "grid-cols-page", "grid-rows-page"],
                landing: ["h-svh"]
            },
        },
        defaultVariants: {
            variant: "default",
        },
    },
);

export function Layout({
    variant = "default",
    className,
    children,
    ...props
}: LayoutProps<typeof layoutVariants>) {
    return (
        <div {...props} className={cn(layoutVariants({ variant, className }))}>
            {children}
        </div>
    );
}
