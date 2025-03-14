import { cva } from "class-variance-authority";

export const buttonVariants = cva(
    [
        "cursor-pointer",
        "inline-flex",
        "items-center",
        "justify-center",
        "whitespace-nowrap",
        "font-medium",
        "transition-colors",
        "ring-offset-secondary-light",
        "focus-visible:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-ring",
        "focus-visible:ring-offset-2",
        "disabled:pointer-events-none",
        "disabled:opacity-50",
        // "rounded",
    ],
    {
        variants: {
            variant: {
                default: ["shadow-lg"],
                pb: [
                    "shadow-lg",

                    "bg-dark",
                    "dark:bg-light",
                    "hover:bg-light",
                    "dark:hover:bg-dark",

                    "text-light",
                    "hover:text-dark",
                    "dark:text-dark",
                    "dark:hover:text-light",
                ],
                destructive: [
                    "bg-red-500",
                    "text-white",
                    "hover:bg-red-500/80",
                ],
                outline: [
                    "border",
                    "border-dark",
                    "dark:border-light",
                    "hover:bg-zinc-800",
                    "bg-light/70",
                    "dark:bg-dark/70",
                ],
                ghost: [
                    "bg-zinc-700/40",
                    "hover:bg-zinc-800/40",

                    "dark:bg-zinc-300/40",
                    "dark:hover:bg-zinc-100/40",
                ],
                link: ["text-primary", "underline-offset-4", "hover:underline"],
                icon: "h-10 w-10",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 px-3 text-sm",
                lg: "h-11 px-8 text-lg",
                link: [],
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
);
