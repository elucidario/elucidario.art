import { HTMLMotionProps } from "motion/react";

export type HeaderProps = React.PropsWithChildren<
    React.HTMLAttributes<HTMLDivElement> & HTMLMotionProps<"div">
>;
