import { cn } from "@/utils";
import type { MainProps } from "@elucidario/types-design-system";
import { cva } from "class-variance-authority";

const mainVariants = cva(["main"], {
    variants: {
        variant: {
            default: [
                "row-start-2",
                "col-start-2",
                "col-span-2",
                "grid",
                "grid-cols-subgrid",
                "py-4",
            ],
            landing: ["relative", "-mt-[52px]"],
        },
        defaultVariants: {
            variant: "default",
        },
    },
});

export function Main({
    variant = "default",
    children,
    className,
    ...props
}: MainProps<typeof mainVariants>) {
    return (
        <main {...props} className={cn(mainVariants({ variant, className }))}>
            {children}
        </main>
    );
}
