import { cva } from "class-variance-authority";

export const logoVariants = cva([], {
    variants: {
        variant: {
            landing: [
                "flex",
                "md:col-start-1",
                "md:col-span-2",
                "md:row-start-1",
                "md:row-span-2",
            ],
            app: [],
            default: [],
        },
        defaultVariants: {
            variant: "default",
        },
    },
});
