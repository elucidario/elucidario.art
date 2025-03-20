import { motion } from "motion/react";

import { cn } from "@/utils";
import { useSystemProvider } from "@/provider";
import { Image } from "@/components";
import { useState, useEffect } from "react";
import { LogoProps } from "./types";

export function Logo({
    type,
    color,
    theme: propTheme,
    className,
    ...props
}: LogoProps) {
    const { theme: systemTheme } = useSystemProvider();
    const theme = propTheme || systemTheme;
    const [svg, setSvg] = useState<string | null>(
        `/svg/type=${type || "horizontal"}-color=${color}-theme=${theme || "light"}.svg`,
    );

    useEffect(() => {
        async function importSvg() {
            try {
                setSvg(`/svg/type=${type}-color=${color}-theme=${theme}.svg`);
            } catch (error) {
                console.error(
                    "Failed to import SVG for logo elucidario.art",
                    error,
                );
                setSvg(null);
            }
        }

        importSvg();
    }, [type, color, theme]);

    return (
        <motion.div {...props}>
            {svg && (
                <Image
                    src={svg}
                    alt="logo elucidario.art"
                    height={64}
                    className={cn(className)}
                />
            )}
        </motion.div>
    );
}
