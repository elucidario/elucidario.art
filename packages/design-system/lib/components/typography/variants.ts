import { cva } from "class-variance-authority";

export const headingVariants = cva(["heading", "font-mono", "mb-4"], {
    variants: {
        level: {
            1: ["text-2xl", "md:text-4xl", "lg:text-5xl"],
            2: ["text-xl", "md:text-3xl", "lg:text-4xl"],
            3: ["text-lg", "md:text-2xl", "lg:text-3xl"],
            4: ["text-base", "md:text-xl", "lg:text-2xl"],
            5: ["text-base", "md:text-lg", "lg:text-xl"],
            6: ["text-sm", "md:text-base", "lg:text-lg"],
        },
    },
    defaultVariants: {
        level: 1,
    },
});
