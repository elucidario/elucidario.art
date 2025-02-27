import { useSystemProvider } from "@/provider";
import { cn } from "@/utils";
import { FooterProps } from "@elucidario/types-design-system";
import { cva } from "class-variance-authority";

const footerVariants = cva([], {
    variants: {
        variant: {
            app: [],
            landing: [
                "z-10",
                "flex",
                "flex-row",
                "gap-4",
                "justify-end",
                "items-end",
                "p-4",

                "col-start-3",
                "col-span-1",
                "row-start-9",
                "row-span-1",

                "md:items-start ",
                "md:p-0",
                "md:col-start-5",
                "md:col-span-1",
                "md:row-start-9",
                "md:row-span-1",

                "lg:col-start-8",
                "lg:col-span-1",
                "lg:row-start-9",
                "lg:row-span-1",
            ],
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
    const { variant: _variant } = useSystemProvider();

    return (
        <footer
            {...props}
            className={cn(
                footerVariants({ variant: _variant || variant, className }),
            )}
        >
            {children}
        </footer>
    );
}
