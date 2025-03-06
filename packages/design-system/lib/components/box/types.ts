import { HTMLAttributes, JSX } from "react";

export type Component<T> = T & {
    as?: keyof JSX.IntrinsicElements;
};

export type BoxProps<T = HTMLAttributes<HTMLDivElement>> = Component<T>;
