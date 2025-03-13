import type { HTMLMotionProps } from "motion/react";

export type LogoProps = {
    type: "vertical" | "horizontal";
    color: "primary" | "secondary";
    theme?: "light" | "dark";
} & React.HTMLAttributes<HTMLDivElement> &
    HTMLMotionProps<"div">;
