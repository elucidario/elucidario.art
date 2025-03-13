import type { HTMLMotionProps } from "motion/react";

export type LogoProps = {
    type: "vertical" | "horizontal" | null;
    color: "primary" | "secondary";
    theme?: "light" | "dark";
} & React.HTMLAttributes<HTMLDivElement> &
    HTMLMotionProps<"div">;
