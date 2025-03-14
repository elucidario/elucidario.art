import { cva } from "class-variance-authority";

export const headerVariants = cva(
    [
        "mb-14",
        "px-4",
        "sticky",
        "top-0",
        "flex",
        "flex-col",
        "gap-8",
        "items-center",
        "justify-between",
        "z-20",
    ],
    {
        variants: {
            color: {
                primary: "text-primary",
                secondary: "text-secondary",
            },
            type: {
                horizontal: [],
                vertical: [],
            },
            theme: {
                light: [],
                dark: [],
            },
        },
        defaultVariants: {
            color: "primary",
            type: "horizontal",
            theme: "light",
        },
    },
);
