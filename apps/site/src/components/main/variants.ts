import { cva } from "class-variance-authority";

export const mainVariants = cva(["main"], {
    variants: {
        variant: {
            app: [],
            landing: [
                "landing",
                "grid",
                "grid-cols-subgrid",
                "grid-rows-subgrid",

                "col-start-2",
                "col-span-2",
                "row-start-3",
                "row-span-7",

                "md:col-start-2",
                "md:col-span-4",
                "md:row-start-3",
                "md:row-span-6",

                "lg:col-start-3",
                "lg:col-span-6",
                "lg:row-start-3",
                "lg:row-span-6",
            ],
            default: [
                "row-start-2",
                "col-start-2",
                "col-span-2",
                "grid",
                "grid-cols-subgrid",
                "py-4",
            ],
        },
        defaultVariants: {
            variant: "default",
        },
    },
});
