import { HeadingProps } from "./types";
import { cva } from "class-variance-authority";
import { motion } from "motion/react";

export const headingVariants = cva(["heading", "font-bold"], {
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

export function Heading({
    level = 1,
    className,
    children,
    ...props
}: HeadingProps) {
    const Tag: React.ElementType = `h${level}`;
    const MotionComponent = motion.create(Tag);
    return (
        <MotionComponent
            className={headingVariants({ level, className })}
            {...props}
        >
            {children}
        </MotionComponent>
    );
}
