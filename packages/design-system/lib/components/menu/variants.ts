import { cva } from "class-variance-authority";

export const menuListVariants = cva(["flex"], {
    variants: {
        dir: {
            vertical: ["flex-col"],
            horizontal: ["flex-row", "gap-2"],
        },
    },
    defaultVariants: {
        dir: "vertical",
    },
});

export const menuSeparatorVariants = cva(["bg-dark", "dark:bg-light"], {
    variants: {
        dir: {
            vertical: ["w-px", "max-h-full"],
            horizontal: ["max-w-full", "h-px"],
        },
    },
    defaultVariants: {
        dir: "vertical",
    },
});
