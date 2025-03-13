import { cn } from "@/utils";
import { useSystemProvider } from "@/provider";
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
    const [svg, setSvg] = useState<string | null>(null);

    useEffect(() => {
        async function importSvg() {
            try {
                const module = await import(
                    `../../assets/svg/type=${type}, color=${color}, theme=${theme}.svg`
                );
                setSvg(module.default);
            } catch (error) {
                console.error("Erro ao importar SVG:", error);
                setSvg(null);
            }
        }

        importSvg();
    }, [type, color, theme]);

    return (
        <div {...props}>
            {svg && (
                <img
                    src={svg}
                    alt="logo elucidario.art"
                    className={cn(className)}
                />
            )}
        </div>
    );
}
