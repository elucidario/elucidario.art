import { cva } from "class-variance-authority";

export const buttonVariants = cva(
    [
        "cursor-pointer",

        "inline-flex",
        "items-center",
        "justify-center",
        "rounded-md",

        "whitespace-nowrap",

        "font-medium",

        "transition-colors",

        "focus-visible:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-ring",
        "focus-visible:ring-offset-2",

        "disabled:pointer-events-none",
        "disabled:opacity-50",
    ],
    {
        variants: {
            color: {
                blue: [
                    "bg-blue-75",
                    "text-dark",
                    "hover:bg-blue-55",
                    "ring-blue-45",
                    "ring-offset-light",

                    "dark:bg-blue-45",
                    "dark:text-light",
                    "dark:hover:bg-blue-35",
                    "dark:ring-blue-55",
                    "dark:ring-offset-dark",
                ],
                pink: [
                    "bg-pink-75",
                    "text-dark",
                    "hover:bg-pink-55",
                    "ring-pink-45",
                    "ring-offset-light",

                    "dark:bg-pink-45",
                    "dark:text-light",
                    "dark:hover:bg-pink-35",
                    "dark:ring-pink-55",
                    "dark:ring-offset-dark",
                ],
                gray: [
                    "bg-gray-75",
                    "text-dark",
                    "hover:bg-gray-55",
                    "ring-gray-45",
                    "ring-offset-light",

                    "dark:bg-gray-45",
                    "dark:text-light",
                    "dark:hover:bg-gray-35",
                    "dark:ring-gray-55",
                    "dark:ring-offset-dark",
                ],
            },
            variant: {
                default: [
                    "font-mono",

                    "border",
                    "border-l-3",
                    "border-b-3",
                    "active:border-l",
                    "active:border-b",
                ],
                outline: [
                    "font-mono",
                    "border",
                    "border-l-3",
                    "border-b-3",
                    "active:border-l",
                    "active:border-b",
                ],
                link: [
                    "font-normal",
                    "underline",
                    "bg-transparent",
                    "dark:bg-transparent",
                ],
            },
            size: {
                sm: ["h-9", "px-3", "text-sm"],
                md: ["h-10", "px-4", "py-2"],
                lg: ["h-11", "px-8", "text-lg"],
            },
            icon: {
                true: [],
                false: [],
            },
            active: {
                true: [],
                false: [],
            },
        },
        compoundVariants: [
            // ICON x SIZE
            {
                icon: true,
                size: "md",
                className: ["p-3"],
            },
            {
                icon: true,
                size: "sm",
                className: ["p-2"],
            },
            {
                icon: true,
                size: "lg",
                className: ["p-4"],
            },

            // LINK x SIZE
            {
                variant: "link",
                size: "md",
                active: [true, false],
                className: ["h-auto", "w-fit", "p-0", "px-1"],
            },

            // LINK x COLOR
            {
                variant: "link",
                color: "blue",
                className: [
                    "hover:bg-blue-85/70",
                    "text-blue-25",

                    "dark:hover:bg-blue-25/70",
                    "dark:text-blue-85",
                ],
            },
            {
                variant: "link",
                color: "pink",
                className: [
                    "hover:bg-pink-85/70",
                    "text-pink-25",

                    "dark:hover:bg-pink-25/70",
                    "dark:text-pink-85",
                ],
            },
            {
                variant: "link",
                color: "gray",
                className: [
                    "hover:bg-gray-85/70",
                    "text-gray-25",

                    "dark:hover:bg-gray-25/70",
                    "dark:text-gray-85",
                ],
            },

            // LINK x ACTIVE x COLOR
            {
                variant: "link",
                color: "blue",
                active: true,
                className: [
                    "font-bold",
                    "hover:bg-blue-85/70",
                    "text-blue-25",

                    "dark:hover:bg-blue-25/70",
                    "dark:text-blue-85",
                ],
            },
            {
                variant: "link",
                color: "pink",
                active: true,
                className: [
                    "font-bold",
                    "hover:bg-pink-85/70",
                    "text-pink-25",

                    "dark:hover:bg-pink-25/70",
                    "dark:text-pink-85",
                ],
            },
            {
                variant: "link",
                color: "gray",
                active: true,
                className: [
                    "font-bold",
                    "hover:bg-gray-85/70",
                    "text-gray-25",

                    "dark:hover:bg-gray-25/70",
                    "dark:text-gray-85",
                ],
            },

            // OUTLINE x COLOR
            {
                variant: "outline",
                color: "blue",
                className: [
                    "bg-transparent",
                    "border-blue-45",
                    "hover:bg-blue-85/70",
                    "color-blue-65",
                    "fill-blue-65",

                    "dark:bg-transparent",
                    "dark:border-blue-45",
                    "dark:hover:bg-blue-15/70",
                ],
            },
            {
                variant: "outline",
                color: "pink",
                className: [
                    "bg-transparent",
                    "border-pink-45",
                    "hover:bg-pink-85/70",
                    "color-pink-65",
                    "fill-pink-65",

                    "dark:bg-transparent",
                    "dark:border-pink-45",
                    "dark:hover:bg-pink-15/70",
                ],
            },
            {
                variant: "outline",
                color: "gray",
                className: [
                    "bg-transparent",
                    "border-gray-45",
                    "hover:bg-gray-85/70",
                    "color-gray-65",
                    "fill-gray-65",

                    "dark:bg-transparent",
                    "dark:border-gray-45",
                    "dark:hover:bg-gray-15/70",
                ],
            },
        ],
        defaultVariants: {
            variant: "default",
            color: "blue",
            icon: false,
            active: false,
            size: "md",
        },
    },
);
