import { cva } from "class-variance-authority";

export const buttonVariants = cva(
    [
        "inline-flex",
        "items-center",
        "justify-center",
        "whitespace-nowrap",
        "font-medium",
        "transition-colors",
        "ring-offset-lcdr-pink",
        "focus-visible:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-ring",
        "focus-visible:ring-offset-2",
        "disabled:pointer-events-none",
        "disabled:opacity-50",
        "rounded",
    ],
    {
        variants: {
            variant: {
                default: [
                    "bg-lcdr-blue",
                    "text-white",
                    "hover:bg-lcdr-blue/80",
                ],
                destructive: [
                    "bg-red-500",
                    "text-white",
                    "hover:bg-red-500/80",
                ],
                outline: ["border", "border-input", "hover:bg-zinc-800"],
                secondary: [
                    "bg-lcdr-pink",
                    "text-white",
                    "hover:bg-lcdr-pink/80",
                ],
                ghost: [
                    "bg-zinc-700/40",
                    "hover:bg-zinc-800/40",

                    "dark:bg-zinc-300/40",
                    "dark:hover:bg-zinc-100/40",
                ],
                link: [
                    "text-lcdr-blue",
                    "underline-offset-4",
                    "hover:underline",
                ],
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 px-3 text-sm",
                lg: "h-11 px-8 text-lg",
                link: "",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
);
