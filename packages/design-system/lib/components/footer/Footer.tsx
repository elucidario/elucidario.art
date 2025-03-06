import { useSystemProvider } from "@/provider";
import { cn } from "@/utils";
import { FooterProps } from "./types";
import { VariantProps } from "class-variance-authority";
import { footerVariants } from "@/index";

export function Footer({
    ref,
    variant = "default",
    children,
    className,
    ...props
}: FooterProps<VariantProps<typeof footerVariants>>) {
    const { variant: _variant } = useSystemProvider();

    return (
        <footer
            ref={ref}
            className={cn(
                footerVariants({ variant: _variant || variant, className }),
            )}
            {...props}
        >
            {children}
        </footer>
    );
}
