import { cva } from "class-variance-authority";

export const inputVariants = cva(
    [
        "h-10",
        "px-4",
        "py-2",
        "border-2",
        "rounded-md",
        "focus-visible:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-ring",
        "focus-visible:ring-offset-2",
        "disabled:border-amber-600",
    ],
    {
        variants: {
            color: {
                gray: [
                    "border-gray-45",
                    "dark:gray-85",
                    "ring-gray-45",
                    "dark:ring-gray-45",
                ],
                blue: [
                    "border-blue-55",
                    "dark:border-blue-55",
                    "ring-blue-55",
                    "dark:ring-blue-55",
                ],
                pink: [
                    "border-pink-45",
                    "dark:border-pink-45",
                    "ring-pink-45",
                    "dark:ring-pink-45",
                ],
            },
        },
        defaultVariants: {
            color: "gray",
        },
    },
);
