import { cva } from "class-variance-authority";

export const featureVariants = cva(
    [
        "feature",
        "flex",
        "gap-4",
        "relative",
        "items-center",
        "w-full",
        "h-[550px]",
        "lg:h-[750px]",
    ],
    {
        variants: {
            inverted: {
                false: ["flex-row", "justify-start", "lg:justify-end"],
                true: ["flex-row-reverse", "justify-end", "lg:justify-start"],
            },
        },
        defaultVariants: {
            inverted: false,
        },
    },
);
