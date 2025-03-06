import { cn } from "@/utils";
import { Logo } from "../logo";
import { VariantProps } from "class-variance-authority";
import { HeaderProps } from "./types";
import { useSystemProvider } from "@/provider";
import { headerVariants } from "./variants";

export function Header({
    variant = "default",
    className,
}: HeaderProps<VariantProps<typeof headerVariants>>) {
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
