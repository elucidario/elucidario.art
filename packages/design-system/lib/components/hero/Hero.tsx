import { HeroProps } from "@elucidario/types-design-system";

import { cn } from "@/utils";
import { RadialBG } from "@/components";

export function Hero({ className, children, ...props }: HeroProps) {
    return (
        <section
            className={cn(
                "hero",
                "h-[--middle-height]",
                "max-w-7xl",
                "mx-auto",
                "grid",
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

                    "h-full",
                    "w-full",

                    "grid",
                    "grid-cols-subgrid",
                    "grid-rows-subgrid",
                    "z-10",
                    "items-center",
                    "justify-between",
                )}
            >
                {children}
            </div>
        </section>
    );
}
