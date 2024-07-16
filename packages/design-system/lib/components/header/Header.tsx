import { cn } from "@/utils";
import { Logo } from "../logo";
import { cva } from "class-variance-authority";
import { HeaderProps } from "@elucidario/types-design-system";
import { useSystemProvider } from "@/provider";

const headerVariants = cva([], {
    variants: {
        variant: {
            landing: [
                "z-10",
                "self-center",
                "grid",
                "grid-cols-subgrid",
                "grid-rows-subgrid",

                "col-start-2",
                "col-span-2",
                "row-start-2",
                "row-span-2",

                "md:col-start-2",
                "md:col-span-4",
                "md:row-start-2",
                "md:row-span-2",

                "lg:col-start-3",
                "lg:col-span-6",
                "lg:row-start-2",
                "lg:row-span-2",
            ],
            app: [],
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
    const { variant: _variant } = useSystemProvider();
    return (
        <header
            className={cn(
                headerVariants({ variant: _variant || variant, className }),
            )}
        >
            <Logo variant={variant} />
        </header>
    );
}
