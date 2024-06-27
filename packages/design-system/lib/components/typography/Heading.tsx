import { HeadingProps } from "@elucidario/types-design-system";
import { cva } from "class-variance-authority";
import React from "react";

export const headingVariants = cva(["heading", "font-bold"], {
    variants: {
        level: {
            1: ["text-4xl"],
            2: ["text-3xl"],
            3: ["text-2xl"],
            4: ["text-xl"],
            5: ["text-lg"],
            6: ["text-base"],
        },
    },
    defaultVariants: {
        level: 1,
    },
});

export function Heading({
    level = 1,
    className,
    children,
    ...props
}: HeadingProps) {
    const Tag: React.ElementType = `h${level}`;
    return (
        <Tag className={headingVariants({ level, className })} {...props}>
            {children}
        </Tag>
    );
}
