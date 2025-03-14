import { Logo } from "@/components";
import { useSystemProvider } from "@/provider";
import { cn } from "@/utils";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useRef, useState } from "react";
import { HeaderProps } from "./types";
import { VariantProps } from "class-variance-authority";
import { headerVariants } from "./variants";

export function Header({
    className,
    theme: propTheme,
    color = "primary",
    type = "horizontal",
    ...props
}: HeaderProps<VariantProps<typeof headerVariants>>) {
    const { theme: systemTheme } = useSystemProvider();
    const theme = propTheme || systemTheme || "light";

    const headingRef = useRef<HTMLDivElement>(null);

    const [y, setY] = useState(0);

    const { scrollY } = useScroll({
        target: headingRef,
        offset: ["end end", "start start"],
    });

    useMotionValueEvent(scrollY, "change", (latest) => {
        setY(Math.max(Math.min(latest, Math.max(0, 100)), Math.min(0, 100)));
    });

    return (
        <motion.header
            ref={headingRef}
            className={cn(headerVariants({ color, type, className }))}
            {...props}
        >
            <div
                className={cn("absolute", "-z-10", "w-full", "h-full")}
                style={{
                    background: `radial-gradient(transparent 1px, var(--color-${color}-${theme}, #ffffff) 2px) 0 0 / 8px 8px`,
                    filter: "blur(0.5px)",
                    mask: "linear-gradient( rgba(0, 0, 0) 10%, rgb(0, 0, 0, 0) 90%)",
                    opacity: 0.5,
                }}
            ></div>
            <Logo
                type={type}
                theme={theme}
                color={color}
                className={cn(
                    "max-w-[250px]",
                    "lg:max-w-[500px]",
                    "relative",
                    "mt-6",
                    "mb-10",
                )}
                animate={{
                    scale: (1 - y / 100) * 0.5 + 0.8,
                }}
            />
        </motion.header>
    );
}
