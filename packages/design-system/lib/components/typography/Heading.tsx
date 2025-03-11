import { HeadingProps } from "./types";
import { cva } from "class-variance-authority";

export const headingVariants = cva(["heading", "font-bold"], {
    variants: {
        level: {
            1: ["text-3xl", "lg:text-5xl"],
            2: ["text-2xl", "lg:text-4xl"],
            3: ["text-xl", "lg:text-3xl"],
            4: ["text-lg", "lg:text-2xl"],
            5: ["text-lg", "lg:text-xl"],
            6: ["text-base", "lg:text-lg"],
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
