import { cva } from "class-variance-authority";

export const inputVariants = cva(
    ["flex", "h-10", "w-full", "px-3", "py-2", "border", "rounded"],
    {
        variants: {
            variant: {
                default: [
                    // pallete
                    "border-zinc-400",
                    "bg-zinc-300",
                    "ring-offset-zinc-100",
                    "placeholder:text-zinc-500",
                    "focus-visible:ring-zinc-950",
                    "text-black",

                    "dark:border-zinc-700",
                    "dark:bg-zinc-800",
                    "dark:ring-offset-zinc-950",
                    "dark:placeholder:text-zinc-400",
                    "dark:focus-visible:ring-zinc-300",
                    "dark:text-white",

                    // box
                    "border-2",

                    "file:border-0",
                    "file:bg-transparent",
                    "file:text-sm",
                    "file:font-medium",

                    // states
                    "focus-visible:outline-none",
                    "focus-visible:ring-2",
                    "focus-visible:ring-offset-2",
                    "disabled:cursor-not-allowed",
                    "disabled:opacity-50",
                    "read-only:opacity-70",
                ],
                outline: [
                    "border-zinc-400",
                    "ring-zinc-400",
                    "bg-transparent",

                    "dark:border-zinc-700",
                    "dark:ring-zinc-700",

                    "border-2",

                    "file:border-0",
                    "file:bg-transparent",
                    "file:text-sm",
                    "file:font-medium",

                    // states
                    "focus-visible:outline-none",
                    "focus-visible:ring-2",
                    "focus-visible:ring-offset-2",
                    "disabled:cursor-not-allowed",
                    "disabled:opacity-50",
                    "read-only:opacity-70",
                ],
                ghost: [
                    "border-transparent",
                    "bg-zinc-300/30",
                    "ring-offset-zinc-100",
                    "placeholder:text-zinc-700",

                    "file:border-0",
                    "file:bg-transparent",
                    "file:text-sm",
                    "file:font-medium",

                    "dark:bg-zinc-900/40",
                    "dark:placeholder:text-zinc-400",

                    // states
                    "focus-visible:outline-none",
                    "focus-visible:ring-2",
                    "focus-visible:ring-offset-2",
                    "disabled:cursor-not-allowed",
                    "disabled:opacity-50",
                    "read-only:opacity-70",
                ],
            },
        },
        defaultVariants: {
            variant: "default",
        },
    },
);
