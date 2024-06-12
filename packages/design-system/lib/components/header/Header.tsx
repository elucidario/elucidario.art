import { cn } from "@/utils";
import { Logo } from "../logo";
import { cva } from "class-variance-authority";
import { HeaderProps } from "@elucidario/types-design-system";

const headerVariants = cva([], {
    variants: {
        variant: {
            default: [
                "py-1",
                "px-8",
                "grid",
                "grid-cols-subgrid",
                "items-center",
                "row-start-1",
                "row-span-1",
                "col-start-1",
                "col-span-3",
            ],
            landing: [
                "max-w-7xl",
                "h-[128px]",
                "pt-2",
                "mx-auto",
                "sticky",
                "top-0",
                "z-10",
            ],
        },
        defaultVariants: {
            variant: "default",
        },
    },
});

export function Header({
    variant = "default",
    className,
}: HeaderProps<typeof headerVariants>) {
    return (
        <header className={cn(headerVariants({ variant, className }))}>
            <Logo variant={variant} />
        </header>
    );
}
