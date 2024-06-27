import { cn } from "@/utils";
import { FooterProps } from "@elucidario/types-design-system";
import { cva } from "class-variance-authority";

const footerVariants = cva(["px-8"], {
    variants: {
        variant: {
            default: [
                "col-start-1",
                "col-span-3",
                "row-start-3",
                "row-span-3",
                "grid",
                "grid-cols-subgrid",
                "items-center",
                "bg-lcdr-blue",
            ],
            landing: [
                "fixed",
                "h-8",
                "w-full",
                "bottom-0",
                "flex",
                "flex-row",
                "gap-4",
                "justify-end",
            ],
        },
        defaultVariants: {
            variant: "default",
        },
    },
});

export function Footer({
    variant = "default",
    children,
    className,
    ...props
}: FooterProps<typeof footerVariants>) {
    return (
        <footer
            {...props}
            className={cn(footerVariants({ variant, className }))}
        >
            {children}
        </footer>
    );
}
