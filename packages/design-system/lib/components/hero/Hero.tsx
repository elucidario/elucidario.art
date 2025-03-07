import { HeroProps } from "./types";

import { cn } from "@/utils";
import { RadialBG } from "@/components";

export function Hero({ className, children, ...props }: HeroProps) {
    return (
        <section
            className={cn(
                "hero",
                "col-start-1",
                "col-span-full",
                "row-start-1",
                "row-span-full",
                "grid",
                "grid-cols-subgrid",
                "grid-rows-subgrid",
                className,
            )}
            {...props}
        >
            <RadialBG
                className={cn(
                    "col-start-1",
                    "col-span-full",
                    "row-start-1",
                    "row-span-full",
                )}
            />
            <div
                className={cn(
                    "content",
                    "col-start-1",
                    "col-span-full",
                    "row-start-1",
                    "row-span-full",

                    "grid",
                    "grid-cols-subgrid",
                    "grid-rows-subgrid",
                    "z-10",
                )}
            >
                {children}
            </div>
        </section>
    );
}
