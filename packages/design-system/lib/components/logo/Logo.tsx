import { cn } from "@/utils";
import dark from "../../../assets/svg/type=vertical, color=pink, theme=dark.svg";
import light from "../../../assets/svg/type=vertical, color=pink, theme=light.svg";
import { LogoProps } from "@elucidario/types-design-system";
import { cva } from "class-variance-authority";
import { useSystemProvider } from "@/index";

const logoVariants = cva([], {
    variants: {
        variant: {
            landing: [
                "flex",
                "md:col-start-1",
                "md:col-span-2",
                "md:row-start-1",
                "md:row-span-2",
            ],
            app: [],
            default: [],
        },
        defaultVariants: {
            variant: "default",
        },
    },
});

export function Logo({
    variant = "default",
    className,
}: LogoProps<typeof logoVariants>) {
    const { theme, variant: _variant } = useSystemProvider();
    return (
        <div
            className={cn(
                logoVariants({ variant: _variant || variant, className }),
            )}
        >
            <img src={theme === "light" ? light : dark} alt="logo" />
        </div>
    );
}
