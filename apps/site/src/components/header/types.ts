import { HTMLMotionProps } from "motion/react";

export type HeaderProps<T> = React.PropsWithChildren<
    React.HTMLAttributes<HTMLDivElement> & HTMLMotionProps<"div"> & T
>;
