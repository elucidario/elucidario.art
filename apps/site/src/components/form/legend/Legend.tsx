import type { LegendProps } from "./types";
import { cn } from "@/utils";

export const Legend = ({ children, ...legendProps }: LegendProps) => {
    return (
        <legend
            {...legendProps}
            className={cn(
                "label",
                "font-bold",
                "mb-3",

                "text-black",
                "dark:text-white",
            )}
        >
            {children}
        </legend>
    );
};
