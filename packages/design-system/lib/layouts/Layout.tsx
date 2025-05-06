import { useEffect } from "react";

import "@/tailwind.css";

import { cn } from "@/utils";
import { useDesignSystemActions, useTheme } from "@/store";
import { LayoutProps } from "./types";

export function Layout({ children, className }: LayoutProps) {
    const theme = useTheme();
    const { setTheme } = useDesignSystemActions();

    useEffect(() => {
        const mode = window.matchMedia("(prefers-color-scheme: dark)");

        if (mode.matches) {
            setTheme("dark");
        } else {
            setTheme("light");
        }

        mode.addEventListener("change", (e) => {
            if (e.matches) {
                setTheme("dark");
            } else {
                setTheme("light");
            }
        });
    }, [setTheme]);

    return (
        <div
            className={cn(
                theme,
                "bg-light",
                "dark:bg-dark",
                "text-dark",
                "dark:text-light",
                "h-screen",
                "w-screen",
                className,
            )}
        >
            {children}
        </div>
    );
}
