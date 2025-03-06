import { cn } from "@/utils";
import dark from "../../../assets/svg/type=vertical, color=pink, theme=dark.svg";
import light from "../../../assets/svg/type=vertical, color=pink, theme=light.svg";
import { LogoProps } from "./types";
import { VariantProps } from "class-variance-authority";
import { useSystemProvider } from "@/index";
import { logoVariants } from "./variants";

export function Logo({
    variant = "default",
    className,
}: LogoProps<VariantProps<typeof logoVariants>>) {
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
