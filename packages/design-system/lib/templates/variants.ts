import { cva } from "class-variance-authority";

export const layoutVariants = cva(
    [
        "h-svh",
        "bg-zinc-50",
        "text-zinc-900",
        "dark:bg-zinc-950",
        "dark:text-zinc-50",
        "grid",
    ],
    {
        variants: {
            variant: {
                default: ["grid-cols-page", "grid-rows-page"],
                landing: [
                    "lg:grid-cols-system-lg",
                    "lg:grid-rows-system-lg",
                    "lg:gap-2",

                    "md:grid-cols-system-md",
                    "md:grid-rows-system-md",
                    "md:gap-2",

                    "sm:grid-cols-system-sm",
                    "sm:grid-rows-system-sm",
                    "sm:gap-2",
                ],
                app: [],
            },
        },
        defaultVariants: {
            variant: "default",
        },
    },
);
