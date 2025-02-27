export type Component<T> = T & {
    as?: keyof JSX.IntrinsicElements;
};
