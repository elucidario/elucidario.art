import { cn } from "@/utils";
import dark from "../../../assets/svg/type=vertical, color=pink, theme=dark.svg";
import light from "../../../assets/svg/type=vertical, color=pink, theme=light.svg";
import { LogoProps } from "@elucidario/types-design-system";
import { cva } from "class-variance-authority";
import { useSystemProvider } from "@/index";

const logoVariants = cva(["max-h-32"], {
    variants: {
        variant: {
            default: ["h-[72px]"],
            landing: ["h-[128px]"],
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
    const { theme } = useSystemProvider();

    return (
        <div className={cn("h-full")}>
            <img
                className={cn(logoVariants({ variant, className }))}
                src={theme === "light" ? light : dark}
                alt="logo"
            />
        </div>
    );
}
